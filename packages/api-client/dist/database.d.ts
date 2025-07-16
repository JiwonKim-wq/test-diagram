export declare const testDatabaseConnection: (connectionData: any) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const getDatabaseConnections: () => Promise<import("axios").AxiosResponse<any, any>>;
export declare const createDatabaseConnection: (connectionData: any) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const updateDatabaseConnection: (id: string, connectionData: any) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const deleteDatabaseConnection: (id: string) => Promise<import("axios").AxiosResponse<any, any>>;
export declare const executeQuery: (connectionId: string, query: string) => Promise<import("axios").AxiosResponse<any, any>>;
//# sourceMappingURL=database.d.ts.map