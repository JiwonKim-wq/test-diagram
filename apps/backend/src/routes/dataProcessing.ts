import { Router } from 'express';
import { DataProcessingController } from '../controllers/DataProcessingController';

const router: Router = Router();
const dataProcessingController = new DataProcessingController();

// 데이터 필터링 API
router.post('/filter', async (req, res) => {
  await dataProcessingController.filterData(req, res);
});

// 데이터 집계 API
router.post('/aggregate', async (req, res) => {
  await dataProcessingController.aggregateData(req, res);
});

// 데이터 변환 API
router.post('/transform', async (req, res) => {
  await dataProcessingController.transformData(req, res);
});

// 복합 데이터 처리 API (필터링 → 집계 → 변환)
router.post('/process', async (req, res) => {
  await dataProcessingController.processData(req, res);
});

export default router; 