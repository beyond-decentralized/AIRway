import { RepositorySynchronizationMessage, RepositorySynchronizationReadResponseFragment } from '@airport/arrivals-n-departures';
import type { RepositoryTransactionHistory_SyncTimestamp } from '@airport/holding-pattern';
export interface IClient {
    getRepositoryTransactions(location: string, repositoryGUID: string, sinceSyncTimestamp?: number): Promise<RepositorySynchronizationReadResponseFragment[]>;
    sendRepositoryTransactions(location: string, repositoryGUID: string, messages: RepositorySynchronizationMessage[]): Promise<RepositoryTransactionHistory_SyncTimestamp>;
}
export declare class Client implements IClient {
    serverLocationProtocol: string;
    getRepositoryTransactions(location: string, repositoryGUID: string, sinceSyncTimestamp?: number): Promise<RepositorySynchronizationReadResponseFragment[]>;
    sendRepositoryTransactions(location: string, repositoryGUID: string, messages: RepositorySynchronizationMessage[]): Promise<RepositoryTransactionHistory_SyncTimestamp>;
    private sendMessage;
}
//# sourceMappingURL=Client.d.ts.map