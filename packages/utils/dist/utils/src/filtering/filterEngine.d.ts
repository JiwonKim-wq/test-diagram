interface FilterRule {
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
    dataType: 'string' | 'number' | 'boolean' | 'date' | 'array';
    caseSensitive?: boolean;
    enabled?: boolean;
}
declare enum FilterOperator {
    EQUALS = "equals",
    NOT_EQUALS = "notEquals",
    GREATER_THAN = "greaterThan",
    GREATER_THAN_OR_EQUAL = "greaterThanOrEqual",
    LESS_THAN = "lessThan",
    LESS_THAN_OR_EQUAL = "lessThanOrEqual",
    CONTAINS = "contains",
    NOT_CONTAINS = "notContains",
    STARTS_WITH = "startsWith",
    ENDS_WITH = "endsWith",
    IN = "in",
    NOT_IN = "notIn",
    IS_NULL = "isNull",
    IS_NOT_NULL = "isNotNull",
    REGEX = "regex",
    BETWEEN = "between"
}
interface FilterGroup {
    id: string;
    operator: 'AND' | 'OR';
    rules: FilterRule[];
    groups?: FilterGroup[];
    enabled?: boolean;
}
export declare class FilterEngine {
    /**
     * 단일 필터 규칙을 데이터에 적용합니다.
     */
    applyFilter(data: any[], filter: FilterRule): any[];
    /**
     * 여러 필터 규칙을 데이터에 적용합니다.
     */
    applyFilters(data: any[], filters: FilterRule[], operator?: 'AND' | 'OR'): any[];
    /**
     * 개별 아이템에 대해 필터 규칙을 평가합니다.
     */
    private evaluateFilter;
    /**
     * 객체에서 필드 값을 가져옵니다. 중첩된 필드도 지원합니다.
     */
    private getFieldValue;
    /**
     * 데이터 타입을 검증합니다.
     */
    private validateDataType;
    /**
     * 두 값을 비교합니다.
     */
    private compareValues;
    /**
     * 문자열 포함 여부를 확인합니다.
     */
    private stringContains;
    /**
     * 문자열 시작 여부를 확인합니다.
     */
    private stringStartsWith;
    /**
     * 문자열 끝 여부를 확인합니다.
     */
    private stringEndsWith;
    /**
     * 유효한 날짜 문자열인지 확인합니다.
     */
    private isValidDateString;
    /**
     * FilterGroup을 데이터에 적용합니다.
     * 중첩된 규칙과 그룹을 처리할 수 있습니다.
     */
    applyFilterGroup(data: any[], filterGroup: FilterGroup): any[];
    /**
     * 개별 데이터 아이템에 대해 FilterGroup을 평가합니다.
     */
    private evaluateFilterGroup;
}
export {};
//# sourceMappingURL=filterEngine.d.ts.map