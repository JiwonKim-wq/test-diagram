import { AxiosResponse } from 'axios';
import { DatabaseNodeConfig, QueryResult, ApiResponse, FilterRule, AggregationRule, TransformRule, ProcessingResult } from '@diagram/common';
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
    filterData(data: any[], filterRules: FilterRule[]): Promise<ApiResponse<any[]>>;
    aggregateData(data: any[], aggregateRules: AggregationRule[], groupBy?: string[]): Promise<ApiResponse<any[]>>;
    transformData(data: any[], transformRules: TransformRule[]): Promise<ApiResponse<any[]>>;
    processData(data: any[], filterRules?: FilterRule[], aggregateRules?: AggregationRule[], transformRules?: TransformRule[], groupBy?: string[]): Promise<ApiResponse<ProcessingResult>>;
}
export declare const apiClient: DiagramApiClient;
export type { DatabaseNodeConfig, QueryResult, ApiResponse, FilterRule, AggregationRule, TransformRule, ProcessingResult, FilterOperator, AggregateFunction, TransformType, TransformOperation } from '@diagram/common';
//# sourceMappingURL=index.d.ts.map