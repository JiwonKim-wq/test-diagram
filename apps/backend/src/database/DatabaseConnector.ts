import { 
  DatabaseConnectionConfig, 
  DatabaseConnectionStatus, 
  QueryResult, 
  QueryOptions,
  ConnectionPoolConfig,
  DatabaseError,
  ConnectionError,
  QueryError,
  TimeoutError 
} from '@diagram/common';

/**
 * 데이터베이스 연결을 관리하는 추상 클래스
 */
export abstract class DatabaseConnector {
  protected config: DatabaseConnectionConfig | null = null;
  protected connected: boolean = false;
  protected connectionId: string;
  protected connectionPool: any = null;
  protected activeQueries: Set<string> = new Set();

  constructor() {
    this.connectionId = this.generateConnectionId();
  }

  /**
   * 데이터베이스에 연결
   */
  abstract connect(config: DatabaseConnectionConfig): Promise<void>;

  /**
   * 데이터베이스 연결 해제
   */
  abstract disconnect(): Promise<void>;

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * 연결 상태 정보 반환
   */
  abstract getStatus(): DatabaseConnectionStatus;

  /**
   * 쿼리 실행
   */
  abstract executeQuery(query: string, params?: any[], options?: QueryOptions): Promise<QueryResult>;

  /**
   * 연결 테스트
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * 연결 정보 반환 (비밀번호 마스킹)
   */
  getConnectionInfo(): DatabaseConnectionConfig {
    if (!this.config) {
      throw new ConnectionError('연결 정보가 없습니다', '', 0);
    }

    return {
      ...this.config,
      password: '****' // 보안상 마스킹
    };
  }

  /**
   * 연결 ID 생성
   */
  protected generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 쿼리 ID 생성
   */
  protected generateQueryId(): string {
    return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 쿼리 실행 시간 측정
   */
  protected async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; executionTime: number }> {
    const startTime = Date.now();
    const result = await fn();
    const executionTime = Date.now() - startTime;
    return { result, executionTime };
  }

  /**
   * 활성 쿼리 추가
   */
  protected addActiveQuery(queryId: string): void {
    this.activeQueries.add(queryId);
  }

  /**
   * 활성 쿼리 제거
   */
  protected removeActiveQuery(queryId: string): void {
    this.activeQueries.delete(queryId);
  }

  /**
   * 활성 쿼리 수 반환
   */
  protected getActiveQueryCount(): number {
    return this.activeQueries.size;
  }

  /**
   * 연결 설정 검증
   */
  protected validateConfig(config: DatabaseConnectionConfig): void {
    if (!config.host) {
      throw new ConnectionError('호스트가 필요합니다', config.host || '', config.port || 0);
    }
    if (!config.port || config.port <= 0 || config.port > 65535) {
      throw new ConnectionError('유효한 포트가 필요합니다', config.host, config.port || 0);
    }
    if (!config.database) {
      throw new ConnectionError('데이터베이스명이 필요합니다', config.host, config.port);
    }
    if (!config.username) {
      throw new ConnectionError('사용자명이 필요합니다', config.host, config.port);
    }
  }

  /**
   * 기본 연결 풀 설정 반환
   */
  protected getDefaultPoolConfig(): ConnectionPoolConfig {
    return {
      min: 1,
      max: this.config?.maxConnections || 10,
      acquireTimeout: 30000,
      createTimeout: 30000,
      destroyTimeout: 5000,
      idleTimeout: 300000,
      reapInterval: 1000,
      createRetryInterval: 200,
      propagateCreateError: false
    };
  }
} 