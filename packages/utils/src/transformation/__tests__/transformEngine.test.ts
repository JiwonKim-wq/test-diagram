import { TransformEngine } from '../transformEngine';

// 테스트를 위한 타입 정의
interface TransformationRule {
  id: string;
  sourceField: string;
  targetField: string;
  function: TransformFunction;
  parameters?: Record<string, any>;
  enabled?: boolean;
}

enum TransformFunction {
  RENAME = 'rename',
  CAST = 'cast',
  SUBSTRING = 'substring',
  REPLACE = 'replace',
  UPPER = 'upper',
  LOWER = 'lower',
  TRIM = 'trim',
  CONCAT = 'concat',
  SPLIT = 'split',
  DATE_FORMAT = 'dateFormat',
  MATH_OPERATION = 'mathOperation',
  CONDITIONAL = 'conditional',
  CUSTOM = 'custom'
}

describe('TransformEngine', () => {
  let transformEngine: TransformEngine;
  const sampleData = [
    { id: 1, name: '  John Doe  ', age: 30, salary: 50000, department: 'engineering' },
    { id: 2, name: 'jane smith', age: 25, salary: 60000, department: 'marketing' },
    { id: 3, name: 'Bob Johnson', age: 35, salary: 70000, department: 'sales' }
  ];

  beforeEach(() => {
    transformEngine = new TransformEngine();
  });

  describe('기본 변환 함수', () => {
    it('RENAME 변환', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'fullName',
          function: TransformFunction.RENAME,
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].fullName).toBe('  John Doe  ');
      expect(result[0].name).toBe('  John Doe  '); // 원본 필드도 유지됨
    });

    it('UPPER/LOWER 변환', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'nameUpper',
          function: TransformFunction.UPPER,
          enabled: true
        },
        {
          id: '2',
          sourceField: 'department',
          targetField: 'departmentLower',
          function: TransformFunction.LOWER,
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].nameUpper).toBe('  JOHN DOE  ');
      expect(result[0].departmentLower).toBe('engineering');
    });

    it('TRIM 변환', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'nameTrimmed',
          function: TransformFunction.TRIM,
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].nameTrimmed).toBe('John Doe');
    });
  });

  describe('문자열 변환', () => {
    it('SUBSTRING 변환', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'firstName',
          function: TransformFunction.SUBSTRING,
          parameters: { start: 2, length: 4 }, // '  John Doe  '에서 'John'
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].firstName).toBe('John');
    });

    it('REPLACE 변환', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'nameReplaced',
          function: TransformFunction.REPLACE,
          parameters: { search: 'Doe', replace: 'Smith' },
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].nameReplaced).toBe('  John Smith  ');
    });

    it('SPLIT 변환', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'nameParts',
          function: TransformFunction.SPLIT,
          parameters: { delimiter: ' ' },
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].nameParts).toEqual(['', '', 'John', 'Doe', '', '']);
    });

    it('CONCAT 변환', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'id', // 실제로는 사용되지 않음
          targetField: 'fullInfo',
          function: TransformFunction.CONCAT,
          parameters: { 
            fields: ['name', 'department'], 
            separator: ' - ' 
          },
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].fullInfo).toBe('  John Doe   - engineering');
    });
  });

  describe('타입 캐스팅', () => {
    it('문자열로 캐스팅', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'age',
          targetField: 'ageString',
          function: TransformFunction.CAST,
          parameters: { targetType: 'string' },
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].ageString).toBe('30');
      expect(typeof result[0].ageString).toBe('string');
    });

    it('숫자로 캐스팅', () => {
      const testData = [{ stringNumber: '123' }];
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'stringNumber',
          targetField: 'numberValue',
          function: TransformFunction.CAST,
          parameters: { targetType: 'number' },
          enabled: true
        }
      ];

      const result = transformEngine.transform(testData, transformations);
      expect(result[0].numberValue).toBe(123);
      expect(typeof result[0].numberValue).toBe('number');
    });

    it('불린으로 캐스팅', () => {
      const testData = [
        { boolString: 'true' },
        { boolString: 'false' },
        { boolString: '1' },
        { boolString: '0' }
      ];
      
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'boolString',
          targetField: 'boolValue',
          function: TransformFunction.CAST,
          parameters: { targetType: 'boolean' },
          enabled: true
        }
      ];

      const result = transformEngine.transform(testData, transformations);
      expect(result[0].boolValue).toBe(true);
      expect(result[1].boolValue).toBe(false);
      expect(result[2].boolValue).toBe(true);
      expect(result[3].boolValue).toBe(false);
    });
  });

  describe('수학 연산', () => {
    it('기본 산술 연산', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'salary',
          targetField: 'salaryWithBonus',
          function: TransformFunction.MATH_OPERATION,
          parameters: { operation: 'add', operand: 5000 },
          enabled: true
        },
        {
          id: '2',
          sourceField: 'age',
          targetField: 'ageSquared',
          function: TransformFunction.MATH_OPERATION,
          parameters: { operation: 'power', operand: 2 },
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].salaryWithBonus).toBe(55000);
      expect(result[0].ageSquared).toBe(900);
    });

    it('0으로 나누기 에러', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'salary',
          targetField: 'result',
          function: TransformFunction.MATH_OPERATION,
          parameters: { operation: 'divide', operand: 0 },
          enabled: true
        }
      ];

      expect(() => {
        transformEngine.transform(sampleData, transformations);
      }).toThrow('Division by zero');
    });
  });

  describe('조건부 변환', () => {
    it('조건부 값 설정', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'age',
          targetField: 'ageGroup',
          function: TransformFunction.CONDITIONAL,
          parameters: {
            condition: { field: 'age', operator: '>=', value: 30 },
            trueValue: 'Senior',
            falseValue: 'Junior'
          },
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].ageGroup).toBe('Senior'); // age: 30
      expect(result[1].ageGroup).toBe('Junior'); // age: 25
      expect(result[2].ageGroup).toBe('Senior'); // age: 35
    });
  });

  describe('날짜 포맷팅', () => {
    it('날짜 형식 변환', () => {
      const testData = [{ date: '2023-12-25T10:30:00' }];
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'date',
          targetField: 'formattedDate',
          function: TransformFunction.DATE_FORMAT,
          parameters: { format: 'YYYY-MM-DD HH:mm:ss' },
          enabled: true
        }
      ];

      const result = transformEngine.transform(testData, transformations);
      expect(result[0].formattedDate).toBe('2023-12-25 10:30:00');
    });
  });

  describe('커스텀 함수', () => {
    it('커스텀 변환 함수 실행', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'nameLength',
          function: TransformFunction.CUSTOM,
          parameters: {
            function: 'return value.trim().length;'
          },
          enabled: true
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].nameLength).toBe(8); // 'John Doe'.length
    });
  });

  describe('에러 처리', () => {
    it('빈 데이터 처리', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'nameUpper',
          function: TransformFunction.UPPER,
          enabled: true
        }
      ];

      const result = transformEngine.transform([], transformations);
      expect(result).toHaveLength(0);
    });

    it('비활성화된 변환 규칙 무시', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'nameUpper',
          function: TransformFunction.UPPER,
          enabled: true
        },
        {
          id: '2',
          sourceField: 'name',
          targetField: 'nameLower',
          function: TransformFunction.LOWER,
          enabled: false
        }
      ];

      const result = transformEngine.transform(sampleData, transformations);
      expect(result[0].nameUpper).toBeDefined();
      expect(result[0].nameLower).toBeUndefined();
    });

    it('지원하지 않는 변환 함수', () => {
      const transformations: TransformationRule[] = [
        {
          id: '1',
          sourceField: 'name',
          targetField: 'result',
          function: 'UNSUPPORTED' as TransformFunction,
          enabled: true
        }
      ];

      expect(() => {
        transformEngine.transform(sampleData, transformations);
      }).toThrow('Unsupported transformation function: UNSUPPORTED');
    });
  });
}); 