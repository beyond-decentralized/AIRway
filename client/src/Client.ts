import { Injected } from '@airport/direction-indicator';
import type { IRepositoryBlock, RepositoryBlock_SyncTimestamp, RepositoryBlocksReadRequest, RepositoryBlocksReadResponse, RepositoryBlockWriteRequest, RepositoryBlockWriteResponse } from '@airport/ground-control';

export interface IClient {

    getRepositoryTransactions(
        location: string,
        repositoryGUID: string,
        sinceSyncTimestamp?: number
    ): Promise<IRepositoryBlock[]>

    sendRepositoryTransactions(
        location: string,
        repositoryGUID: string,
        messages: IRepositoryBlock[]
    ): Promise<RepositoryBlock_SyncTimestamp>

}

@Injected()
export class Client
    implements IClient {

    // encryptionKey = process.env.ENCRYPTION_KEY
    serverLocationProtocol = 'http://'

    async getRepositoryTransactions(
        location: string,
        repositoryGUID: string,
        sinceSyncTimestamp: number = null
    ): Promise<IRepositoryBlock[]> {
        try {
            const response = await this.sendMessage<
                RepositoryBlocksReadRequest,
                RepositoryBlocksReadResponse>(location + '/read', {
                    repositoryGUID,
                    syncTimestamp: sinceSyncTimestamp
                })
            if (response.error) {
                console.error(response.error)
                return []
            }
            return response.blocks
        } catch (e) {
            console.error(e)
            return []
        }
    }

    async sendRepositoryTransactions(
        location: string,
        repositoryGUID: string,
        blocks: IRepositoryBlock[]
    ): Promise<RepositoryBlock_SyncTimestamp> {
        try {
            const response = await this.sendMessage<
                RepositoryBlockWriteRequest,
                RepositoryBlockWriteResponse
            >(location + '/write', {
                blocks,
                repositoryGUID
            })
            if (response.error) {
                console.error(response.error)
                return 0
            }
            return response.syncTimestamp
        } catch (e) {
            console.error(e)
            return 0
        }

    }

    private async sendMessage<Req, Res>(
        location: string,
        request: Req
    ): Promise<Res> {
        let packagedMessage = JSON.stringify(request)
        // if (this.encryptionKey) {
        //     packagedMessage = await encryptString(
        //         packagedMessage, this.encryptionKey)
        // }
        const response = await fetch(
            this.serverLocationProtocol + location, {
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
        })


        // let unpackagedMessage = response.text()
        // if (this.encryptionKey) {
        //     unpackagedMessage = await decryptString(unpackagedMessage, this.encryptionKey)
        // }

        // return JSON.parse(unpackagedMessage)
        return response.json()
    }

}
