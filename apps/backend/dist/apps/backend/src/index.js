"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const database_1 = __importDefault(require("./routes/database"));
const DatabaseHealthChecker_1 = require("./database/DatabaseHealthChecker");
// 환경 변수 로드
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 미들웨어 설정
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// 기본 라우트
app.get('/', (req, res) => {
    res.json({
        message: '다이어그램 데이터 처리 시스템 API',
        version: '1.0.0',
        status: 'running'
    });
});
// API 라우터
app.use('/api/database', database_1.default);
// 에러 핸들링
app.use(errorHandler_1.errorHandler);
// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    // 데이터베이스 헬스 체크 시작
    const healthChecker = DatabaseHealthChecker_1.DatabaseHealthChecker.getInstance();
    healthChecker.startHealthCheck(60000); // 1분마다 체크
});
// 서버 종료 시 정리
process.on('SIGINT', async () => {
    console.log('\n서버를 종료합니다...');
    const healthChecker = DatabaseHealthChecker_1.DatabaseHealthChecker.getInstance();
    healthChecker.stopHealthCheck();
    process.exit(0);
});
exports.default = app;
