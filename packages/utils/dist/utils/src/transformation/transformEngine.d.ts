interface TransformationRule {
    id: string;
    sourceField: string;
    targetField: string;
    function: TransformFunction;
    parameters?: Record<string, any>;
    enabled?: boolean;
}
declare enum TransformFunction {
    RENAME = "rename",
    CAST = "cast",
    SUBSTRING = "substring",
    REPLACE = "replace",
    UPPER = "upper",
    LOWER = "lower",
    TRIM = "trim",
    CONCAT = "concat",
    SPLIT = "split",
    DATE_FORMAT = "dateFormat",
    MATH_OPERATION = "mathOperation",
    CONDITIONAL = "conditional",
    CUSTOM = "custom"
}
export declare class TransformEngine {
    /**
     * 데이터에 변환 규칙을 적용합니다.
     */
    transform(data: any[], transformations: TransformationRule[]): any[];
    /**
     * 개별 아이템에 변환 규칙을 적용합니다.
     */
    private applyTransformation;
    /**
     * 값을 지정된 타입으로 캐스팅합니다.
     */
    private castValue;
    /**
     * 문자열 부분 추출
     */
    private substring;
    /**
     * 문자열 치환
     */
    private replace;
    /**
     * 문자열 연결
     */
    private concat;
    /**
     * 문자열 분할
     */
    private split;
    /**
     * 날짜 포맷팅
     */
    private formatDate;
    /**
     * 수학 연산
     */
    private mathOperation;
    /**
     * 조건부 변환
     */
    private conditional;
    /**
     * 조건 평가
     */
    private evaluateCondition;
    /**
     * 커스텀 함수 실행
     */
    private customFunction;
    /**
     * 객체에서 필드 값을 가져옵니다.
     */
    private getFieldValue;
    /**
     * 객체의 필드 값을 설정합니다.
     */
    private setFieldValue;
}
export {};
//# sourceMappingURL=transformEngine.d.ts.map