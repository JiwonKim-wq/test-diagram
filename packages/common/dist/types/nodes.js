// 노드 타입 열거형
export var NodeType;
(function (NodeType) {
    NodeType["DATABASE"] = "database";
    NodeType["FILTER"] = "filter";
    NodeType["AGGREGATE"] = "aggregate";
    NodeType["TRANSFORM"] = "transform";
    NodeType["JOIN"] = "join";
    NodeType["OUTPUT"] = "output";
    NodeType["PYTHON"] = "python";
    NodeType["LOGPRESSO"] = "logpresso";
})(NodeType || (NodeType = {}));
// 필터 연산자
export var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EQUALS"] = "equals";
    FilterOperator["NOT_EQUALS"] = "notEquals";
    FilterOperator["GREATER_THAN"] = "greaterThan";
    FilterOperator["GREATER_THAN_OR_EQUAL"] = "greaterThanOrEqual";
    FilterOperator["LESS_THAN"] = "lessThan";
    FilterOperator["LESS_THAN_OR_EQUAL"] = "lessThanOrEqual";
    FilterOperator["CONTAINS"] = "contains";
    FilterOperator["NOT_CONTAINS"] = "notContains";
    FilterOperator["STARTS_WITH"] = "startsWith";
    FilterOperator["ENDS_WITH"] = "endsWith";
    FilterOperator["IN"] = "in";
    FilterOperator["NOT_IN"] = "notIn";
    FilterOperator["IS_NULL"] = "isNull";
    FilterOperator["IS_NOT_NULL"] = "isNotNull";
    FilterOperator["REGEX"] = "regex";
    FilterOperator["BETWEEN"] = "between";
})(FilterOperator || (FilterOperator = {}));
// 집계 함수
export var AggregateFunction;
(function (AggregateFunction) {
    AggregateFunction["COUNT"] = "count";
    AggregateFunction["SUM"] = "sum";
    AggregateFunction["AVG"] = "avg";
    AggregateFunction["MIN"] = "min";
    AggregateFunction["MAX"] = "max";
    AggregateFunction["FIRST"] = "first";
    AggregateFunction["LAST"] = "last";
    AggregateFunction["STDDEV"] = "stddev";
    AggregateFunction["VARIANCE"] = "variance";
})(AggregateFunction || (AggregateFunction = {}));
// 변환 함수
export var TransformFunction;
(function (TransformFunction) {
    TransformFunction["RENAME"] = "rename";
    TransformFunction["CAST"] = "cast";
    TransformFunction["SUBSTRING"] = "substring";
    TransformFunction["REPLACE"] = "replace";
    TransformFunction["UPPER"] = "upper";
    TransformFunction["LOWER"] = "lower";
    TransformFunction["TRIM"] = "trim";
    TransformFunction["CONCAT"] = "concat";
    TransformFunction["SPLIT"] = "split";
    TransformFunction["DATE_FORMAT"] = "dateFormat";
    TransformFunction["MATH_OPERATION"] = "mathOperation";
    TransformFunction["CONDITIONAL"] = "conditional";
    TransformFunction["CUSTOM"] = "custom";
})(TransformFunction || (TransformFunction = {}));
// 조인 타입
export var JoinType;
(function (JoinType) {
    JoinType["INNER"] = "inner";
    JoinType["LEFT"] = "left";
    JoinType["RIGHT"] = "right";
    JoinType["FULL"] = "full";
    JoinType["CROSS"] = "cross";
})(JoinType || (JoinType = {}));
// 출력 타입
export var OutputType;
(function (OutputType) {
    OutputType["DOWNLOAD"] = "download";
    OutputType["DATABASE"] = "database";
    OutputType["API"] = "api";
    OutputType["EMAIL"] = "email";
    OutputType["WEBHOOK"] = "webhook";
    OutputType["FILE_SYSTEM"] = "fileSystem";
})(OutputType || (OutputType = {}));
// 노드 카테고리
export var NodeCategory;
(function (NodeCategory) {
    NodeCategory["DATA_SOURCE"] = "dataSource";
    NodeCategory["PROCESSING"] = "processing";
    NodeCategory["ANALYSIS"] = "analysis";
    NodeCategory["OUTPUT"] = "output";
    NodeCategory["CUSTOM"] = "custom";
})(NodeCategory || (NodeCategory = {}));
// 노드 실행 상태
export var NodeExecutionStatus;
(function (NodeExecutionStatus) {
    NodeExecutionStatus["PENDING"] = "pending";
    NodeExecutionStatus["RUNNING"] = "running";
    NodeExecutionStatus["COMPLETED"] = "completed";
    NodeExecutionStatus["FAILED"] = "failed";
    NodeExecutionStatus["CANCELLED"] = "cancelled";
    NodeExecutionStatus["SKIPPED"] = "skipped";
})(NodeExecutionStatus || (NodeExecutionStatus = {}));
