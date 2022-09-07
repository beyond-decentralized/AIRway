import { Injected, lib } from '@airport/direction-indicator';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

let Client = class Client {
    constructor() {
        // encryptionKey = process.env.ENCRYPTION_KEY
        this.serverLocationProtocol = 'http://';
    }
    async getRepositoryTransactions(location, repositoryGUID, sinceSyncTimestamp = null) {
        try {
            const response = await this.sendMessage(location + '/read', {
                repositoryGUID,
                syncTimestamp: sinceSyncTimestamp
            });
            if (response.error) {
                console.error(response.error);
                return [];
            }
            return response.fragments;
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    async sendRepositoryTransactions(location, repositoryGUID, messages) {
        try {
            const response = await this.sendMessage(location + '/write', {
                messages,
                repositoryGUID
            });
            if (response.error) {
                console.error(response.error);
                return 0;
            }
            return response.syncTimestamp;
        }
        catch (e) {
            console.error(e);
            return 0;
        }
    }
    async sendMessage(location, request) {
        let packagedMessage = JSON.stringify(request);
        // if (this.encryptionKey) {
        //     packagedMessage = await encryptString(
        //         packagedMessage, this.encryptionKey)
        // }
        const response = await fetch(this.serverLocationProtocol + location, {
            method: 'PUT',
            mode: 'cors',
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: packagedMessage // body data type must match "Content-Type" header
        });
        // let unpackagedMessage = response.text()
        // if (this.encryptionKey) {
        //     unpackagedMessage = await decryptString(unpackagedMessage, this.encryptionKey)
        // }
        // return JSON.parse(unpackagedMessage)
        return response.json();
    }
};
Client = __decorate([
    Injected()
], Client);

// import {
//     decryptString,
//     encryptString,
// } from "string-cipher";
const client = lib('client');
const CLIENT = client.token({
    class: Client,
    interface: 'IClient',
    token: 'IClient'
});

export { CLIENT, Client };
//# sourceMappingURL=index.mjs.map
