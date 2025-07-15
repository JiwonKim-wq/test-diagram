"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeExecutionStatus = exports.NodeCategory = exports.OutputType = exports.JoinType = exports.NodeType = void 0;
// 노드 타입 열거형
var NodeType;
(function (NodeType) {
    NodeType["DATABASE"] = "database";
    NodeType["FILTER"] = "filter";
    NodeType["AGGREGATE"] = "aggregate";
    NodeType["TRANSFORM"] = "transform";
    NodeType["JOIN"] = "join";
    NodeType["OUTPUT"] = "output";
    NodeType["PYTHON"] = "python";
    NodeType["LOGPRESSO"] = "logpresso";
})(NodeType || (exports.NodeType = NodeType = {}));
// 조인 타입
var JoinType;
(function (JoinType) {
    JoinType["INNER"] = "inner";
    JoinType["LEFT"] = "left";
    JoinType["RIGHT"] = "right";
    JoinType["FULL"] = "full";
    JoinType["CROSS"] = "cross";
})(JoinType || (exports.JoinType = JoinType = {}));
// 출력 타입
var OutputType;
(function (OutputType) {
    OutputType["DOWNLOAD"] = "download";
    OutputType["DATABASE"] = "database";
    OutputType["API"] = "api";
    OutputType["EMAIL"] = "email";
    OutputType["WEBHOOK"] = "webhook";
    OutputType["FILE_SYSTEM"] = "fileSystem";
})(OutputType || (exports.OutputType = OutputType = {}));
// 노드 카테고리
var NodeCategory;
(function (NodeCategory) {
    NodeCategory["DATA_SOURCE"] = "dataSource";
    NodeCategory["PROCESSING"] = "processing";
    NodeCategory["ANALYSIS"] = "analysis";
    NodeCategory["OUTPUT"] = "output";
    NodeCategory["CUSTOM"] = "custom";
})(NodeCategory || (exports.NodeCategory = NodeCategory = {}));
// 노드 실행 상태
var NodeExecutionStatus;
(function (NodeExecutionStatus) {
    NodeExecutionStatus["PENDING"] = "pending";
    NodeExecutionStatus["RUNNING"] = "running";
    NodeExecutionStatus["COMPLETED"] = "completed";
    NodeExecutionStatus["FAILED"] = "failed";
    NodeExecutionStatus["CANCELLED"] = "cancelled";
    NodeExecutionStatus["SKIPPED"] = "skipped";
})(NodeExecutionStatus || (exports.NodeExecutionStatus = NodeExecutionStatus = {}));
