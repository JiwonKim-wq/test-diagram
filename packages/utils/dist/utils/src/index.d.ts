export declare const generateId: () => string;
export * from './nodeValidation';
export * from './filtering/filterEngine';
export * from './aggregation/aggregateEngine';
export * from './transformation/transformEngine';
export declare const createError: (message: string, code?: string) => Error;
export declare const deepClone: <T>(obj: T) => T;
export declare const debounce: <T extends (...args: any[]) => void>(func: T, delay: number) => (...args: Parameters<T>) => void;
export declare const formatDate: (date: Date) => string;
//# sourceMappingURL=index.d.ts.map