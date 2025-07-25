import axios from 'axios';
export class DiagramApiClient {
    constructor(baseURL = 'http://localhost:3001') {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // 요청 인터셉터
        this.client.interceptors.request.use((config) => {
            console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // 응답 인터셉터
        this.client.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            console.error('API 에러:', error.response?.data || error.message);
            return Promise.reject(error);
        });
    }
    // 일반적인 HTTP 메서드들
    async get(url, config) {
        return this.client.get(url, config);
    }
    async post(url, data, config) {
        return this.client.post(url, data, config);
    }
    async put(url, data, config) {
        return this.client.put(url, data, config);
    }
    async delete(url, config) {
        return this.client.delete(url, config);
    }
    // 데이터베이스 연결 테스트
    async testConnection(config) {
        try {
            const response = await this.client.post('/api/database/test-connection', config);
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: false,
                error: error instanceof Error ? error.message : '연결 테스트 실패'
            };
        }
    }
    // 쿼리 실행
    async executeQuery(config) {
        try {
            const response = await this.client.post('/api/database/execute-query', config);
            return response.data;
        }
        catch (error) {
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
    async saveDiagram(diagram) {
        try {
            const response = await this.client.post('/api/diagrams', diagram);
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: { id: '' },
                error: error instanceof Error ? error.message : '다이어그램 저장 실패'
            };
        }
    }
    // 다이어그램 불러오기
    async loadDiagram(id) {
        try {
            const response = await this.client.get(`/api/diagrams/${id}`);
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : '다이어그램 불러오기 실패'
            };
        }
    }
    // 다이어그램 목록 조회
    async getDiagrams() {
        try {
            const response = await this.client.get('/api/diagrams');
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: [],
                error: error instanceof Error ? error.message : '다이어그램 목록 조회 실패'
            };
        }
    }
    // 다이어그램 실행
    async executeDiagram(diagramId) {
        try {
            const response = await this.client.post(`/api/executions/start`, { diagramId });
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : '다이어그램 실행 실패'
            };
        }
    }
    // 실행 결과 조회
    async getExecutionResult(executionId) {
        try {
            const response = await this.client.get(`/api/executions/${executionId}`);
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : '실행 결과 조회 실패'
            };
        }
    }
    // === 데이터 처리 API 메서드들 ===
    // 데이터 필터링
    async filterData(data, filterRules) {
        try {
            const response = await this.client.post('/api/data-processing/filter', {
                data,
                filterRules
            });
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: [],
                error: error instanceof Error ? error.message : '데이터 필터링 실패'
            };
        }
    }
    // 데이터 집계
    async aggregateData(data, aggregateRules, groupBy) {
        try {
            const response = await this.client.post('/api/data-processing/aggregate', {
                data,
                aggregateRules,
                groupBy: groupBy || []
            });
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: [],
                error: error instanceof Error ? error.message : '데이터 집계 실패'
            };
        }
    }
    // 데이터 변환
    async transformData(data, transformRules) {
        try {
            const response = await this.client.post('/api/data-processing/transform', {
                data,
                transformRules
            });
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: [],
                error: error instanceof Error ? error.message : '데이터 변환 실패'
            };
        }
    }
    // 복합 데이터 처리 (필터링 → 집계 → 변환)
    async processData(data, filterRules, aggregateRules, transformRules, groupBy) {
        try {
            const response = await this.client.post('/api/data-processing/process', {
                data,
                filterRules: filterRules || [],
                aggregateRules: aggregateRules || [],
                transformRules: transformRules || [],
                groupBy: groupBy || []
            });
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: {
                    success: false,
                    data: [],
                    error: error instanceof Error ? error.message : '데이터 처리 실패',
                    metadata: {
                        totalRecords: 0,
                        processedRecords: 0,
                        processingTime: 0,
                        affectedFields: []
                    }
                },
                error: error instanceof Error ? error.message : '데이터 처리 실패'
            };
        }
    }
}
// 기본 API 클라이언트 인스턴스
export const apiClient = new DiagramApiClient();
