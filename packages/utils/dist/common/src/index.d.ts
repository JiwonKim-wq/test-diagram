export * from './types/database';
export * from './types/nodes';
export interface DatabaseConnection {
    id: string;
    name: string;
    type: 'mysql' | 'logpresso';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    isConnected: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    timestamp?: Date;
}
export interface AppError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
//# sourceMappingURL=index.d.ts.map