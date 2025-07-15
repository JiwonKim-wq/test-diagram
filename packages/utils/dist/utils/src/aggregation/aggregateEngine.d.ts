interface AggregationRule {
    id: string;
    field: string;
    function: AggregateFunction;
    alias?: string;
    distinct?: boolean;
    enabled?: boolean;
}
declare enum AggregateFunction {
    COUNT = "count",
    SUM = "sum",
    AVG = "avg",
    MIN = "min",
    MAX = "max",
    FIRST = "first",
    LAST = "last",
    STDDEV = "stddev",
    VARIANCE = "variance"
}
interface OrderByRule {
    field: string;
    direction: 'ASC' | 'DESC';
}
export declare class AggregateEngine {
    /**
     * 데이터에 집계 규칙을 적용합니다.
     */
    aggregate(data: any[], groupBy: string[], aggregations: AggregationRule[], orderBy?: OrderByRule[]): any[];
    /**
     * 데이터를 그룹화합니다.
     */
    private groupData;
    /**
     * 개별 그룹에 집계 함수를 적용합니다.
     */
    private applyAggregation;
    /**
     * 표준편차를 계산합니다.
     */
    private calculateStandardDeviation;
    /**
     * 분산을 계산합니다.
     */
    private calculateVariance;
    /**
     * 데이터를 정렬합니다.
     */
    private sortData;
    /**
     * 객체에서 필드 값을 가져옵니다.
     */
    private getFieldValue;
}
export {};
//# sourceMappingURL=aggregateEngine.d.ts.map