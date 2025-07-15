import { FilterEngine } from '../filterEngine';

// 테스트를 위한 타입 정의
interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array';
  caseSensitive?: boolean;
  enabled?: boolean;
}

enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IN = 'in',
  NOT_IN = 'notIn',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
  REGEX = 'regex',
  BETWEEN = 'between'
}

describe('FilterEngine', () => {
  let filterEngine: FilterEngine;
  const sampleData = [
    { id: 1, name: 'John', age: 25, city: 'New York', active: true, salary: 50000 },
    { id: 2, name: 'Jane', age: 30, city: 'Los Angeles', active: false, salary: 60000 },
    { id: 3, name: 'Bob', age: 35, city: 'Chicago', active: true, salary: 70000 },
    { id: 4, name: 'Alice', age: 28, city: 'New York', active: true, salary: 55000 },
    { id: 5, name: 'Charlie', age: 32, city: 'Boston', active: false, salary: 65000 }
  ];

  beforeEach(() => {
    filterEngine = new FilterEngine();
  });

  describe('단일 필터 조건', () => {
    it('EQUALS 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '1',
        field: 'city',
        operator: FilterOperator.EQUALS,
        value: 'New York',
        dataType: 'string',
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.city === 'New York')).toBe(true);
    });

    it('NOT_EQUALS 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '2',
        field: 'active',
        operator: FilterOperator.NOT_EQUALS,
        value: true,
        dataType: 'boolean',
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.active === false)).toBe(true);
    });

    it('GREATER_THAN 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '3',
        field: 'age',
        operator: FilterOperator.GREATER_THAN,
        value: 30,
        dataType: 'number',
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.age > 30)).toBe(true);
    });

    it('LESS_THAN_OR_EQUAL 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '4',
        field: 'salary',
        operator: FilterOperator.LESS_THAN_OR_EQUAL,
        value: 60000,
        dataType: 'number',
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(3);
      expect(result.every(item => item.salary <= 60000)).toBe(true);
    });

    it('CONTAINS 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '5',
        field: 'name',
        operator: FilterOperator.CONTAINS,
        value: 'o',
        dataType: 'string',
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(2); // John, Bob
      expect(result.every(item => item.name.includes('o'))).toBe(true);
    });

    it('STARTS_WITH 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '6',
        field: 'name',
        operator: FilterOperator.STARTS_WITH,
        value: 'J',
        dataType: 'string',
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(2); // John, Jane
      expect(result.every(item => item.name.startsWith('J'))).toBe(true);
    });

    it('IN 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '7',
        field: 'city',
        operator: FilterOperator.IN,
        value: ['New York', 'Chicago'],
        dataType: 'string', // 필드 타입이 string이고, 값이 배열에 포함되는지 확인
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(3);
      expect(result.every(item => ['New York', 'Chicago'].includes(item.city))).toBe(true);
    });

    it('BETWEEN 연산자로 필터링', () => {
      const filter: FilterRule = {
        id: '8',
        field: 'age',
        operator: FilterOperator.BETWEEN,
        value: [25, 30],
        dataType: 'number',
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(3);
      expect(result.every(item => item.age >= 25 && item.age <= 30)).toBe(true);
    });
  });

  describe('복합 필터 조건', () => {
    it('AND 연산자로 여러 필터 조건 적용', () => {
      const filters: FilterRule[] = [
        {
          id: '1',
          field: 'active',
          operator: FilterOperator.EQUALS,
          value: true,
          dataType: 'boolean',
          enabled: true
        },
        {
          id: '2',
          field: 'age',
          operator: FilterOperator.GREATER_THAN,
          value: 25,
          dataType: 'number',
          enabled: true
        }
      ];

      const result = filterEngine.applyFilters(sampleData, filters, 'AND');
      expect(result).toHaveLength(2); // Bob, Alice
      expect(result.every(item => item.active === true && item.age > 25)).toBe(true);
    });

    it('OR 연산자로 여러 필터 조건 적용', () => {
      const filters: FilterRule[] = [
        {
          id: '1',
          field: 'city',
          operator: FilterOperator.EQUALS,
          value: 'Boston',
          dataType: 'string',
          enabled: true
        },
        {
          id: '2',
          field: 'age',
          operator: FilterOperator.LESS_THAN,
          value: 27,
          dataType: 'number',
          enabled: true
        }
      ];

      const result = filterEngine.applyFilters(sampleData, filters, 'OR');
      expect(result).toHaveLength(2); // John, Charlie
    });

    it('비활성화된 필터는 무시', () => {
      const filters: FilterRule[] = [
        {
          id: '1',
          field: 'active',
          operator: FilterOperator.EQUALS,
          value: true,
          dataType: 'boolean',
          enabled: true
        },
        {
          id: '2',
          field: 'age',
          operator: FilterOperator.GREATER_THAN,
          value: 50,
          dataType: 'number',
          enabled: false // 비활성화
        }
      ];

      const result = filterEngine.applyFilters(sampleData, filters, 'AND');
      expect(result).toHaveLength(3); // active가 true인 모든 항목
    });
  });

  describe('케이스 민감도', () => {
    it('케이스 민감 필터링', () => {
      const filter: FilterRule = {
        id: '1',
        field: 'name',
        operator: FilterOperator.CONTAINS,
        value: 'john',
        dataType: 'string',
        caseSensitive: true,
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(0); // 'John'은 대문자로 시작하므로 매치되지 않음
    });

    it('케이스 비민감 필터링', () => {
      const filter: FilterRule = {
        id: '1',
        field: 'name',
        operator: FilterOperator.CONTAINS,
        value: 'john',
        dataType: 'string',
        caseSensitive: false,
        enabled: true
      };

      const result = filterEngine.applyFilter(sampleData, filter);
      expect(result).toHaveLength(1); // 'John'이 매치됨
    });
  });

  describe('에러 처리', () => {
    it('존재하지 않는 필드에 대한 필터링', () => {
      const filter: FilterRule = {
        id: '1',
        field: 'nonexistent',
        operator: FilterOperator.EQUALS,
        value: 'test',
        dataType: 'string',
        enabled: true
      };

      expect(() => {
        filterEngine.applyFilter(sampleData, filter);
      }).toThrow('Field "nonexistent" does not exist in data');
    });

    it('잘못된 데이터 타입으로 필터링', () => {
      // 실제 데이터에서 age는 숫자인데, 문자열과 비교하려고 시도
      const testData = [{ age: 25 }];
      const filter: FilterRule = {
        id: '1',
        field: 'age',
        operator: FilterOperator.EQUALS,
        value: 'not a number',
        dataType: 'number',
        enabled: true
      };

      // 실제로는 타입 검증이 필드 값에 대해 수행되므로, 이 테스트는 다르게 작성해야 함
      // 대신 문자열 필드에 숫자 타입을 지정하는 경우를 테스트
      const stringData = [{ name: 'John' }];
      const stringFilter: FilterRule = {
        id: '1',
        field: 'name',
        operator: FilterOperator.EQUALS,
        value: 'John',
        dataType: 'number', // 잘못된 타입 지정
        enabled: true
      };

      expect(() => {
        filterEngine.applyFilter(stringData, stringFilter);
      }).toThrow('Invalid value type for field "name"');
    });

    it('BETWEEN 연산자에 잘못된 값 형태', () => {
      const filter: FilterRule = {
        id: '1',
        field: 'age',
        operator: FilterOperator.BETWEEN,
        value: 25, // 배열이 아닌 단일 값
        dataType: 'number',
        enabled: true
      };

      expect(() => {
        filterEngine.applyFilter(sampleData, filter);
      }).toThrow('BETWEEN operator requires an array of two values');
    });
  });
}); 