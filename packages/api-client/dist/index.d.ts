import { DatabaseNodeConfig, QueryResult, ApiResponse } from '@diagram/common';
export declare class DiagramApiClient {
    private client;
    constructor(baseURL?: string);
    testConnection(config: DatabaseNodeConfig): Promise<ApiResponse<boolean>>;
    executeQuery(config: DatabaseNodeConfig): Promise<ApiResponse<QueryResult>>;
    saveDiagram(diagram: any): Promise<ApiResponse<{
        id: string;
    }>>;
    loadDiagram(id: string): Promise<ApiResponse<any>>;
    getDiagrams(): Promise<ApiResponse<any[]>>;
    executeDiagram(diagramId: string): Promise<ApiResponse<any>>;
    getExecutionResult(executionId: string): Promise<ApiResponse<any>>;
}
export declare const apiClient: DiagramApiClient;
export type { DatabaseNodeConfig, QueryResult, ApiResponse } from '@diagram/common';
//# sourceMappingURL=index.d.ts.map