import { DiagramApiClient } from '../index';
import { FilterRule, FilterOperator, AggregationRule, AggregateFunction, TransformRule, TransformType, TransformOperation } from '@diagram/common';
import axios from 'axios';

// axios 모킹
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }))
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DiagramApiClient - 데이터 처리 API', () => {
  let client: DiagramApiClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    // axios.create 모킹
    mockAxiosInstance = {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    
    (mockedAxios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    
    client = new DiagramApiClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('filterData', () => {
    const mockData = [
      { id: 1, name: 'John', active: true },
      { id: 2, name: 'Jane', active: false }
    ];

    const filterRules: FilterRule[] = [
      {
        id: 'filter1',
        field: 'active',
        operator: FilterOperator.EQUALS,
        value: true,
        dataType: 'boolean'
      }
    ];

    it('성공적으로 데이터를 필터링해야 한다', async () => {
      const expectedResponse = {
        success: true,
        data: [{ id: 1, name: 'John', active: true }],
        metadata: {
          originalCount: 2,
          filteredCount: 1,
          processingTime: 10
        }
      };

      mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

      const result = await client.filterData(mockData, filterRules);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/data-processing/filter', {
        data: mockData,
        filterRules
      });
      expect(result).toEqual(expectedResponse);
    });

    it('API 에러 시 실패 응답을 반환해야 한다', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.post.mockRejectedValue(error);

      const result = await client.filterData(mockData, filterRules);

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.error).toBe('Network Error');
    });
  });

  describe('aggregateData', () => {
    const mockData = [
      { department: 'IT', salary: 5000 },
      { department: 'IT', salary: 6000 },
      { department: 'HR', salary: 4000 }
    ];

    const aggregateRules: AggregationRule[] = [
      {
        id: 'agg1',
        field: 'salary',
        function: AggregateFunction.AVG,
        alias: 'avgSalary'
      }
    ];

    it('성공적으로 데이터를 집계해야 한다', async () => {
      const expectedResponse = {
        success: true,
        data: [
          { department: 'IT', avgSalary: 5500 },
          { department: 'HR', avgSalary: 4000 }
        ]
      };

      mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

      const result = await client.aggregateData(mockData, aggregateRules, ['department']);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/data-processing/aggregate', {
        data: mockData,
        aggregateRules,
        groupBy: ['department']
      });
      expect(result).toEqual(expectedResponse);
    });

    it('groupBy가 없을 때 빈 배열로 전달해야 한다', async () => {
      const expectedResponse = { success: true, data: [] };
      mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

      await client.aggregateData(mockData, aggregateRules);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/data-processing/aggregate', {
        data: mockData,
        aggregateRules,
        groupBy: []
      });
    });
  });

  describe('transformData', () => {
    const mockData = [
      { firstName: 'John', lastName: 'Doe' }
    ];

    const transformRules: TransformRule[] = [
      {
        id: 'transform1',
        type: TransformType.STRING_MANIPULATION,
        sourceField: 'firstName,lastName',
        targetField: 'fullName',
        operation: TransformOperation.CONCAT,
        parameters: { separator: ' ' }
      }
    ];

    it('성공적으로 데이터를 변환해야 한다', async () => {
      const expectedResponse = {
        success: true,
        data: [{ firstName: 'John', lastName: 'Doe', fullName: 'John Doe' }]
      };

      mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

      const result = await client.transformData(mockData, transformRules);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/data-processing/transform', {
        data: mockData,
        transformRules
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('processData', () => {
    const mockData = [
      { id: 1, name: 'John', department: 'IT', salary: 5000, active: true }
    ];

    const filterRules: FilterRule[] = [
      {
        id: 'filter1',
        field: 'active',
        operator: FilterOperator.EQUALS,
        value: true,
        dataType: 'boolean'
      }
    ];

    const aggregateRules: AggregationRule[] = [
      {
        id: 'agg1',
        field: 'salary',
        function: AggregateFunction.AVG,
        alias: 'avgSalary'
      }
    ];

    const transformRules: TransformRule[] = [
      {
        id: 'transform1',
        type: TransformType.FIELD_MAPPING,
        sourceField: 'department',
        targetField: 'dept',
        operation: TransformOperation.RENAME
      }
    ];

    it('성공적으로 복합 데이터 처리를 수행해야 한다', async () => {
      const expectedResponse = {
        success: true,
        data: {
          success: true,
          data: [{ id: 1, name: 'John', dept: 'IT', avgSalary: 5000 }],
          metadata: {
            totalRecords: 1,
            processedRecords: 1,
            processingTime: 15,
            affectedFields: ['active', 'salary', 'department']
          }
        }
      };

      mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

      const result = await client.processData(
        mockData, 
        filterRules, 
        aggregateRules, 
        transformRules, 
        ['department']
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/data-processing/process', {
        data: mockData,
        filterRules,
        aggregateRules,
        transformRules,
        groupBy: ['department']
      });
      expect(result).toEqual(expectedResponse);
    });

    it('선택적 파라미터들이 없을 때 빈 배열로 전달해야 한다', async () => {
      const expectedResponse = {
        success: true,
        data: {
          success: true,
          data: mockData,
          metadata: {
            totalRecords: 1,
            processedRecords: 1,
            processingTime: 5,
            affectedFields: []
          }
        }
      };

      mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

      const result = await client.processData(mockData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/data-processing/process', {
        data: mockData,
        filterRules: [],
        aggregateRules: [],
        transformRules: [],
        groupBy: []
      });
      expect(result).toEqual(expectedResponse);
    });

    it('API 에러 시 기본 ProcessingResult 구조로 실패 응답을 반환해야 한다', async () => {
      const error = new Error('Processing Error');
      mockAxiosInstance.post.mockRejectedValue(error);

      const result = await client.processData(mockData);

      expect(result.success).toBe(false);
      expect(result.data.success).toBe(false);
      expect(result.data.data).toEqual([]);
      expect(result.data.error).toBe('Processing Error');
      expect(result.data.metadata).toEqual({
        totalRecords: 0,
        processedRecords: 0,
        processingTime: 0,
        affectedFields: []
      });
    });
  });
}); 