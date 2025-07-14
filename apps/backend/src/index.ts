import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './config/logger';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 보안 및 파싱 미들웨어
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// TODO: 라우터 추가
// app.use('/api/database', databaseRoutes);
// app.use('/api/diagrams', diagramRoutes);

// 에러 핸들링
app.use(errorHandler);

// 데이터베이스 연결 및 서버 시작
const startServer = async () => {
  try {
    // TypeORM 데이터베이스 연결
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    // 서버 시작
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 