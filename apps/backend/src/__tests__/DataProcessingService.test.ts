import { DataProcessingService } from '../services/DataProcessingService';
import { FilterRule, FilterOperator, AggregationRule, AggregateFunction, TransformRule, TransformType, TransformOperation } from '@diagram/common';

describe('DataProcessingService', () => {
  let service: DataProcessingService;
  
  beforeEach(() => {
    service = new DataProcessingService();
  });

  describe('filterData', () => {
    const mockData = [
      { id: 1, name: 'John', age: 25, active: true },
      { id: 2, name: 'Jane', age: 30, active: false },
      { id: 3, name: 'Bob', age: 35, active: true },
      { id: 4, name: 'Alice', age: 28, active: true }
    ];

    it('단일 필터 룰로 데이터를 필터링할 수 있어야 한다', async () => {
      const filterRules: FilterRule[] = [
        {
          id: 'filter1',
          field: 'active',
          operator: FilterOperator.EQUALS,
          value: true,
          dataType: 'boolean'
        }
      ];

      const result = await service.filterData(mockData, filterRules);
      
      expect(result).toHaveLength(3);
      expect(result.every(item => item.active === true)).toBe(true);
    });

    it('여러 필터 룰로 데이터를 필터링할 수 있어야 한다', async () => {
      const filterRules: FilterRule[] = [
        {
          id: 'filter1',
          field: 'active',
          operator: FilterOperator.EQUALS,
          value: true,
          dataType: 'boolean'
        },
        {
          id: 'filter2',
          field: 'age',
          operator: FilterOperator.GREATER_THAN,
          value: 25,
          dataType: 'number'
        }
      ];

      const result = await service.filterData(mockData, filterRules);
      
      expect(result).toHaveLength(2);
      expect(result.every(item => item.active === true && item.age > 25)).toBe(true);
    });

    it('빈 데이터 배열에 대해서도 정상 작동해야 한다', async () => {
      const filterRules: FilterRule[] = [
        {
          id: 'filter1',
          field: 'active',
          operator: FilterOperator.EQUALS,
          value: true,
          dataType: 'boolean'
        }
      ];

      const result = await service.filterData([], filterRules);
      
      expect(result).toHaveLength(0);
    });

    it('빈 필터 룰에 대해서는 원본 데이터를 반환해야 한다', async () => {
      const result = await service.filterData(mockData, []);
      
      expect(result).toEqual(mockData);
    });
  });

  describe('aggregateData', () => {
    const mockData = [
      { department: 'IT', salary: 5000, count: 1 },
      { department: 'IT', salary: 6000, count: 1 },
      { department: 'HR', salary: 4000, count: 1 },
      { department: 'HR', salary: 4500, count: 1 },
      { department: 'Finance', salary: 5500, count: 1 }
    ];

    it('그룹별로 데이터를 집계할 수 있어야 한다', async () => {
      const aggregateRules: AggregationRule[] = [
        {
          id: 'agg1',
          field: 'salary',
          function: AggregateFunction.AVG,
          alias: 'avgSalary'
        },
        {
          id: 'agg2',
          field: 'count',
          function: AggregateFunction.SUM,
          alias: 'totalCount'
        }
      ];

      const result = await service.aggregateData(mockData, aggregateRules, ['department']);
      
      expect(result).toHaveLength(3);
      expect(result.find(item => item.department === 'IT')).toEqual({
        department: 'IT',
        avgSalary: 5500,
        totalCount: 2
      });
      expect(result.find(item => item.department === 'HR')).toEqual({
        department: 'HR',
        avgSalary: 4250,
        totalCount: 2
      });
    });

    it('그룹 없이 전체 데이터를 집계할 수 있어야 한다', async () => {
      const aggregateRules: AggregationRule[] = [
        {
          id: 'agg1',
          field: 'salary',
          function: AggregateFunction.MAX,
          alias: 'maxSalary'
        },
        {
          id: 'agg2',
          field: 'salary',
          function: AggregateFunction.MIN,
          alias: 'minSalary'
        }
      ];

      const result = await service.aggregateData(mockData, aggregateRules);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        maxSalary: 6000,
        minSalary: 4000
      });
    });
  });

  describe('transformData', () => {
    const mockData = [
      { firstName: 'John', lastName: 'Doe', age: 25 },
      { firstName: 'Jane', lastName: 'Smith', age: 30 }
    ];

    it('필드명을 변경할 수 있어야 한다', async () => {
      const transformRules: TransformRule[] = [
        {
          id: 'transform1',
          type: TransformType.FIELD_MAPPING,
          sourceField: 'firstName',
          targetField: 'first_name',
          operation: TransformOperation.RENAME
        }
      ];

      const result = await service.transformData(mockData, transformRules);
      
      expect(result[0]).toHaveProperty('first_name');
      expect(result[0]).not.toHaveProperty('firstName');
      expect(result[0].first_name).toBe('John');
    });

    it('새로운 필드를 생성할 수 있어야 한다', async () => {
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

      const result = await service.transformData(mockData, transformRules);
      
      expect(result[0].fullName).toBe('John Doe');
      expect(result[1].fullName).toBe('Jane Smith');
    });
  });

  describe('processData', () => {
    const mockData = [
      { id: 1, name: 'John', department: 'IT', salary: 5000, active: true },
      { id: 2, name: 'Jane', department: 'IT', salary: 6000, active: false },
      { id: 3, name: 'Bob', department: 'HR', salary: 4000, active: true },
      { id: 4, name: 'Alice', department: 'HR', salary: 4500, active: true }
    ];

    it('필터링, 집계, 변환을 순차적으로 처리할 수 있어야 한다', async () => {
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

      const result = await service.processData(
        mockData, 
        filterRules, 
        aggregateRules, 
        transformRules,
        ['department']
      );
      
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('dept');
      expect(result.data[0]).toHaveProperty('avgSalary');
      expect(result.metadata?.totalRecords).toBe(4);
    });
  });
}); 