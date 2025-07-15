export interface DatabaseConnectionConfig {
    id?: string;
    name?: string;
    type: 'mysql' | 'logpresso';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    connectionTimeout?: number;
    queryTimeout?: number;
    maxConnections?: number;
    ssl?: boolean;
    sslOptions?: {
        ca?: string;
        cert?: string;
        key?: string;
        rejectUnauthorized?: boolean;
    };
}
export interface DatabaseConnectionStatus {
    id: string;
    isConnected: boolean;
    lastConnectedAt?: Date;
    lastError?: string;
    connectionCount: number;
    maxConnections: number;
    activeQueries: number;
}
export interface QueryResult {
    rows: any[];
    columns: string[];
    affectedRows?: number;
    insertId?: number;
    executionTime: number;
    queryId: string;
}
export interface QueryOptions {
    timeout?: number;
    maxRows?: number;
    useCache?: boolean;
    cacheKey?: string;
    cacheTTL?: number;
}
export interface ConnectionPoolConfig {
    min: number;
    max: number;
    acquireTimeout: number;
    createTimeout: number;
    destroyTimeout: number;
    idleTimeout: number;
    reapInterval: number;
    createRetryInterval: number;
    propagateCreateError: boolean;
}
export interface DatabaseConnector {
    connect(config: DatabaseConnectionConfig): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getStatus(): DatabaseConnectionStatus;
    executeQuery(query: string, params?: any[], options?: QueryOptions): Promise<QueryResult>;
    testConnection(): Promise<boolean>;
    getConnectionInfo(): DatabaseConnectionConfig;
}
export declare class DatabaseError extends Error {
    code: string;
    sqlState?: string | undefined;
    errno?: number | undefined;
    query?: string | undefined;
    constructor(message: string, code: string, sqlState?: string | undefined, errno?: number | undefined, query?: string | undefined);
}
export declare class ConnectionError extends DatabaseError {
    host: string;
    port: number;
    constructor(message: string, host: string, port: number);
}
export declare class QueryError extends DatabaseError {
    constructor(message: string, query: string, sqlState?: string, errno?: number);
}
export declare class TimeoutError extends DatabaseError {
    timeoutMs: number;
    constructor(message: string, timeoutMs: number);
}
//# sourceMappingURL=database.d.ts.map