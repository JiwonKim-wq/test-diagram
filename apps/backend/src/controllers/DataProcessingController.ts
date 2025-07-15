import { Request, Response } from 'express';
import { DataProcessingService } from '../services/DataProcessingService';
import { FilterRule, AggregationRule, TransformRule } from '@diagram/common';

export class DataProcessingController {
  private dataProcessingService: DataProcessingService;

  constructor() {
    this.dataProcessingService = new DataProcessingService();
  }

  // 데이터 필터링
  async filterData(req: Request, res: Response): Promise<void> {
    try {
      const { data, filterRules } = req.body;
      
      if (!data || !Array.isArray(data)) {
        res.status(400).json({
          success: false,
          error: '유효한 데이터 배열이 필요합니다'
        });
        return;
      }

      if (!filterRules || !Array.isArray(filterRules)) {
        res.status(400).json({
          success: false,
          error: '유효한 필터 룰 배열이 필요합니다'
        });
        return;
      }

      const filteredData = await this.dataProcessingService.filterData(data, filterRules);
      
      res.json({
        success: true,
        data: filteredData,
        metadata: {
          originalCount: data.length,
          filteredCount: filteredData.length,
          processingTime: Date.now()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '데이터 필터링 중 오류가 발생했습니다'
      });
    }
  }

  // 데이터 집계
  async aggregateData(req: Request, res: Response): Promise<void> {
    try {
      const { data, aggregateRules } = req.body;
      
      if (!data || !Array.isArray(data)) {
        res.status(400).json({
          success: false,
          error: '유효한 데이터 배열이 필요합니다'
        });
        return;
      }

      if (!aggregateRules || !Array.isArray(aggregateRules)) {
        res.status(400).json({
          success: false,
          error: '유효한 집계 룰 배열이 필요합니다'
        });
        return;
      }

      const aggregatedData = await this.dataProcessingService.aggregateData(data, aggregateRules);
      
      res.json({
        success: true,
        data: aggregatedData,
        metadata: {
          originalCount: data.length,
          aggregatedCount: aggregatedData.length,
          processingTime: Date.now()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '데이터 집계 중 오류가 발생했습니다'
      });
    }
  }

  // 데이터 변환
  async transformData(req: Request, res: Response): Promise<void> {
    try {
      const { data, transformRules } = req.body;
      
      if (!data || !Array.isArray(data)) {
        res.status(400).json({
          success: false,
          error: '유효한 데이터 배열이 필요합니다'
        });
        return;
      }

      if (!transformRules || !Array.isArray(transformRules)) {
        res.status(400).json({
          success: false,
          error: '유효한 변환 룰 배열이 필요합니다'
        });
        return;
      }

      const transformedData = await this.dataProcessingService.transformData(data, transformRules);
      
      res.json({
        success: true,
        data: transformedData,
        metadata: {
          originalCount: data.length,
          transformedCount: transformedData.length,
          processingTime: Date.now()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '데이터 변환 중 오류가 발생했습니다'
      });
    }
  }

  // 복합 데이터 처리 (필터링 → 집계 → 변환 순서로 처리)
  async processData(req: Request, res: Response): Promise<void> {
    try {
      const { data, filterRules, aggregateRules, transformRules } = req.body;
      
      if (!data || !Array.isArray(data)) {
        res.status(400).json({
          success: false,
          error: '유효한 데이터 배열이 필요합니다'
        });
        return;
      }

      const result = await this.dataProcessingService.processData(
        data, 
        filterRules || [], 
        aggregateRules || [], 
        transformRules || []
      );
      
      res.json({
        success: true,
        data: result.data,
        metadata: result.metadata
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다'
      });
    }
  }
} 