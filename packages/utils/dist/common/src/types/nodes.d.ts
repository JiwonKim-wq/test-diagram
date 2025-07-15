export interface BaseNode {
    id: string;
    type: NodeType;
    position: {
        x: number;
        y: number;
    };
    data: NodeData;
    selected?: boolean;
    dragging?: boolean;
    width?: number;
    height?: number;
    zIndex?: number;
}
export declare enum NodeType {
    DATABASE = "database",
    FILTER = "filter",
    AGGREGATE = "aggregate",
    TRANSFORM = "transform",
    JOIN = "join",
    OUTPUT = "output",
    PYTHON = "python",
    LOGPRESSO = "logpresso"
}
export interface NodeData {
    label: string;
    description?: string;
    icon?: string;
    color?: string;
    isValid?: boolean;
    errors?: string[];
    warnings?: string[];
}
export interface DatabaseNodeData extends NodeData {
    connectionId?: string;
    connectionConfig?: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
    query?: string;
    queryType: 'select' | 'insert' | 'update' | 'delete' | 'custom';
    parameters?: Record<string, any>;
    limit?: number;
    offset?: number;
    autoRefresh?: boolean;
    refreshInterval?: number;
}
export interface FilterNodeData extends NodeData {
    filters: FilterRule[];
    operator: 'AND' | 'OR';
}
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
export interface AggregateNodeData extends NodeData {
    groupBy: string[];
    aggregations: AggregationRule[];
    having?: FilterRule[];
    orderBy?: OrderByRule[];
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
export interface OrderByRule {
    field: string;
    direction: 'ASC' | 'DESC';
}
export interface TransformNodeData extends NodeData {
    transformations: TransformationRule[];
}
export interface TransformationRule {
    id: string;
    sourceField: string;
    targetField: string;
    function: TransformFunction;
    parameters?: Record<string, any>;
    enabled?: boolean;
}
export declare enum TransformFunction {
    RENAME = "rename",
    CAST = "cast",
    SUBSTRING = "substring",
    REPLACE = "replace",
    UPPER = "upper",
    LOWER = "lower",
    TRIM = "trim",
    CONCAT = "concat",
    SPLIT = "split",
    DATE_FORMAT = "dateFormat",
    MATH_OPERATION = "mathOperation",
    CONDITIONAL = "conditional",
    CUSTOM = "custom"
}
export interface JoinNodeData extends NodeData {
    joinType: JoinType;
    leftKey: string;
    rightKey: string;
    conditions?: JoinCondition[];
}
export declare enum JoinType {
    INNER = "inner",
    LEFT = "left",
    RIGHT = "right",
    FULL = "full",
    CROSS = "cross"
}
export interface JoinCondition {
    leftField: string;
    rightField: string;
    operator: FilterOperator;
}
export interface OutputNodeData extends NodeData {
    outputType: OutputType;
    format?: 'json' | 'csv' | 'excel' | 'pdf' | 'xml';
    destination?: string;
    filename?: string;
    options?: Record<string, any>;
}
export declare enum OutputType {
    DOWNLOAD = "download",
    DATABASE = "database",
    API = "api",
    EMAIL = "email",
    WEBHOOK = "webhook",
    FILE_SYSTEM = "fileSystem"
}
export interface PythonNodeData extends NodeData {
    code: string;
    inputVariables?: string[];
    outputVariables?: string[];
    libraries?: string[];
    timeout?: number;
    memoryLimit?: number;
}
export interface LogpressoNodeData extends NodeData {
    connectionId?: string;
    query: string;
    queryType: 'search' | 'stats' | 'chart' | 'custom';
    timeRange?: {
        from: Date;
        to: Date;
    };
    parameters?: Record<string, any>;
}
export interface NodeConnection {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    type?: 'default' | 'straight' | 'step' | 'smoothstep';
    animated?: boolean;
    style?: Record<string, any>;
    data?: any;
}
export interface Diagram {
    id: string;
    name: string;
    description?: string;
    nodes: BaseNode[];
    connections: NodeConnection[];
    viewport?: {
        x: number;
        y: number;
        zoom: number;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    tags?: string[];
    version?: string;
}
export interface NodeExecutionResult {
    nodeId: string;
    success: boolean;
    data?: any[];
    columns?: string[];
    error?: string;
    executionTime: number;
    rowCount?: number;
    timestamp: Date;
}
export interface DiagramExecutionContext {
    diagramId: string;
    executionId: string;
    nodes: BaseNode[];
    connections: NodeConnection[];
    results: Map<string, NodeExecutionResult>;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    startTime: Date;
    endTime?: Date;
    error?: string;
}
export interface NodeValidationResult {
    nodeId: string;
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}
export interface ValidationError {
    field: string;
    message: string;
    code: string;
    severity: 'error' | 'warning';
}
export interface ValidationWarning {
    field: string;
    message: string;
    code: string;
    suggestion?: string;
}
export interface NodeTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    color: string;
    nodeType: NodeType;
    defaultData: NodeData;
    inputPorts: PortDefinition[];
    outputPorts: PortDefinition[];
    configSchema: any;
}
export interface PortDefinition {
    id: string;
    name: string;
    type: 'input' | 'output';
    dataType: string;
    required: boolean;
    description?: string;
}
export declare enum NodeCategory {
    DATA_SOURCE = "dataSource",
    PROCESSING = "processing",
    ANALYSIS = "analysis",
    OUTPUT = "output",
    CUSTOM = "custom"
}
export declare enum NodeExecutionStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    SKIPPED = "skipped"
}
//# sourceMappingURL=nodes.d.ts.map