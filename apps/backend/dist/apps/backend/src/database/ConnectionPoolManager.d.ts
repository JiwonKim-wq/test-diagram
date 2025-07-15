import { DatabaseConnector } from './DatabaseConnector';
import { DatabaseConnectionConfig } from '@diagram/common';
/**
 * 데이터베이스 연결 풀을 관리하는 클래스
 */
export declare class ConnectionPoolManager {
    private static instance;
    private connections;
    private connectionConfigs;
    private constructor();
    /**
     * 싱글톤 인스턴스 반환
     */
    static getInstance(): ConnectionPoolManager;
    /**
     * 연결 생성 또는 기존 연결 반환
     */
    getConnection(config: DatabaseConnectionConfig): Promise<DatabaseConnector>;
    /**
     * 특정 연결 제거
     */
    removeConnection(config: DatabaseConnectionConfig): Promise<void>;
    /**
     * 모든 연결 제거
     */
    removeAllConnections(): Promise<void>;
    /**
     * 연결 상태 체크 및 정리
     */
    healthCheck(): Promise<void>;
    /**
     * 활성 연결 목록 반환
     */
    getActiveConnections(): Array<{
        key: string;
        config: DatabaseConnectionConfig;
        status: any;
    }>;
    /**
     * 연결 키 생성
     */
    private generateConnectionKey;
    /**
     * 데이터베이스 타입에 따른 커넥터 생성
     */
    private createConnector;
}
//# sourceMappingURL=ConnectionPoolManager.d.ts.map