import { ConnectionPoolManager } from './ConnectionPoolManager';
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
export class DatabaseHealthChecker {
  private static instance: DatabaseHealthChecker;
  private poolManager: ConnectionPoolManager;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private healthCheckIntervalMs: number = 30000; // 30초

  private constructor() {
    this.poolManager = ConnectionPoolManager.getInstance();
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): DatabaseHealthChecker {
    if (!DatabaseHealthChecker.instance) {
      DatabaseHealthChecker.instance = new DatabaseHealthChecker();
    }
    return DatabaseHealthChecker.instance;
  }

  /**
   * 정기적인 헬스 체크 시작
   */
  startHealthCheck(intervalMs: number = 30000): void {
    this.healthCheckIntervalMs = intervalMs;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('헬스 체크 중 오류 발생:', error);
      }
    }, intervalMs);

    console.log(`데이터베이스 헬스 체크가 ${intervalMs}ms 간격으로 시작되었습니다.`);
  }

  /**
   * 헬스 체크 중지
   */
  stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('데이터베이스 헬스 체크가 중지되었습니다.');
    }
  }

  /**
   * 즉시 헬스 체크 실행
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const activeConnections = this.poolManager.getActiveConnections();
    const healthCheckResults: HealthCheckResult['connectionDetails'] = [];
    
    let healthyCount = 0;
    let unhealthyCount = 0;

    for (const connection of activeConnections) {
      const checkStartTime = Date.now();
      let isHealthy = false;
      
      try {
        // 연결 상태 테스트
        const connector = await this.poolManager.getConnection(connection.config);
        isHealthy = await connector.testConnection();
        
        if (isHealthy) {
          healthyCount++;
        } else {
          unhealthyCount++;
        }
      } catch (error) {
        isHealthy = false;
        unhealthyCount++;
        console.warn(`연결 ${connection.key} 헬스 체크 실패:`, error);
      }

      healthCheckResults.push({
        key: connection.key,
        status: connection.status,
        isHealthy,
        lastChecked: new Date()
      });
    }

    // 비정상 연결 정리
    await this.poolManager.healthCheck();

    const result: HealthCheckResult = {
      totalConnections: activeConnections.length,
      healthyConnections: healthyCount,
      unhealthyConnections: unhealthyCount,
      connectionDetails: healthCheckResults
    };

    // 헬스 체크 결과 로깅
    if (unhealthyCount > 0) {
      console.warn(`헬스 체크 완료: ${healthyCount}개 정상, ${unhealthyCount}개 비정상`);
    } else {
      console.log(`헬스 체크 완료: 모든 ${healthyCount}개 연결이 정상입니다.`);
    }

    return result;
  }

  /**
   * 특정 연결의 상태 체크
   */
  async checkConnectionHealth(connectionKey: string): Promise<{
    isHealthy: boolean;
    status: DatabaseConnectionStatus | null;
    error?: string;
  }> {
    const activeConnections = this.poolManager.getActiveConnections();
    const connection = activeConnections.find(conn => conn.key === connectionKey);
    
    if (!connection) {
      return {
        isHealthy: false,
        status: null,
        error: '연결을 찾을 수 없습니다'
      };
    }

    try {
      const connector = await this.poolManager.getConnection(connection.config);
      const isHealthy = await connector.testConnection();
      
      return {
        isHealthy,
        status: connector.getStatus()
      };
    } catch (error) {
      return {
        isHealthy: false,
        status: connection.status,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  }

  /**
   * 연결 통계 정보 반환
   */
  getConnectionStatistics(): {
    totalConnections: number;
    connectionsByType: Record<string, number>;
    averageActiveQueries: number;
    totalActiveQueries: number;
  } {
    const activeConnections = this.poolManager.getActiveConnections();
    const connectionsByType: Record<string, number> = {};
    let totalActiveQueries = 0;

    for (const connection of activeConnections) {
      const dbType = connection.config.type;
      connectionsByType[dbType] = (connectionsByType[dbType] || 0) + 1;
      totalActiveQueries += connection.status.activeQueries || 0;
    }

    return {
      totalConnections: activeConnections.length,
      connectionsByType,
      averageActiveQueries: activeConnections.length > 0 ? totalActiveQueries / activeConnections.length : 0,
      totalActiveQueries
    };
  }

  /**
   * 헬스 체크 설정 정보 반환
   */
  getHealthCheckInfo(): {
    isRunning: boolean;
    intervalMs: number;
    nextCheckIn?: number;
  } {
    return {
      isRunning: this.healthCheckInterval !== null,
      intervalMs: this.healthCheckIntervalMs,
      nextCheckIn: this.healthCheckInterval ? this.healthCheckIntervalMs : undefined
    };
  }
} 