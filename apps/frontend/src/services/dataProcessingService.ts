import { apiClient } from '../../../packages/api-client/dist/index';
import { 
  FilterRule, 
  AggregationRule, 
  TransformRule, 
  ProcessingResult,
  ApiResponse 
} from '@diagram/common';

export class DataProcessingService {
  /**
   * 데이터 필터링을 수행합니다.
   */
  static async filterData(data: any[], filterRules: FilterRule[]): Promise<ApiResponse<any[]>> {
    try {
      return await apiClient.filterData(data, filterRules);
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '데이터 필터링 중 오류가 발생했습니다'
      };
    }
  }

  /**
   * 데이터 집계를 수행합니다.
   */
  static async aggregateData(
    data: any[], 
    aggregationRules: AggregationRule[], 
    groupBy?: string[]
  ): Promise<ApiResponse<any[]>> {
    try {
      return await apiClient.aggregateData(data, aggregationRules, groupBy);
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '데이터 집계 중 오류가 발생했습니다'
      };
    }
  }

  /**
   * 데이터 변환을 수행합니다.
   */
  static async transformData(data: any[], transformRules: TransformRule[]): Promise<ApiResponse<any[]>> {
    try {
      return await apiClient.transformData(data, transformRules);
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '데이터 변환 중 오류가 발생했습니다'
      };
    }
  }

  /**
   * 복합 데이터 처리를 수행합니다.
   */
  static async processData(
    data: any[],
    filterRules?: FilterRule[],
    aggregationRules?: AggregationRule[],
    transformRules?: TransformRule[],
    groupBy?: string[]
  ): Promise<ApiResponse<ProcessingResult>> {
    try {
      return await apiClient.processData(data, filterRules, aggregationRules, transformRules, groupBy);
    } catch (error) {
      return {
        success: false,
        data: {
          success: false,
          data: [],
          error: error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다',
          metadata: {
            totalRecords: 0,
            processedRecords: 0,
            processingTime: 0,
            affectedFields: []
          }
        },
        error: error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다'
      };
    }
  }

  /**
   * 노드 실행 - 노드 타입에 따라 적절한 데이터 처리 수행
   */
  static async executeNode(
    nodeType: string,
    inputData: any[],
    nodeConfig: any
  ): Promise<ApiResponse<any[]>> {
    switch (nodeType) {
      case 'filter':
        if (!nodeConfig.filters || nodeConfig.filters.length === 0) {
          return {
            success: true,
            data: inputData
          };
        }
        return await this.filterData(inputData, nodeConfig.filters);

      case 'aggregate':
        if (!nodeConfig.aggregations || nodeConfig.aggregations.length === 0) {
          return {
            success: true,
            data: inputData
          };
        }
        return await this.aggregateData(inputData, nodeConfig.aggregations, nodeConfig.groupBy);

      case 'transform':
        if (!nodeConfig.transformations || nodeConfig.transformations.length === 0) {
          return {
            success: true,
            data: inputData
          };
        }
        return await this.transformData(inputData, nodeConfig.transformations);

      default:
        return {
          success: false,
          data: [],
          error: `지원하지 않는 노드 타입입니다: ${nodeType}`
        };
    }
  }

  /**
   * 다이어그램 전체 실행 - 노드들을 위상정렬하여 순차 실행
   */
  static async executeDiagram(nodes: any[], edges: any[]): Promise<{
    success: boolean;
    results: Map<string, any>;
    error?: string;
  }> {
    try {
      const results = new Map<string, any>();
      const processed = new Set<string>();
      
      // 간단한 위상정렬 (실제로는 더 복잡한 로직이 필요)
      const executionOrder = this.getExecutionOrder(nodes, edges);
      
      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;

        // 입력 데이터 수집
        const inputData = this.collectInputData(node, edges, results);
        
        // 노드 실행
        const result = await this.executeNode(node.type, inputData, node.data);
        
        results.set(nodeId, {
          success: result.success,
          data: result.data,
          error: result.error
        });

        processed.add(nodeId);
      }

      return {
        success: true,
        results
      };
    } catch (error) {
      return {
        success: false,
        results: new Map(),
        error: error instanceof Error ? error.message : '다이어그램 실행 중 오류가 발생했습니다'
      };
    }
  }

  /**
   * 노드 실행 순서 결정 (위상정렬)
   */
  private static getExecutionOrder(nodes: any[], edges: any[]): string[] {
    // 간단한 구현 - 실제로는 더 정교한 위상정렬 알고리즘 필요
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const inDegree = new Map<string, number>();
    const outEdges = new Map<string, string[]>();

    // 초기화
    nodes.forEach(node => {
      inDegree.set(node.id, 0);
      outEdges.set(node.id, []);
    });

    // 간선 정보 구축
    edges.forEach(edge => {
      const from = edge.source;
      const to = edge.target;
      
      if (outEdges.has(from)) {
        outEdges.get(from)!.push(to);
      }
      
      if (inDegree.has(to)) {
        inDegree.set(to, inDegree.get(to)! + 1);
      }
    });

    // 위상정렬
    const queue: string[] = [];
    const result: string[] = [];

    // 진입차수가 0인 노드들을 큐에 추가
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      // 현재 노드의 출력 노드들의 진입차수 감소
      const outputs = outEdges.get(current) || [];
      outputs.forEach(output => {
        const newDegree = inDegree.get(output)! - 1;
        inDegree.set(output, newDegree);
        
        if (newDegree === 0) {
          queue.push(output);
        }
      });
    }

    return result;
  }

  /**
   * 노드의 입력 데이터 수집
   */
  private static collectInputData(node: any, edges: any[], results: Map<string, any>): any[] {
    const inputEdges = edges.filter(edge => edge.target === node.id);
    
    if (inputEdges.length === 0) {
      // 입력이 없는 노드 (데이터 소스 노드)
      return node.data?.lastQueryResult?.data || [];
    }

    // 여러 입력을 병합 (간단한 구현)
    let combinedData: any[] = [];
    
    inputEdges.forEach(edge => {
      const sourceResult = results.get(edge.source);
      if (sourceResult && sourceResult.success && sourceResult.data) {
        combinedData = combinedData.concat(sourceResult.data);
      }
    });

    return combinedData;
  }
} 