export interface FilterRule {
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
    dataType: 'string' | 'number' | 'boolean' | 'date' | 'array';
    caseSensitive?: boolean;
    enabled?: boolean;
}
export declare enum FilterOperator {
    EQUALS = "equals",
    NOT_EQUALS = "notEquals",
    GREATER_THAN = "greaterThan",
    GREATER_THAN_OR_EQUAL = "greaterThanOrEqual",
    LESS_THAN = "lessThan",
    LESS_THAN_OR_EQUAL = "lessThanOrEqual",
    CONTAINS = "contains",
    NOT_CONTAINS = "notContains",
    STARTS_WITH = "startsWith",
    ENDS_WITH = "endsWith",
    IN = "in",
    NOT_IN = "notIn",
    IS_NULL = "isNull",
    IS_NOT_NULL = "isNotNull",
    REGEX = "regex",
    BETWEEN = "between"
}
export interface FilterGroup {
    id: string;
    operator: 'AND' | 'OR';
    rules: FilterRule[];
    groups?: FilterGroup[];
    enabled?: boolean;
}
export interface AggregationRule {
    id: string;
    field: string;
    function: AggregateFunction;
    alias?: string;
    distinct?: boolean;
    enabled?: boolean;
}
export declare enum AggregateFunction {
    COUNT = "count",
    SUM = "sum",
    AVG = "avg",
    MIN = "min",
    MAX = "max",
    FIRST = "first",
    LAST = "last",
    STDDEV = "stddev",
    VARIANCE = "variance"
}
export interface GroupByRule {
    field: string;
    alias?: string;
    enabled?: boolean;
}
export interface OrderByRule {
    field: string;
    direction: 'ASC' | 'DESC';
}
export interface TransformRule {
    id: string;
    type: TransformType;
    sourceField: string;
    targetField: string;
    operation: TransformOperation;
    parameters?: Record<string, any>;
    enabled?: boolean;
}
export declare enum TransformType {
    FIELD_MAPPING = "fieldMapping",
    DATA_TYPE_CONVERSION = "dataTypeConversion",
    CALCULATION = "calculation",
    STRING_MANIPULATION = "stringManipulation",
    DATE_MANIPULATION = "dateManipulation",
    CONDITIONAL = "conditional"
}
export declare enum TransformOperation {
    RENAME = "rename",
    COPY = "copy",
    TO_STRING = "toString",
    TO_NUMBER = "toNumber",
    TO_BOOLEAN = "toBoolean",
    TO_DATE = "toDate",
    ADD = "add",
    SUBTRACT = "subtract",
    MULTIPLY = "multiply",
    DIVIDE = "divide",
    MODULO = "modulo",
    UPPER_CASE = "upperCase",
    LOWER_CASE = "lowerCase",
    TRIM = "trim",
    SUBSTRING = "substring",
    REPLACE = "replace",
    SPLIT = "split",
    CONCAT = "concat",
    FORMAT_DATE = "formatDate",
    ADD_DAYS = "addDays",
    ADD_MONTHS = "addMonths",
    ADD_YEARS = "addYears",
    IF_THEN_ELSE = "ifThenElse",
    CASE_WHEN = "caseWhen"
}
export interface ProcessingResult {
    success: boolean;
    data: any[];
    error?: string;
    warnings?: string[];
    metadata?: {
        totalRecords: number;
        processedRecords: number;
        processingTime: number;
        affectedFields: string[];
    };
}
export interface ProcessingContext {
    nodeId: string;
    inputData: any[];
    configuration: any;
    metadata?: Record<string, any>;
}
export interface DataSchema {
    fields: DataField[];
    totalRecords?: number;
    sampleData?: any[];
}
export interface DataField {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
    nullable?: boolean;
    description?: string;
    constraints?: {
        min?: number;
        max?: number;
        pattern?: string;
        enum?: any[];
    };
}
//# sourceMappingURL=dataProcessing.d.ts.map