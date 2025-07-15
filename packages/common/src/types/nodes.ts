// 노드 기본 인터페이스
export interface BaseNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  selected?: boolean;
  dragging?: boolean;
  width?: number;
  height?: number;
  zIndex?: number;
}

// 노드 타입 열거형
export enum NodeType {
  DATABASE = 'database',
  FILTER = 'filter',
  AGGREGATE = 'aggregate',
  TRANSFORM = 'transform',
  JOIN = 'join',
  OUTPUT = 'output',
  PYTHON = 'python',
  LOGPRESSO = 'logpresso'
}

// 노드 데이터 기본 인터페이스
export interface NodeData {
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  isValid?: boolean;
  errors?: string[];
  warnings?: string[];
}

// 데이터베이스 노드 데이터
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

// 필터 노드 데이터
export interface FilterNodeData extends NodeData {
  filters: FilterRule[];
  operator: 'AND' | 'OR';
}

// 필터 규칙
export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array';
  caseSensitive?: boolean;
  enabled?: boolean;
}

// 필터 연산자
export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IN = 'in',
  NOT_IN = 'notIn',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
  REGEX = 'regex',
  BETWEEN = 'between'
}

// 집계 노드 데이터
export interface AggregateNodeData extends NodeData {
  groupBy: string[];
  aggregations: AggregationRule[];
  having?: FilterRule[];
  orderBy?: OrderByRule[];
}

// 집계 규칙
export interface AggregationRule {
  id: string;
  field: string;
  function: AggregateFunction;
  alias?: string;
  distinct?: boolean;
  enabled?: boolean;
}

// 집계 함수
export enum AggregateFunction {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  FIRST = 'first',
  LAST = 'last',
  STDDEV = 'stddev',
  VARIANCE = 'variance'
}

// 정렬 규칙
export interface OrderByRule {
  field: string;
  direction: 'ASC' | 'DESC';
}

// 변환 노드 데이터
export interface TransformNodeData extends NodeData {
  transformations: TransformationRule[];
}

// 변환 규칙
export interface TransformationRule {
  id: string;
  sourceField: string;
  targetField: string;
  function: TransformFunction;
  parameters?: Record<string, any>;
  enabled?: boolean;
}

// 변환 함수
export enum TransformFunction {
  RENAME = 'rename',
  CAST = 'cast',
  SUBSTRING = 'substring',
  REPLACE = 'replace',
  UPPER = 'upper',
  LOWER = 'lower',
  TRIM = 'trim',
  CONCAT = 'concat',
  SPLIT = 'split',
  DATE_FORMAT = 'dateFormat',
  MATH_OPERATION = 'mathOperation',
  CONDITIONAL = 'conditional',
  CUSTOM = 'custom'
}

// 조인 노드 데이터
export interface JoinNodeData extends NodeData {
  joinType: JoinType;
  leftKey: string;
  rightKey: string;
  conditions?: JoinCondition[];
}

// 조인 타입
export enum JoinType {
  INNER = 'inner',
  LEFT = 'left',
  RIGHT = 'right',
  FULL = 'full',
  CROSS = 'cross'
}

// 조인 조건
export interface JoinCondition {
  leftField: string;
  rightField: string;
  operator: FilterOperator;
}

// 출력 노드 데이터
export interface OutputNodeData extends NodeData {
  outputType: OutputType;
  format?: 'json' | 'csv' | 'excel' | 'pdf' | 'xml';
  destination?: string;
  filename?: string;
  options?: Record<string, any>;
}

// 출력 타입
export enum OutputType {
  DOWNLOAD = 'download',
  DATABASE = 'database',
  API = 'api',
  EMAIL = 'email',
  WEBHOOK = 'webhook',
  FILE_SYSTEM = 'fileSystem'
}

// 파이썬 노드 데이터
export interface PythonNodeData extends NodeData {
  code: string;
  inputVariables?: string[];
  outputVariables?: string[];
  libraries?: string[];
  timeout?: number;
  memoryLimit?: number;
}

// Logpresso 노드 데이터
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

// 노드 연결 (엣지)
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

// 다이어그램 전체 구조
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

// 노드 실행 결과
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

// 다이어그램 실행 컨텍스트
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

// 노드 유효성 검사 결과
export interface NodeValidationResult {
  nodeId: string;
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// 유효성 검사 오류
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

// 유효성 검사 경고
export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  suggestion?: string;
}

// 노드 템플릿
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
  configSchema: any; // JSON Schema for configuration
}

// 포트 정의
export interface PortDefinition {
  id: string;
  name: string;
  type: 'input' | 'output';
  dataType: string;
  required: boolean;
  description?: string;
}

// 노드 카테고리
export enum NodeCategory {
  DATA_SOURCE = 'dataSource',
  PROCESSING = 'processing',
  ANALYSIS = 'analysis',
  OUTPUT = 'output',
  CUSTOM = 'custom'
}

// 노드 실행 상태
export enum NodeExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SKIPPED = 'skipped'
} 