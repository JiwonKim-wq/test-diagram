import { AxiosResponse } from 'axios';
import { DatabaseNodeConfig, QueryResult, ApiResponse } from '@diagram/common';
export declare class DiagramApiClient {
    private client;
    constructor(baseURL?: string);
    get(url: string, config?: any): Promise<AxiosResponse<any, any>>;
    post(url: string, data?: any, config?: any): Promise<AxiosResponse<any, any>>;
    put(url: string, data?: any, config?: any): Promise<AxiosResponse<any, any>>;
    delete(url: string, config?: any): Promise<AxiosResponse<any, any>>;
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