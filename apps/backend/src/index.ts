import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import databaseRoutes from './routes/database';
import dataProcessingRoutes from './routes/dataProcessing';
import { DatabaseHealthChecker } from './database/DatabaseHealthChecker';

// 환경 변수 로드
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: '다이어그램 데이터 처리 시스템 API',
    version: '1.0.0',
    status: 'running'
  });
});

// API 라우터
app.use('/api/database', databaseRoutes);
app.use('/api/data-processing', dataProcessingRoutes);

// 에러 핸들링
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  
  // 데이터베이스 헬스 체크 시작
  const healthChecker = DatabaseHealthChecker.getInstance();
  healthChecker.startHealthCheck(60000); // 1분마다 체크
});

// 서버 종료 시 정리
process.on('SIGINT', async () => {
  console.log('\n서버를 종료합니다...');
  
  const healthChecker = DatabaseHealthChecker.getInstance();
  healthChecker.stopHealthCheck();
  
  process.exit(0);
});

export default app; 