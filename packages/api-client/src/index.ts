import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DatabaseNodeConfig, QueryResult, ApiResponse } from '@diagram/common';

export class DiagramApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error('API 에러:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // 일반적인 HTTP 메서드들
  async get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }

  // 데이터베이스 연결 테스트
  async testConnection(config: DatabaseNodeConfig): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.client.post('/api/database/test-connection', config);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : '연결 테스트 실패'
      };
    }
  }

  // 쿼리 실행
  async executeQuery(config: DatabaseNodeConfig): Promise<ApiResponse<QueryResult>> {
    try {
      const response = await this.client.post('/api/database/execute-query', config);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: { 
          rows: [], 
          columns: [],
          executionTime: 0,
          queryId: ''
        },
        error: error instanceof Error ? error.message : '쿼리 실행 실패'
      };
    }
  }

  // 다이어그램 저장
  async saveDiagram(diagram: any): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await this.client.post('/api/diagrams', diagram);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: { id: '' },
        error: error instanceof Error ? error.message : '다이어그램 저장 실패'
      };
    }
  }

  // 다이어그램 불러오기
  async loadDiagram(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/api/diagrams/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '다이어그램 불러오기 실패'
      };
    }
  }

  // 다이어그램 목록 조회
  async getDiagrams(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.client.get('/api/diagrams');
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '다이어그램 목록 조회 실패'
      };
    }
  }

  // 다이어그램 실행
  async executeDiagram(diagramId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post(`/api/executions/start`, { diagramId });
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '다이어그램 실행 실패'
      };
    }
  }

  // 실행 결과 조회
  async getExecutionResult(executionId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/api/executions/${executionId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '실행 결과 조회 실패'
      };
    }
  }
}

// 기본 API 클라이언트 인스턴스
export const apiClient = new DiagramApiClient();

// 타입 재내보내기
export type { DatabaseNodeConfig, QueryResult, ApiResponse } from '@diagram/common'; 