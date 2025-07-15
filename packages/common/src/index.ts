// 데이터베이스 타입 export
export * from './types/database';

// 기본 데이터베이스 연결 타입 (호환성을 위해 유지)
export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'mysql' | 'logpresso';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  isConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 노드 기본 타입
export interface BaseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

// 데이터베이스 노드 설정
export interface DatabaseNodeConfig {
  type: 'mysql' | 'logpresso';
  connection: DatabaseConnection;
  query: string;
}

// 처리 노드 설정
export interface ProcessingNodeConfig {
  type: 'filter' | 'aggregate' | 'transform';
  rules: ProcessingRules;
}

// 처리 규칙 타입
export interface ProcessingRules {
  filter?: FilterRule[];
  aggregate?: AggregateRule[];
  transform?: TransformRule[];
}

// 필터 규칙
export interface FilterRule {
  column: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in' | 'not_in';
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'date';
}

// 집계 규칙
export interface AggregateRule {
  column: string;
  function: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';
  groupBy?: string[];
  alias?: string;
}

// 변환 규칙
export interface TransformRule {
  column: string;
  type: 'rename' | 'cast' | 'format' | 'calculate';
  config: any;
  alias?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp?: Date;
}

// 에러 타입
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
} 