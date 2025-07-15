// 데이터베이스 연결 설정
export interface DatabaseConnectionConfig {
  id?: string;
  name?: string;
  type: 'mysql' | 'logpresso';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  connectionTimeout?: number;
  queryTimeout?: number;
  maxConnections?: number;
  ssl?: boolean;
  sslOptions?: {
    ca?: string;
    cert?: string;
    key?: string;
    rejectUnauthorized?: boolean;
  };
}

// 데이터베이스 연결 상태
export interface DatabaseConnectionStatus {
  id: string;
  isConnected: boolean;
  lastConnectedAt?: Date;
  lastError?: string;
  connectionCount: number;
  maxConnections: number;
  activeQueries: number;
}

// 쿼리 실행 결과
export interface QueryResult {
  rows: any[];
  columns: string[];
  affectedRows?: number;
  insertId?: number;
  executionTime: number;
  queryId: string;
}

// 쿼리 실행 옵션
export interface QueryOptions {
  timeout?: number;
  maxRows?: number;
  useCache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
}

// 데이터베이스 연결 풀 설정
export interface ConnectionPoolConfig {
  min: number;
  max: number;
  acquireTimeout: number;
  createTimeout: number;
  destroyTimeout: number;
  idleTimeout: number;
  reapInterval: number;
  createRetryInterval: number;
  propagateCreateError: boolean;
}

// 데이터베이스 연결 인터페이스
export interface DatabaseConnector {
  connect(config: DatabaseConnectionConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getStatus(): DatabaseConnectionStatus;
  executeQuery(query: string, params?: any[], options?: QueryOptions): Promise<QueryResult>;
  testConnection(): Promise<boolean>;
  getConnectionInfo(): DatabaseConnectionConfig;
}

// 데이터베이스 에러 타입
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public sqlState?: string,
    public errno?: number,
    public query?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// 연결 에러 타입
export class ConnectionError extends DatabaseError {
  constructor(message: string, public host: string, public port: number) {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

// 쿼리 에러 타입
export class QueryError extends DatabaseError {
  constructor(message: string, query: string, sqlState?: string, errno?: number) {
    super(message, 'QUERY_ERROR', sqlState, errno, query);
    this.name = 'QueryError';
  }
}

// 타임아웃 에러 타입
export class TimeoutError extends DatabaseError {
  constructor(message: string, public timeoutMs: number) {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
} 