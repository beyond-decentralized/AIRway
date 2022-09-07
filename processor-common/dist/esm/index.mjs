import Fastify from 'fastify';

var ServerState;
(function (ServerState) {
    ServerState["RUNNING"] = "RUNNING";
    ServerState["SHUTTING_DOWN_REQUESTS"] = "SHUTTING_DOWN_REQUESTS";
    ServerState["SHUTTING_DOWN_SERVER"] = "SHUTTING_DOWN_SERVER";
})(ServerState || (ServerState = {}));
var ServerError;
(function (ServerError) {
    ServerError["DATABASE"] = "DATABASE";
    ServerError["INVALID"] = "INVALID";
    ServerError["SHUTDOWN"] = "SHUTDOWN";
})(ServerError || (ServerError = {}));

class BasicServer {
    constructor(opts) {
        this.serverState = ServerState.RUNNING;
        this.fastify = Fastify(opts);
        const _this = this;
        process.on('SIGINT', () => {
            console.log('SIGINT signal received, shutting down.');
            _this.shutdown();
        });
        process.on('SIGTERM', () => {
            console.info('SIGTERM signal received, shutting down.');
            _this.shutdown();
        });
        process.on('uncaughtException', function (error) {
            console.log('received uncaught exception, shutting down.', error);
            _this.shutdown();
        });
    }
    start(port = 80, address = '0.0.0.0') {
        this.doStart(port, address).then();
    }
    shutdown() {
        this.serverState = ServerState.SHUTTING_DOWN_REQUESTS;
        const shutdownIntervalHandle = setInterval(() => {
            console.log('Checking shutdown');
            if (this.serverState === ServerState.SHUTTING_DOWN_SERVER) {
                console.log('Removing shutdown check');
                clearInterval(shutdownIntervalHandle);
                console.log('Shutting down');
                this.shutdownServer();
            }
            else {
                console.log('NOT shutting down');
            }
            this.checkServerState();
        }, 5000);
    }
    setIntervalProcessing(callback, interval) {
        this.batchIntervalHandle = setInterval(() => {
            callback().then();
        }, interval);
        this.checkServerState();
    }
    async doStart(port, address) {
        try {
            await this.doStartResources();
            await this.fastify.listen(port, address);
        }
        catch (err) {
            try {
                this.fastify.log.error(err);
            }
            finally {
                process.exit(1);
            }
        }
    }
    async doStartResources() {
        // Overwrite if there are resources that must be started
    }
    shutdownServer() {
        console.log('Shutting Down Fastify');
        this.fastify.close().then(() => {
            console.log('httpserver shutdown successfully');
            this.shutdownResources();
        }, (err) => {
            console.log('error shutting down httpserver', err);
            this.shutdownResources();
        });
    }
    shutdownResources() {
        process.exit(0);
    }
    checkServerState() {
        if (this.serverState === ServerState.SHUTTING_DOWN_REQUESTS
            || this.serverState === ServerState.SHUTTING_DOWN_SERVER) {
            if (this.batchIntervalHandle) {
                clearInterval(this.batchIntervalHandle);
                this.batchIntervalHandle = null;
            }
            this.serverState = ServerState.SHUTTING_DOWN_SERVER;
        }
    }
}

export { BasicServer, ServerError, ServerState };
//# sourceMappingURL=index.mjs.map
