// 임시로 로컬 타입 정의 사용 (Jest 설정 해결 후 @diagram/common으로 변경)
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

interface FilterGroup {
  id: string;
  operator: 'AND' | 'OR';
  rules: FilterRule[];
  groups?: FilterGroup[];
  enabled?: boolean;
}

export class FilterEngine {
  /**
   * 단일 필터 규칙을 데이터에 적용합니다.
   */
  applyFilter(data: any[], filter: FilterRule): any[] {
    if (!filter.enabled) {
      return data;
    }

    return data.filter(item => this.evaluateFilter(item, filter));
  }

  /**
   * 여러 필터 규칙을 데이터에 적용합니다.
   */
  applyFilters(data: any[], filters: FilterRule[], operator: 'AND' | 'OR' = 'AND'): any[] {
    const enabledFilters = filters.filter(f => f.enabled);
    
    if (enabledFilters.length === 0) {
      return data;
    }

    return data.filter(item => {
      const results = enabledFilters.map(filter => this.evaluateFilter(item, filter));
      
      if (operator === 'AND') {
        return results.every(result => result);
      } else {
        return results.some(result => result);
      }
    });
  }

  /**
   * 개별 아이템에 대해 필터 규칙을 평가합니다.
   */
  private evaluateFilter(item: any, filter: FilterRule): boolean {
    const fieldValue = this.getFieldValue(item, filter.field);
    const filterValue = filter.value;

    // 필드 존재 여부 확인
    if (fieldValue === undefined && filter.operator !== FilterOperator.IS_NULL) {
      throw new Error(`Field "${filter.field}" does not exist in data`);
    }

    // 데이터 타입 검증 (IN, NOT_IN 연산자는 필터 값이 배열이므로 제외)
    if (filter.operator !== FilterOperator.IN && filter.operator !== FilterOperator.NOT_IN) {
      this.validateDataType(fieldValue, filter.dataType, filter.field);
    }

    switch (filter.operator) {
      case FilterOperator.EQUALS:
        return this.compareValues(fieldValue, filterValue, filter.caseSensitive) === 0;
      
      case FilterOperator.NOT_EQUALS:
        return this.compareValues(fieldValue, filterValue, filter.caseSensitive) !== 0;
      
      case FilterOperator.GREATER_THAN:
        return fieldValue > filterValue;
      
      case FilterOperator.GREATER_THAN_OR_EQUAL:
        return fieldValue >= filterValue;
      
      case FilterOperator.LESS_THAN:
        return fieldValue < filterValue;
      
      case FilterOperator.LESS_THAN_OR_EQUAL:
        return fieldValue <= filterValue;
      
      case FilterOperator.CONTAINS:
        return this.stringContains(fieldValue, filterValue, filter.caseSensitive);
      
      case FilterOperator.NOT_CONTAINS:
        return !this.stringContains(fieldValue, filterValue, filter.caseSensitive);
      
      case FilterOperator.STARTS_WITH:
        return this.stringStartsWith(fieldValue, filterValue, filter.caseSensitive);
      
      case FilterOperator.ENDS_WITH:
        return this.stringEndsWith(fieldValue, filterValue, filter.caseSensitive);
      
      case FilterOperator.IN:
        if (!Array.isArray(filterValue)) {
          throw new Error('IN operator requires an array value');
        }
        return filterValue.some(val => this.compareValues(fieldValue, val, filter.caseSensitive) === 0);
      
      case FilterOperator.NOT_IN:
        if (!Array.isArray(filterValue)) {
          throw new Error('NOT_IN operator requires an array value');
        }
        return !filterValue.some(val => this.compareValues(fieldValue, val, filter.caseSensitive) === 0);
      
      case FilterOperator.IS_NULL:
        return fieldValue === null || fieldValue === undefined;
      
      case FilterOperator.IS_NOT_NULL:
        return fieldValue !== null && fieldValue !== undefined;
      
      case FilterOperator.REGEX:
        try {
          const regex = new RegExp(filterValue, filter.caseSensitive ? 'g' : 'gi');
          return regex.test(String(fieldValue));
        } catch (error) {
          throw new Error(`Invalid regex pattern: ${filterValue}`);
        }
      
      case FilterOperator.BETWEEN:
        if (!Array.isArray(filterValue) || filterValue.length !== 2) {
          throw new Error('BETWEEN operator requires an array of two values');
        }
        const [min, max] = filterValue;
        return fieldValue >= min && fieldValue <= max;
      
      default:
        throw new Error(`Unsupported filter operator: ${filter.operator}`);
    }
  }

  /**
   * 객체에서 필드 값을 가져옵니다. 중첩된 필드도 지원합니다.
   */
  private getFieldValue(item: any, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value = item;
    
    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }
    
    return value;
  }

  /**
   * 데이터 타입을 검증합니다.
   */
  private validateDataType(value: any, expectedType: string, fieldName: string): void {
    if (value === null || value === undefined) {
      return; // null/undefined는 모든 타입에서 허용
    }

    switch (expectedType) {
      case 'string':
        if (typeof value !== 'string') {
          throw new Error(`Invalid value type for field "${fieldName}". Expected string, got ${typeof value}`);
        }
        break;
      
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          throw new Error(`Invalid value type for field "${fieldName}". Expected number, got ${typeof value}`);
        }
        break;
      
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new Error(`Invalid value type for field "${fieldName}". Expected boolean, got ${typeof value}`);
        }
        break;
      
      case 'date':
        if (!(value instanceof Date) && !this.isValidDateString(value)) {
          throw new Error(`Invalid value type for field "${fieldName}". Expected date, got ${typeof value}`);
        }
        break;
      
      case 'array':
        if (!Array.isArray(value)) {
          throw new Error(`Invalid value type for field "${fieldName}". Expected array, got ${typeof value}`);
        }
        break;
    }
  }

  /**
   * 두 값을 비교합니다.
   */
  private compareValues(a: any, b: any, caseSensitive: boolean = true): number {
    if (typeof a === 'string' && typeof b === 'string') {
      const aVal = caseSensitive ? a : a.toLowerCase();
      const bVal = caseSensitive ? b : b.toLowerCase();
      return aVal.localeCompare(bVal);
    }
    
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  /**
   * 문자열 포함 여부를 확인합니다.
   */
  private stringContains(str: any, searchValue: any, caseSensitive: boolean = true): boolean {
    const strVal = caseSensitive ? String(str) : String(str).toLowerCase();
    const searchVal = caseSensitive ? String(searchValue) : String(searchValue).toLowerCase();
    return strVal.includes(searchVal);
  }

  /**
   * 문자열 시작 여부를 확인합니다.
   */
  private stringStartsWith(str: any, searchValue: any, caseSensitive: boolean = true): boolean {
    const strVal = caseSensitive ? String(str) : String(str).toLowerCase();
    const searchVal = caseSensitive ? String(searchValue) : String(searchValue).toLowerCase();
    return strVal.startsWith(searchVal);
  }

  /**
   * 문자열 끝 여부를 확인합니다.
   */
  private stringEndsWith(str: any, searchValue: any, caseSensitive: boolean = true): boolean {
    const strVal = caseSensitive ? String(str) : String(str).toLowerCase();
    const searchVal = caseSensitive ? String(searchValue) : String(searchValue).toLowerCase();
    return strVal.endsWith(searchVal);
  }

  /**
   * 유효한 날짜 문자열인지 확인합니다.
   */
  private isValidDateString(value: any): boolean {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  /**
   * FilterGroup을 데이터에 적용합니다.
   * 중첩된 규칙과 그룹을 처리할 수 있습니다.
   */
  applyFilterGroup(data: any[], filterGroup: FilterGroup): any[] {
    if (!filterGroup.enabled) {
      return data;
    }

    return data.filter(item => this.evaluateFilterGroup(item, filterGroup));
  }

  /**
   * 개별 데이터 아이템에 대해 FilterGroup을 평가합니다.
   */
  private evaluateFilterGroup(item: any, filterGroup: FilterGroup): boolean {
    if (!filterGroup.enabled) {
      return true;
    }

    // 활성화된 규칙들 처리
    const enabledRules = filterGroup.rules?.filter(rule => rule.enabled) || [];
    const ruleResults = enabledRules.map(rule => this.evaluateFilter(item, rule));

    // 활성화된 하위 그룹들 처리
    const enabledGroups = filterGroup.groups?.filter(group => group.enabled) || [];
    const groupResults = enabledGroups.map(group => this.evaluateFilterGroup(item, group));

    // 모든 결과 합치기
    const allResults = [...ruleResults, ...groupResults];

    if (allResults.length === 0) {
      return true; // 활성화된 조건이 없으면 통과
    }

    // 연산자에 따라 결과 계산
    if (filterGroup.operator === 'AND') {
      return allResults.every(result => result);
    } else {
      return allResults.some(result => result);
    }
  }
} 