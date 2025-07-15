import express, { Router } from 'express';
import { ConnectionPoolManager } from '../database/ConnectionPoolManager';
import { DatabaseHealthChecker } from '../database/DatabaseHealthChecker';
import { 
  DatabaseConnectionConfig, 
  QueryOptions, 
  ApiResponse,
  ConnectionError,
  QueryError,
  TimeoutError
} from '@diagram/common';

const router: Router = express.Router();
const poolManager = ConnectionPoolManager.getInstance();
const healthChecker = DatabaseHealthChecker.getInstance();

/**
 * 데이터베이스 연결 테스트
 */
router.post('/test-connection', async (req, res) => {
  try {
    const config: DatabaseConnectionConfig = req.body;
    
    const connector = await poolManager.getConnection(config);
    const isConnected = await connector.testConnection();
    
    const response: ApiResponse<boolean> = {
      success: true,
      data: isConnected,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<boolean> = {
      success: false,
      data: false,
      error: error instanceof Error ? error.message : '연결 테스트 실패',
      timestamp: new Date()
    };
    
    if (error instanceof ConnectionError) {
      res.status(400).json(response);
    } else if (error instanceof TimeoutError) {
      res.status(408).json(response);
    } else {
      res.status(500).json(response);
    }
  }
});

/**
 * 쿼리 실행
 */
router.post('/execute-query', async (req, res) => {
  try {
    const { config, query, params, options }: {
      config: DatabaseConnectionConfig;
      query: string;
      params?: any[];
      options?: QueryOptions;
    } = req.body;
    
    if (!query) {
      const response: ApiResponse<any> = {
        success: false,
        data: null,
        error: '쿼리가 필요합니다',
        timestamp: new Date()
      };
      return res.status(400).json(response);
    }
    
    const connector = await poolManager.getConnection(config);
    const result = await connector.executeQuery(query, params, options);
    
    const response: ApiResponse<any> = {
      success: true,
      data: result,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '쿼리 실행 실패',
      timestamp: new Date()
    };
    
    if (error instanceof ConnectionError) {
      res.status(400).json(response);
    } else if (error instanceof QueryError) {
      res.status(400).json(response);
    } else if (error instanceof TimeoutError) {
      res.status(408).json(response);
    } else {
      res.status(500).json(response);
    }
  }
});

/**
 * 활성 연결 목록 조회
 */
router.get('/connections', async (req, res) => {
  try {
    const connections = poolManager.getActiveConnections();
    
    const response: ApiResponse<any[]> = {
      success: true,
      data: connections,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<any[]> = {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '연결 목록 조회 실패',
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
});

/**
 * 연결 상태 체크
 */
router.get('/health-check', async (req, res) => {
  try {
    const healthResult = await healthChecker.performHealthCheck();
    
    const response: ApiResponse<any> = {
      success: true,
      data: healthResult,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '헬스 체크 실패',
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
});

/**
 * 연결 통계 정보
 */
router.get('/statistics', async (req, res) => {
  try {
    const statistics = healthChecker.getConnectionStatistics();
    
    const response: ApiResponse<any> = {
      success: true,
      data: statistics,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : '통계 정보 조회 실패',
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
});

/**
 * 특정 연결 제거
 */
router.delete('/connections', async (req, res) => {
  try {
    const config: DatabaseConnectionConfig = req.body;
    
    await poolManager.removeConnection(config);
    
    const response: ApiResponse<boolean> = {
      success: true,
      data: true,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<boolean> = {
      success: false,
      data: false,
      error: error instanceof Error ? error.message : '연결 제거 실패',
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
});

export default router; 