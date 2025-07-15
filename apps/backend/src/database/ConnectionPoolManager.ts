import { DatabaseConnector } from './DatabaseConnector';
import { MySQLConnector } from './MySQLConnector';
import { DatabaseConnectionConfig, ConnectionError } from '@diagram/common';

/**
 * 데이터베이스 연결 풀을 관리하는 클래스
 */
export class ConnectionPoolManager {
  private static instance: ConnectionPoolManager;
  private connections: Map<string, DatabaseConnector> = new Map();
  private connectionConfigs: Map<string, DatabaseConnectionConfig> = new Map();

  private constructor() {}

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): ConnectionPoolManager {
    if (!ConnectionPoolManager.instance) {
      ConnectionPoolManager.instance = new ConnectionPoolManager();
    }
    return ConnectionPoolManager.instance;
  }

  /**
   * 연결 생성 또는 기존 연결 반환
   */
  async getConnection(config: DatabaseConnectionConfig): Promise<DatabaseConnector> {
    const connectionKey = this.generateConnectionKey(config);
    
    // 기존 연결이 있고 활성 상태인 경우 반환
    if (this.connections.has(connectionKey)) {
      const connector = this.connections.get(connectionKey)!;
      if (connector.isConnected()) {
        return connector;
      } else {
        // 연결이 끊어진 경우 제거
        this.connections.delete(connectionKey);
        this.connectionConfigs.delete(connectionKey);
      }
    }

    // 새로운 연결 생성
    const connector = this.createConnector(config);
    await connector.connect(config);
    
    this.connections.set(connectionKey, connector);
    this.connectionConfigs.set(connectionKey, config);
    
    return connector;
  }

  /**
   * 특정 연결 제거
   */
  async removeConnection(config: DatabaseConnectionConfig): Promise<void> {
    const connectionKey = this.generateConnectionKey(config);
    
    if (this.connections.has(connectionKey)) {
      const connector = this.connections.get(connectionKey)!;
      await connector.disconnect();
      this.connections.delete(connectionKey);
      this.connectionConfigs.delete(connectionKey);
    }
  }

  /**
   * 모든 연결 제거
   */
  async removeAllConnections(): Promise<void> {
    const disconnectPromises = Array.from(this.connections.values()).map(
      connector => connector.disconnect()
    );
    
    await Promise.all(disconnectPromises);
    this.connections.clear();
    this.connectionConfigs.clear();
  }

  /**
   * 연결 상태 체크 및 정리
   */
  async healthCheck(): Promise<void> {
    const keysToRemove: string[] = [];
    
    for (const [key, connector] of this.connections.entries()) {
      try {
        const isHealthy = await connector.testConnection();
        if (!isHealthy) {
          keysToRemove.push(key);
        }
      } catch (error) {
        keysToRemove.push(key);
      }
    }
    
    // 비정상 연결 제거
    for (const key of keysToRemove) {
      const connector = this.connections.get(key);
      if (connector) {
        await connector.disconnect();
      }
      this.connections.delete(key);
      this.connectionConfigs.delete(key);
    }
  }

  /**
   * 활성 연결 목록 반환
   */
  getActiveConnections(): Array<{ key: string; config: DatabaseConnectionConfig; status: any }> {
    const activeConnections: Array<{ key: string; config: DatabaseConnectionConfig; status: any }> = [];
    
    for (const [key, connector] of this.connections.entries()) {
      const config = this.connectionConfigs.get(key);
      if (config && connector.isConnected()) {
        activeConnections.push({
          key,
          config: connector.getConnectionInfo(),
          status: connector.getStatus()
        });
      }
    }
    
    return activeConnections;
  }

  /**
   * 연결 키 생성
   */
  private generateConnectionKey(config: DatabaseConnectionConfig): string {
    return `${config.type}_${config.host}_${config.port}_${config.database}_${config.username}`;
  }

  /**
   * 데이터베이스 타입에 따른 커넥터 생성
   */
  private createConnector(config: DatabaseConnectionConfig): DatabaseConnector {
    switch (config.type) {
      case 'mysql':
        return new MySQLConnector();
      case 'logpresso':
        // TODO: LogpressoConnector 구현 후 추가
        throw new ConnectionError('Logpresso 연결은 아직 지원되지 않습니다', config.host, config.port);
      default:
        throw new ConnectionError(`지원되지 않는 데이터베이스 타입: ${config.type}`, config.host, config.port);
    }
  }
} 