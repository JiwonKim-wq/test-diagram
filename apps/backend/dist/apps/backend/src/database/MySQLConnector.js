"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLConnector = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const common_1 = require("@diagram/common");
const DatabaseConnector_1 = require("./DatabaseConnector");
/**
 * MySQL 데이터베이스 연결을 관리하는 클래스
 */
class MySQLConnector extends DatabaseConnector_1.DatabaseConnector {
    constructor() {
        super(...arguments);
        this.pool = null;
    }
    /**
     * MySQL 데이터베이스에 연결
     */
    async connect(config) {
        try {
            // 설정 검증
            this.validateConfig(config);
            // 기존 연결이 있다면 해제
            if (this.connected) {
                await this.disconnect();
            }
            // SSL 설정 처리
            let sslConfig = undefined;
            if (config.ssl && config.sslOptions) {
                sslConfig = config.sslOptions;
            }
            else if (config.ssl) {
                sslConfig = true;
            }
            // 연결 풀 생성
            this.pool = promise_1.default.createPool({
                host: config.host,
                port: config.port,
                user: config.username,
                password: config.password,
                database: config.database,
                waitForConnections: true,
                connectionLimit: config.maxConnections || 10,
                queueLimit: 0,
                ssl: sslConfig
            });
            // 연결 테스트
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            this.config = config;
            this.connected = true;
        }
        catch (error) {
            this.connected = false;
            this.pool = null;
            if (error.code === 'ECONNREFUSED') {
                throw new common_1.ConnectionError(`데이터베이스 서버에 연결할 수 없습니다: ${config.host}:${config.port}`, config.host, config.port);
            }
            else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                throw new common_1.ConnectionError('인증에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.', config.host, config.port);
            }
            else if (error.code === 'ER_BAD_DB_ERROR') {
                throw new common_1.ConnectionError(`데이터베이스 '${config.database}'를 찾을 수 없습니다.`, config.host, config.port);
            }
            else if (error.code === 'ETIMEDOUT') {
                throw new common_1.TimeoutError('연결 시간이 초과되었습니다.', config.connectionTimeout || 30000);
            }
            else {
                throw new common_1.ConnectionError(`연결 실패: ${error.message}`, config.host, config.port);
            }
        }
    }
    /**
     * MySQL 데이터베이스 연결 해제
     */
    async disconnect() {
        if (this.pool) {
            try {
                await this.pool.end();
            }
            catch (error) {
                // 로그만 남기고 에러는 무시
                console.warn('연결 해제 중 에러 발생:', error);
            }
            this.pool = null;
        }
        this.connected = false;
        this.config = null;
        this.activeQueries.clear();
    }
    /**
     * 연결 상태 정보 반환
     */
    getStatus() {
        return {
            id: this.connectionId,
            isConnected: this.connected,
            lastConnectedAt: this.connected ? new Date() : undefined,
            lastError: undefined,
            connectionCount: this.pool ? 1 : 0, // 실제 구현에서는 풀의 연결 수를 반환
            maxConnections: this.config?.maxConnections || 10,
            activeQueries: this.getActiveQueryCount()
        };
    }
    /**
     * 쿼리 실행
     */
    async executeQuery(query, params = [], options = {}) {
        if (!this.connected || !this.pool) {
            throw new common_1.ConnectionError('데이터베이스에 연결되지 않았습니다', '', 0);
        }
        const queryId = this.generateQueryId();
        this.addActiveQuery(queryId);
        try {
            const { result, executionTime } = await this.measureExecutionTime(async () => {
                const connection = await this.pool.getConnection();
                try {
                    // 타임아웃 설정
                    if (options.timeout) {
                        await connection.query(`SET SESSION wait_timeout = ${Math.ceil(options.timeout / 1000)}`);
                    }
                    // 쿼리 실행
                    const [rows, fields] = await connection.execute(query, params);
                    return { rows, fields };
                }
                finally {
                    connection.release();
                }
            });
            // 결과 처리
            const queryResult = {
                queryId,
                executionTime,
                rows: Array.isArray(result.rows) ? result.rows : [],
                columns: result.fields ? result.fields.map((field) => field.name) : [],
                affectedRows: result.rows?.affectedRows,
                insertId: result.rows?.insertId
            };
            // maxRows 제한 적용
            if (options.maxRows && queryResult.rows.length > options.maxRows) {
                queryResult.rows = queryResult.rows.slice(0, options.maxRows);
            }
            return queryResult;
        }
        catch (error) {
            if (error.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
                throw new common_1.TimeoutError('쿼리 실행 시간이 초과되었습니다.', options.timeout || 60000);
            }
            else if (error.sqlState) {
                throw new common_1.QueryError(error.message, query, error.sqlState, error.errno);
            }
            else {
                throw new common_1.QueryError(`쿼리 실행 실패: ${error.message}`, query);
            }
        }
        finally {
            this.removeActiveQuery(queryId);
        }
    }
    /**
     * 연결 테스트
     */
    async testConnection() {
        if (!this.connected || !this.pool) {
            return false;
        }
        try {
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.MySQLConnector = MySQLConnector;
