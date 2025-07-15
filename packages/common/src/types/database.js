// 데이터베이스 에러 타입
export class DatabaseError extends Error {
    constructor(message, code, sqlState, errno, query) {
        super(message);
        this.code = code;
        this.sqlState = sqlState;
        this.errno = errno;
        this.query = query;
        this.name = 'DatabaseError';
    }
}
// 연결 에러 타입
export class ConnectionError extends DatabaseError {
    constructor(message, host, port) {
        super(message, 'CONNECTION_ERROR');
        this.host = host;
        this.port = port;
        this.name = 'ConnectionError';
    }
}
// 쿼리 에러 타입
export class QueryError extends DatabaseError {
    constructor(message, query, sqlState, errno) {
        super(message, 'QUERY_ERROR', sqlState, errno, query);
        this.name = 'QueryError';
    }
}
// 타임아웃 에러 타입
export class TimeoutError extends DatabaseError {
    constructor(message, timeoutMs) {
        super(message, 'TIMEOUT_ERROR');
        this.timeoutMs = timeoutMs;
        this.name = 'TimeoutError';
    }
}
