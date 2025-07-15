"use strict";
// 데이터 처리 관련 타입 정의
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformOperation = exports.TransformType = exports.AggregateFunction = exports.FilterOperator = void 0;
var FilterOperator;
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
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
var AggregateFunction;
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
})(AggregateFunction || (exports.AggregateFunction = AggregateFunction = {}));
var TransformType;
(function (TransformType) {
    TransformType["FIELD_MAPPING"] = "fieldMapping";
    TransformType["DATA_TYPE_CONVERSION"] = "dataTypeConversion";
    TransformType["CALCULATION"] = "calculation";
    TransformType["STRING_MANIPULATION"] = "stringManipulation";
    TransformType["DATE_MANIPULATION"] = "dateManipulation";
    TransformType["CONDITIONAL"] = "conditional";
})(TransformType || (exports.TransformType = TransformType = {}));
var TransformOperation;
(function (TransformOperation) {
    // 필드 매핑
    TransformOperation["RENAME"] = "rename";
    TransformOperation["COPY"] = "copy";
    // 데이터 타입 변환
    TransformOperation["TO_STRING"] = "toString";
    TransformOperation["TO_NUMBER"] = "toNumber";
    TransformOperation["TO_BOOLEAN"] = "toBoolean";
    TransformOperation["TO_DATE"] = "toDate";
    // 계산
    TransformOperation["ADD"] = "add";
    TransformOperation["SUBTRACT"] = "subtract";
    TransformOperation["MULTIPLY"] = "multiply";
    TransformOperation["DIVIDE"] = "divide";
    TransformOperation["MODULO"] = "modulo";
    // 문자열 조작
    TransformOperation["UPPER_CASE"] = "upperCase";
    TransformOperation["LOWER_CASE"] = "lowerCase";
    TransformOperation["TRIM"] = "trim";
    TransformOperation["SUBSTRING"] = "substring";
    TransformOperation["REPLACE"] = "replace";
    TransformOperation["SPLIT"] = "split";
    TransformOperation["CONCAT"] = "concat";
    // 날짜 조작
    TransformOperation["FORMAT_DATE"] = "formatDate";
    TransformOperation["ADD_DAYS"] = "addDays";
    TransformOperation["ADD_MONTHS"] = "addMonths";
    TransformOperation["ADD_YEARS"] = "addYears";
    // 조건부
    TransformOperation["IF_THEN_ELSE"] = "ifThenElse";
    TransformOperation["CASE_WHEN"] = "caseWhen";
})(TransformOperation || (exports.TransformOperation = TransformOperation = {}));
