import { DatabaseConnectionConfig, DatabaseConnectionStatus, QueryResult, QueryOptions } from '@diagram/common';
import { DatabaseConnector } from './DatabaseConnector';
/**
 * MySQL 데이터베이스 연결을 관리하는 클래스
 */
export declare class MySQLConnector extends DatabaseConnector {
    private pool;
    /**
     * MySQL 데이터베이스에 연결
     */
    connect(config: DatabaseConnectionConfig): Promise<void>;
    /**
     * MySQL 데이터베이스 연결 해제
     */
    disconnect(): Promise<void>;
    /**
     * 연결 상태 정보 반환
     */
    getStatus(): DatabaseConnectionStatus;
    /**
     * 쿼리 실행
     */
    executeQuery(query: string, params?: any[], options?: QueryOptions): Promise<QueryResult>;
    /**
     * 연결 테스트
     */
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=MySQLConnector.d.ts.map