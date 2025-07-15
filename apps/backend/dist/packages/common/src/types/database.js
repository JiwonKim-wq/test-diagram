"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.QueryError = exports.ConnectionError = exports.DatabaseError = void 0;
// 데이터베이스 에러 타입
class DatabaseError extends Error {
    constructor(message, code, sqlState, errno, query) {
        super(message);
        this.code = code;
        this.sqlState = sqlState;
        this.errno = errno;
        this.query = query;
        this.name = 'DatabaseError';
    }
}
exports.DatabaseError = DatabaseError;
// 연결 에러 타입
class ConnectionError extends DatabaseError {
    constructor(message, host, port) {
        super(message, 'CONNECTION_ERROR');
        this.host = host;
        this.port = port;
        this.name = 'ConnectionError';
    }
}
exports.ConnectionError = ConnectionError;
// 쿼리 에러 타입
class QueryError extends DatabaseError {
    constructor(message, query, sqlState, errno) {
        super(message, 'QUERY_ERROR', sqlState, errno, query);
        this.name = 'QueryError';
    }
}
exports.QueryError = QueryError;
// 타임아웃 에러 타입
class TimeoutError extends DatabaseError {
    constructor(message, timeoutMs) {
        super(message, 'TIMEOUT_ERROR');
        this.timeoutMs = timeoutMs;
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
