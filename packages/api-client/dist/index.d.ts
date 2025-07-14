export declare class ApiClient {
    private client;
    constructor(baseURL?: string);
    get<T = any>(url: string, params?: any): Promise<T>;
    post<T = any>(url: string, data?: any): Promise<T>;
    put<T = any>(url: string, data?: any): Promise<T>;
    delete<T = any>(url: string): Promise<T>;
}
export declare const apiClient: ApiClient;
export * from './database';
export * from './diagram';
//# sourceMappingURL=index.d.ts.map