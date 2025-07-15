"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnector = void 0;
const common_1 = require("@diagram/common");
/**
 * 데이터베이스 연결을 관리하는 추상 클래스
 */
class DatabaseConnector {
    constructor() {
        this.config = null;
        this.connected = false;
        this.connectionPool = null;
        this.activeQueries = new Set();
        this.connectionId = this.generateConnectionId();
    }
    /**
     * 연결 상태 확인
     */
    isConnected() {
        return this.connected;
    }
    /**
     * 연결 정보 반환 (비밀번호 마스킹)
     */
    getConnectionInfo() {
        if (!this.config) {
            throw new common_1.ConnectionError('연결 정보가 없습니다', '', 0);
        }
        return {
            ...this.config,
            password: '****' // 보안상 마스킹
        };
    }
    /**
     * 연결 ID 생성
     */
    generateConnectionId() {
        return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * 쿼리 ID 생성
     */
    generateQueryId() {
        return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * 쿼리 실행 시간 측정
     */
    async measureExecutionTime(fn) {
        const startTime = Date.now();
        const result = await fn();
        const executionTime = Date.now() - startTime;
        return { result, executionTime };
    }
    /**
     * 활성 쿼리 추가
     */
    addActiveQuery(queryId) {
        this.activeQueries.add(queryId);
    }
    /**
     * 활성 쿼리 제거
     */
    removeActiveQuery(queryId) {
        this.activeQueries.delete(queryId);
    }
    /**
     * 활성 쿼리 수 반환
     */
    getActiveQueryCount() {
        return this.activeQueries.size;
    }
    /**
     * 연결 설정 검증
     */
    validateConfig(config) {
        if (!config.host) {
            throw new common_1.ConnectionError('호스트가 필요합니다', config.host || '', config.port || 0);
        }
        if (!config.port || config.port <= 0 || config.port > 65535) {
            throw new common_1.ConnectionError('유효한 포트가 필요합니다', config.host, config.port || 0);
        }
        if (!config.database) {
            throw new common_1.ConnectionError('데이터베이스명이 필요합니다', config.host, config.port);
        }
        if (!config.username) {
            throw new common_1.ConnectionError('사용자명이 필요합니다', config.host, config.port);
        }
    }
    /**
     * 기본 연결 풀 설정 반환
     */
    getDefaultPoolConfig() {
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
exports.DatabaseConnector = DatabaseConnector;
