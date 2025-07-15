import { DatabaseConnectionStatus } from '@diagram/common';
export interface HealthCheckResult {
    totalConnections: number;
    healthyConnections: number;
    unhealthyConnections: number;
    connectionDetails: Array<{
        key: string;
        status: DatabaseConnectionStatus;
        isHealthy: boolean;
        lastChecked: Date;
    }>;
}
/**
 * 데이터베이스 연결 상태를 모니터링하는 클래스
 */
export declare class DatabaseHealthChecker {
    private static instance;
    private poolManager;
    private healthCheckInterval;
    private healthCheckIntervalMs;
    private constructor();
    /**
     * 싱글톤 인스턴스 반환
     */
    static getInstance(): DatabaseHealthChecker;
    /**
     * 정기적인 헬스 체크 시작
     */
    startHealthCheck(intervalMs?: number): void;
    /**
     * 헬스 체크 중지
     */
    stopHealthCheck(): void;
    /**
     * 즉시 헬스 체크 실행
     */
    performHealthCheck(): Promise<HealthCheckResult>;
    /**
     * 특정 연결의 상태 체크
     */
    checkConnectionHealth(connectionKey: string): Promise<{
        isHealthy: boolean;
        status: DatabaseConnectionStatus | null;
        error?: string;
    }>;
    /**
     * 연결 통계 정보 반환
     */
    getConnectionStatistics(): {
        totalConnections: number;
        connectionsByType: Record<string, number>;
        averageActiveQueries: number;
        totalActiveQueries: number;
    };
    /**
     * 헬스 체크 설정 정보 반환
     */
    getHealthCheckInfo(): {
        isRunning: boolean;
        intervalMs: number;
        nextCheckIn?: number;
    };
}
//# sourceMappingURL=DatabaseHealthChecker.d.ts.map