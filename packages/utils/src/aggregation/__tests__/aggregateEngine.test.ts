import { AggregateEngine } from '../aggregateEngine';

// 테스트를 위한 타입 정의
interface AggregationRule {
  id: string;
  field: string;
  function: AggregateFunction;
  alias?: string;
  distinct?: boolean;
  enabled?: boolean;
}

enum AggregateFunction {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  FIRST = 'first',
  LAST = 'last',
  STDDEV = 'stddev',
  VARIANCE = 'variance'
}

interface OrderByRule {
  field: string;
  direction: 'ASC' | 'DESC';
}

describe('AggregateEngine', () => {
  let aggregateEngine: AggregateEngine;
  const sampleData = [
    { department: 'Engineering', name: 'John', salary: 70000, age: 30 },
    { department: 'Engineering', name: 'Jane', salary: 80000, age: 28 },
    { department: 'Marketing', name: 'Bob', salary: 60000, age: 35 },
    { department: 'Marketing', name: 'Alice', salary: 65000, age: 32 },
    { department: 'Sales', name: 'Charlie', salary: 55000, age: 29 },
    { department: 'Sales', name: 'Diana', salary: 58000, age: 31 }
  ];

  beforeEach(() => {
    aggregateEngine = new AggregateEngine();
  });

  describe('기본 집계 함수', () => {
    it('COUNT 함수로 집계', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: '*',
          function: AggregateFunction.COUNT,
          alias: 'total_count',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(sampleData, [], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].total_count).toBe(6);
    });

    it('SUM 함수로 집계', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.SUM,
          alias: 'total_salary',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(sampleData, [], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].total_salary).toBe(388000);
    });

    it('AVG 함수로 집계', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.AVG,
          alias: 'avg_salary',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(sampleData, [], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].avg_salary).toBeCloseTo(64666.67, 2);
    });

    it('MIN/MAX 함수로 집계', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.MIN,
          alias: 'min_salary',
          enabled: true
        },
        {
          id: '2',
          field: 'salary',
          function: AggregateFunction.MAX,
          alias: 'max_salary',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(sampleData, [], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].min_salary).toBe(55000);
      expect(result[0].max_salary).toBe(80000);
    });

    it('FIRST/LAST 함수로 집계', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'name',
          function: AggregateFunction.FIRST,
          alias: 'first_name',
          enabled: true
        },
        {
          id: '2',
          field: 'name',
          function: AggregateFunction.LAST,
          alias: 'last_name',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(sampleData, [], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].first_name).toBe('John');
      expect(result[0].last_name).toBe('Diana');
    });
  });

  describe('그룹화 집계', () => {
    it('단일 필드로 그룹화', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: '*',
          function: AggregateFunction.COUNT,
          alias: 'count',
          enabled: true
        },
        {
          id: '2',
          field: 'salary',
          function: AggregateFunction.AVG,
          alias: 'avg_salary',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(sampleData, ['department'], aggregations);
      expect(result).toHaveLength(3);
      
      const engineering = result.find(r => r.department === 'Engineering');
      expect(engineering.count).toBe(2);
      expect(engineering.avg_salary).toBe(75000);
      
      const marketing = result.find(r => r.department === 'Marketing');
      expect(marketing.count).toBe(2);
      expect(marketing.avg_salary).toBe(62500);
    });

    it('여러 필드로 그룹화', () => {
      const dataWithGrades = [
        { department: 'Engineering', grade: 'Senior', salary: 80000 },
        { department: 'Engineering', grade: 'Junior', salary: 60000 },
        { department: 'Marketing', grade: 'Senior', salary: 70000 },
        { department: 'Marketing', grade: 'Junior', salary: 50000 }
      ];

      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.AVG,
          alias: 'avg_salary',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(dataWithGrades, ['department', 'grade'], aggregations);
      expect(result).toHaveLength(4);
      
      const engSenior = result.find(r => r.department === 'Engineering' && r.grade === 'Senior');
      expect(engSenior.avg_salary).toBe(80000);
    });
  });

  describe('정렬', () => {
    it('ASC 정렬', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.AVG,
          alias: 'avg_salary',
          enabled: true
        }
      ];

      const orderBy: OrderByRule[] = [
        { field: 'avg_salary', direction: 'ASC' }
      ];

      const result = aggregateEngine.aggregate(sampleData, ['department'], aggregations, orderBy);
      expect(result).toHaveLength(3);
      expect(result[0].department).toBe('Sales'); // 가장 낮은 평균 급여
      expect(result[2].department).toBe('Engineering'); // 가장 높은 평균 급여
    });

    it('DESC 정렬', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.AVG,
          alias: 'avg_salary',
          enabled: true
        }
      ];

      const orderBy: OrderByRule[] = [
        { field: 'avg_salary', direction: 'DESC' }
      ];

      const result = aggregateEngine.aggregate(sampleData, ['department'], aggregations, orderBy);
      expect(result).toHaveLength(3);
      expect(result[0].department).toBe('Engineering'); // 가장 높은 평균 급여
      expect(result[2].department).toBe('Sales'); // 가장 낮은 평균 급여
    });
  });

  describe('DISTINCT 처리', () => {
    it('중복 값 제거 후 집계', () => {
      const dataWithDuplicates = [
        { category: 'A', value: 10 },
        { category: 'A', value: 10 },
        { category: 'A', value: 20 },
        { category: 'B', value: 15 },
        { category: 'B', value: 15 }
      ];

      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'value',
          function: AggregateFunction.COUNT,
          alias: 'count_distinct',
          distinct: true,
          enabled: true
        },
        {
          id: '2',
          field: 'value',
          function: AggregateFunction.SUM,
          alias: 'sum_distinct',
          distinct: true,
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(dataWithDuplicates, ['category'], aggregations);
      
      const categoryA = result.find(r => r.category === 'A');
      expect(categoryA.count_distinct).toBe(2); // 10, 20
      expect(categoryA.sum_distinct).toBe(30); // 10 + 20
      
      const categoryB = result.find(r => r.category === 'B');
      expect(categoryB.count_distinct).toBe(1); // 15
      expect(categoryB.sum_distinct).toBe(15); // 15
    });
  });

  describe('통계 함수', () => {
    it('표준편차 계산', () => {
      const testData = [
        { group: 'A', value: 10 },
        { group: 'A', value: 20 },
        { group: 'A', value: 30 }
      ];

      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'value',
          function: AggregateFunction.STDDEV,
          alias: 'stddev_value',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(testData, ['group'], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].stddev_value).toBeCloseTo(8.165, 3);
    });

    it('분산 계산', () => {
      const testData = [
        { group: 'A', value: 10 },
        { group: 'A', value: 20 },
        { group: 'A', value: 30 }
      ];

      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'value',
          function: AggregateFunction.VARIANCE,
          alias: 'variance_value',
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate(testData, ['group'], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].variance_value).toBeCloseTo(66.667, 3);
    });
  });

  describe('에러 처리', () => {
    it('빈 데이터 처리', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.SUM,
          enabled: true
        }
      ];

      const result = aggregateEngine.aggregate([], ['department'], aggregations);
      expect(result).toHaveLength(0);
    });

    it('비활성화된 집계 규칙 무시', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: AggregateFunction.SUM,
          alias: 'total_salary',
          enabled: true
        },
        {
          id: '2',
          field: 'age',
          function: AggregateFunction.AVG,
          alias: 'avg_age',
          enabled: false
        }
      ];

      const result = aggregateEngine.aggregate(sampleData, [], aggregations);
      expect(result).toHaveLength(1);
      expect(result[0].total_salary).toBe(388000);
      expect(result[0].avg_age).toBeUndefined();
    });

    it('지원하지 않는 집계 함수', () => {
      const aggregations: AggregationRule[] = [
        {
          id: '1',
          field: 'salary',
          function: 'UNSUPPORTED' as AggregateFunction,
          enabled: true
        }
      ];

      expect(() => {
        aggregateEngine.aggregate(sampleData, [], aggregations);
      }).toThrow('Unsupported aggregation function: UNSUPPORTED');
    });
  });
}); 