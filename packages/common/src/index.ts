// 데이터베이스 타입 export
export * from './types/database';

// 노드 타입 export
export * from './types/nodes';

// 데이터 처리 타입 export
export * from './types/dataProcessing';

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