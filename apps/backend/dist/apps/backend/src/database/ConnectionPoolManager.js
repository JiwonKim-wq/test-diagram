"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPoolManager = void 0;
const MySQLConnector_1 = require("./MySQLConnector");
const common_1 = require("@diagram/common");
/**
 * 데이터베이스 연결 풀을 관리하는 클래스
 */
class ConnectionPoolManager {
    constructor() {
        this.connections = new Map();
        this.connectionConfigs = new Map();
    }
    /**
     * 싱글톤 인스턴스 반환
     */
    static getInstance() {
        if (!ConnectionPoolManager.instance) {
            ConnectionPoolManager.instance = new ConnectionPoolManager();
        }
        return ConnectionPoolManager.instance;
    }
    /**
     * 연결 생성 또는 기존 연결 반환
     */
    async getConnection(config) {
        const connectionKey = this.generateConnectionKey(config);
        // 기존 연결이 있고 활성 상태인 경우 반환
        if (this.connections.has(connectionKey)) {
            const connector = this.connections.get(connectionKey);
            if (connector.isConnected()) {
                return connector;
            }
            else {
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
    async removeConnection(config) {
        const connectionKey = this.generateConnectionKey(config);
        if (this.connections.has(connectionKey)) {
            const connector = this.connections.get(connectionKey);
            await connector.disconnect();
            this.connections.delete(connectionKey);
            this.connectionConfigs.delete(connectionKey);
        }
    }
    /**
     * 모든 연결 제거
     */
    async removeAllConnections() {
        const disconnectPromises = Array.from(this.connections.values()).map(connector => connector.disconnect());
        await Promise.all(disconnectPromises);
        this.connections.clear();
        this.connectionConfigs.clear();
    }
    /**
     * 연결 상태 체크 및 정리
     */
    async healthCheck() {
        const keysToRemove = [];
        for (const [key, connector] of this.connections.entries()) {
            try {
                const isHealthy = await connector.testConnection();
                if (!isHealthy) {
                    keysToRemove.push(key);
                }
            }
            catch (error) {
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
    getActiveConnections() {
        const activeConnections = [];
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
    generateConnectionKey(config) {
        return `${config.type}_${config.host}_${config.port}_${config.database}_${config.username}`;
    }
    /**
     * 데이터베이스 타입에 따른 커넥터 생성
     */
    createConnector(config) {
        switch (config.type) {
            case 'mysql':
                return new MySQLConnector_1.MySQLConnector();
            case 'logpresso':
                // TODO: LogpressoConnector 구현 후 추가
                throw new common_1.ConnectionError('Logpresso 연결은 아직 지원되지 않습니다', config.host, config.port);
            default:
                throw new common_1.ConnectionError(`지원되지 않는 데이터베이스 타입: ${config.type}`, config.host, config.port);
        }
    }
}
exports.ConnectionPoolManager = ConnectionPoolManager;
