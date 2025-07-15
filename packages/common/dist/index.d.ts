export * from './types/database';
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
export interface BaseNode {
    id: string;
    type: string;
    position: {
        x: number;
        y: number;
    };
    data: any;
}
export interface DatabaseNodeConfig {
    type: 'mysql' | 'logpresso';
    connection: DatabaseConnection;
    query: string;
}
export interface ProcessingNodeConfig {
    type: 'filter' | 'aggregate' | 'transform';
    rules: ProcessingRules;
}
export interface ProcessingRules {
    filter?: FilterRule[];
    aggregate?: AggregateRule[];
    transform?: TransformRule[];
}
export interface FilterRule {
    column: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in' | 'not_in';
    value: any;
    dataType: 'string' | 'number' | 'boolean' | 'date';
}
export interface AggregateRule {
    column: string;
    function: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';
    groupBy?: string[];
    alias?: string;
}
export interface TransformRule {
    column: string;
    type: 'rename' | 'cast' | 'format' | 'calculate';
    config: any;
    alias?: string;
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