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
