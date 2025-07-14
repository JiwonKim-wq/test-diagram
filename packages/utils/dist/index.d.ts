export declare const generateId: () => string;
export declare const validateNode: (node: any) => boolean;
export declare const createError: (code: string, message: string, details?: Record<string, any>) => {
    code: string;
    message: string;
    details: Record<string, any> | undefined;
};
export declare const deepClone: <T>(obj: T) => T;
export declare const debounce: <T extends (...args: any[]) => void>(func: T, delay: number) => (...args: Parameters<T>) => void;
export declare const formatDate: (date: Date) => string;
//# sourceMappingURL=index.d.ts.map