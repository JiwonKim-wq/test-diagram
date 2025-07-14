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
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface Diagram {
    id: string;
    name: string;
    description?: string;
    nodes: BaseNode[];
    edges: DiagramEdge[];
    createdAt: Date;
    updatedAt: Date;
}
export interface DiagramEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    type?: string;
    data?: Record<string, any>;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface AppError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
//# sourceMappingURL=index.d.ts.map