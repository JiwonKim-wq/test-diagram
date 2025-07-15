import { DatabaseConnectionConfig, DatabaseConnectionStatus, QueryResult, QueryOptions, ConnectionPoolConfig } from '@diagram/common';
/**
 * 데이터베이스 연결을 관리하는 추상 클래스
 */
export declare abstract class DatabaseConnector {
    protected config: DatabaseConnectionConfig | null;
    protected connected: boolean;
    protected connectionId: string;
    protected connectionPool: any;
    protected activeQueries: Set<string>;
    constructor();
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
    isConnected(): boolean;
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
    getConnectionInfo(): DatabaseConnectionConfig;
    /**
     * 연결 ID 생성
     */
    protected generateConnectionId(): string;
    /**
     * 쿼리 ID 생성
     */
    protected generateQueryId(): string;
    /**
     * 쿼리 실행 시간 측정
     */
    protected measureExecutionTime<T>(fn: () => Promise<T>): Promise<{
        result: T;
        executionTime: number;
    }>;
    /**
     * 활성 쿼리 추가
     */
    protected addActiveQuery(queryId: string): void;
    /**
     * 활성 쿼리 제거
     */
    protected removeActiveQuery(queryId: string): void;
    /**
     * 활성 쿼리 수 반환
     */
    protected getActiveQueryCount(): number;
    /**
     * 연결 설정 검증
     */
    protected validateConfig(config: DatabaseConnectionConfig): void;
    /**
     * 기본 연결 풀 설정 반환
     */
    protected getDefaultPoolConfig(): ConnectionPoolConfig;
}
//# sourceMappingURL=DatabaseConnector.d.ts.map