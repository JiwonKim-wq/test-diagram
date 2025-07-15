"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // 로그 기록
    logger_1.logger.error(err);
    // 개발 환경에서는 상세 에러 정보 제공
    if (process.env.NODE_ENV === 'development') {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message,
            stack: err.stack
        });
    }
    else {
        // 프로덕션 환경에서는 간단한 에러 메시지만 제공
        res.status(error.statusCode || 500).json({
            success: false,
            error: 'Something went wrong'
        });
    }
};
exports.errorHandler = errorHandler;
