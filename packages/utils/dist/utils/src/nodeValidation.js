import { NodeType, FilterOperator } from '@diagram/common';
// 노드 검증 메인 함수
export function validateNode(node) {
    const errors = [];
    const warnings = [];
    // 기본 노드 검증
    validateBaseNode(node, errors, warnings);
    // 타입별 검증
    switch (node.type) {
        case NodeType.DATABASE:
            validateDatabaseNode(node.data, errors, warnings);
            break;
        case NodeType.FILTER:
            validateFilterNode(node.data, errors, warnings);
            break;
        case NodeType.AGGREGATE:
            validateAggregateNode(node.data, errors, warnings);
            break;
        case NodeType.TRANSFORM:
            validateTransformNode(node.data, errors, warnings);
            break;
        case NodeType.JOIN:
            validateJoinNode(node.data, errors, warnings);
            break;
        case NodeType.OUTPUT:
            validateOutputNode(node.data, errors, warnings);
            break;
        case NodeType.PYTHON:
            validatePythonNode(node.data, errors, warnings);
            break;
        case NodeType.LOGPRESSO:
            validateLogpressoNode(node.data, errors, warnings);
            break;
        default:
            errors.push({
                field: 'type',
                message: `지원하지 않는 노드 타입입니다: ${node.type}`,
                code: 'UNSUPPORTED_NODE_TYPE',
                severity: 'error'
            });
    }
    return {
        nodeId: node.id,
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
// 기본 노드 검증
function validateBaseNode(node, errors, warnings) {
    if (!node.id || node.id.trim() === '') {
        errors.push({
            field: 'id',
            message: '노드 ID는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!node.type) {
        errors.push({
            field: 'type',
            message: '노드 타입은 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!node.position) {
        errors.push({
            field: 'position',
            message: '노드 위치는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    else {
        if (typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
            errors.push({
                field: 'position',
                message: '노드 위치는 숫자여야 합니다.',
                code: 'INVALID_TYPE',
                severity: 'error'
            });
        }
    }
    if (!node.data) {
        errors.push({
            field: 'data',
            message: '노드 데이터는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    else {
        if (!node.data.label || node.data.label.trim() === '') {
            errors.push({
                field: 'data.label',
                message: '노드 라벨은 필수입니다.',
                code: 'REQUIRED_FIELD',
                severity: 'error'
            });
        }
    }
}
// 데이터베이스 노드 검증
function validateDatabaseNode(data, errors, warnings) {
    if (!data.connectionId && !data.connectionConfig) {
        errors.push({
            field: 'connection',
            message: '데이터베이스 연결 정보가 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (data.connectionConfig) {
        if (!data.connectionConfig.host) {
            errors.push({
                field: 'connectionConfig.host',
                message: '호스트는 필수입니다.',
                code: 'REQUIRED_FIELD',
                severity: 'error'
            });
        }
        if (!data.connectionConfig.port || data.connectionConfig.port <= 0) {
            errors.push({
                field: 'connectionConfig.port',
                message: '유효한 포트 번호가 필요합니다.',
                code: 'INVALID_VALUE',
                severity: 'error'
            });
        }
        if (!data.connectionConfig.database) {
            errors.push({
                field: 'connectionConfig.database',
                message: '데이터베이스명은 필수입니다.',
                code: 'REQUIRED_FIELD',
                severity: 'error'
            });
        }
        if (!data.connectionConfig.username) {
            errors.push({
                field: 'connectionConfig.username',
                message: '사용자명은 필수입니다.',
                code: 'REQUIRED_FIELD',
                severity: 'error'
            });
        }
    }
    if (data.query && data.query.trim() === '') {
        warnings.push({
            field: 'query',
            message: '쿼리가 비어있습니다.',
            code: 'EMPTY_QUERY',
            suggestion: 'SELECT 쿼리를 입력하세요.'
        });
    }
    if (data.limit && data.limit <= 0) {
        errors.push({
            field: 'limit',
            message: '제한 수는 0보다 커야 합니다.',
            code: 'INVALID_VALUE',
            severity: 'error'
        });
    }
    if (data.offset && data.offset < 0) {
        errors.push({
            field: 'offset',
            message: '오프셋은 0 이상이어야 합니다.',
            code: 'INVALID_VALUE',
            severity: 'error'
        });
    }
}
// 필터 노드 검증
function validateFilterNode(data, errors, warnings) {
    if (!data.filters || data.filters.length === 0) {
        warnings.push({
            field: 'filters',
            message: '필터 규칙이 없습니다.',
            code: 'NO_FILTERS',
            suggestion: '최소 하나의 필터 규칙을 추가하세요.'
        });
    }
    else {
        data.filters.forEach((filter, index) => {
            validateFilterRule(filter, `filters[${index}]`, errors, warnings);
        });
    }
    if (!data.operator || !['AND', 'OR'].includes(data.operator)) {
        errors.push({
            field: 'operator',
            message: '유효한 연산자(AND, OR)를 선택하세요.',
            code: 'INVALID_VALUE',
            severity: 'error'
        });
    }
}
// 필터 규칙 검증
function validateFilterRule(rule, fieldPrefix, errors, warnings) {
    if (!rule.field || rule.field.trim() === '') {
        errors.push({
            field: `${fieldPrefix}.field`,
            message: '필터 필드는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!rule.operator || !Object.values(FilterOperator).includes(rule.operator)) {
        errors.push({
            field: `${fieldPrefix}.operator`,
            message: '유효한 필터 연산자를 선택하세요.',
            code: 'INVALID_VALUE',
            severity: 'error'
        });
    }
    if (rule.value === null || rule.value === undefined) {
        if (rule.operator !== FilterOperator.IS_NULL && rule.operator !== FilterOperator.IS_NOT_NULL) {
            errors.push({
                field: `${fieldPrefix}.value`,
                message: '필터 값은 필수입니다.',
                code: 'REQUIRED_FIELD',
                severity: 'error'
            });
        }
    }
    if (rule.operator === FilterOperator.IN || rule.operator === FilterOperator.NOT_IN) {
        if (!Array.isArray(rule.value)) {
            errors.push({
                field: `${fieldPrefix}.value`,
                message: 'IN/NOT_IN 연산자는 배열 값이 필요합니다.',
                code: 'INVALID_TYPE',
                severity: 'error'
            });
        }
    }
    if (rule.operator === FilterOperator.BETWEEN) {
        if (!Array.isArray(rule.value) || rule.value.length !== 2) {
            errors.push({
                field: `${fieldPrefix}.value`,
                message: 'BETWEEN 연산자는 2개의 값이 필요합니다.',
                code: 'INVALID_VALUE',
                severity: 'error'
            });
        }
    }
}
// 집계 노드 검증
function validateAggregateNode(data, errors, warnings) {
    if (!data.aggregations || data.aggregations.length === 0) {
        errors.push({
            field: 'aggregations',
            message: '최소 하나의 집계 규칙이 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    else {
        data.aggregations.forEach((agg, index) => {
            validateAggregationRule(agg, `aggregations[${index}]`, errors, warnings);
        });
    }
    if (data.groupBy && data.groupBy.length === 0) {
        warnings.push({
            field: 'groupBy',
            message: 'GROUP BY 필드가 없습니다.',
            code: 'NO_GROUP_BY',
            suggestion: '집계 결과를 그룹화할 필드를 추가하세요.'
        });
    }
    if (data.having && data.having.length > 0) {
        data.having.forEach((having, index) => {
            validateFilterRule(having, `having[${index}]`, errors, warnings);
        });
    }
}
// 집계 규칙 검증
function validateAggregationRule(rule, fieldPrefix, errors, warnings) {
    if (!rule.field || rule.field.trim() === '') {
        errors.push({
            field: `${fieldPrefix}.field`,
            message: '집계 필드는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!rule.function) {
        errors.push({
            field: `${fieldPrefix}.function`,
            message: '집계 함수는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (rule.alias && rule.alias.trim() === '') {
        warnings.push({
            field: `${fieldPrefix}.alias`,
            message: '별칭이 비어있습니다.',
            code: 'EMPTY_ALIAS',
            suggestion: '의미있는 별칭을 입력하세요.'
        });
    }
}
// 변환 노드 검증
function validateTransformNode(data, errors, warnings) {
    if (!data.transformations || data.transformations.length === 0) {
        warnings.push({
            field: 'transformations',
            message: '변환 규칙이 없습니다.',
            code: 'NO_TRANSFORMATIONS',
            suggestion: '최소 하나의 변환 규칙을 추가하세요.'
        });
    }
    else {
        data.transformations.forEach((transform, index) => {
            validateTransformationRule(transform, `transformations[${index}]`, errors, warnings);
        });
    }
}
// 변환 규칙 검증
function validateTransformationRule(rule, fieldPrefix, errors, warnings) {
    if (!rule.sourceField || rule.sourceField.trim() === '') {
        errors.push({
            field: `${fieldPrefix}.sourceField`,
            message: '소스 필드는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!rule.targetField || rule.targetField.trim() === '') {
        errors.push({
            field: `${fieldPrefix}.targetField`,
            message: '대상 필드는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!rule.operation) {
        errors.push({
            field: `${fieldPrefix}.operation`,
            message: '변환 연산은 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
}
// 조인 노드 검증
function validateJoinNode(data, errors, warnings) {
    if (!data.joinType) {
        errors.push({
            field: 'joinType',
            message: '조인 타입은 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!data.leftKey || data.leftKey.trim() === '') {
        errors.push({
            field: 'leftKey',
            message: '왼쪽 키는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!data.rightKey || data.rightKey.trim() === '') {
        errors.push({
            field: 'rightKey',
            message: '오른쪽 키는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
}
// 출력 노드 검증
function validateOutputNode(data, errors, warnings) {
    if (!data.outputType) {
        errors.push({
            field: 'outputType',
            message: '출력 타입은 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (data.outputType === 'fileSystem' && (!data.destination || data.destination.trim() === '')) {
        errors.push({
            field: 'destination',
            message: '파일 시스템 출력에는 대상 경로가 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (data.filename && data.filename.trim() === '') {
        warnings.push({
            field: 'filename',
            message: '파일명이 비어있습니다.',
            code: 'EMPTY_FILENAME',
            suggestion: '의미있는 파일명을 입력하세요.'
        });
    }
}
// 파이썬 노드 검증
function validatePythonNode(data, errors, warnings) {
    if (!data.code || data.code.trim() === '') {
        errors.push({
            field: 'code',
            message: '파이썬 코드는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (data.timeout && data.timeout <= 0) {
        errors.push({
            field: 'timeout',
            message: '타임아웃은 0보다 커야 합니다.',
            code: 'INVALID_VALUE',
            severity: 'error'
        });
    }
    if (data.memoryLimit && data.memoryLimit <= 0) {
        errors.push({
            field: 'memoryLimit',
            message: '메모리 제한은 0보다 커야 합니다.',
            code: 'INVALID_VALUE',
            severity: 'error'
        });
    }
}
// Logpresso 노드 검증
function validateLogpressoNode(data, errors, warnings) {
    if (!data.query || data.query.trim() === '') {
        errors.push({
            field: 'query',
            message: 'Logpresso 쿼리는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!data.queryType) {
        errors.push({
            field: 'queryType',
            message: '쿼리 타입은 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (data.timeRange) {
        if (!data.timeRange.from || !data.timeRange.to) {
            errors.push({
                field: 'timeRange',
                message: '시간 범위는 시작과 끝 시간이 모두 필요합니다.',
                code: 'INVALID_TIME_RANGE',
                severity: 'error'
            });
        }
        else if (data.timeRange.from >= data.timeRange.to) {
            errors.push({
                field: 'timeRange',
                message: '시작 시간은 끝 시간보다 이전이어야 합니다.',
                code: 'INVALID_TIME_RANGE',
                severity: 'error'
            });
        }
    }
}
// 다이어그램 전체 검증
export function validateDiagram(diagram) {
    const nodeResults = [];
    const diagramErrors = [];
    const diagramWarnings = [];
    // 다이어그램 기본 검증
    if (!diagram.name || diagram.name.trim() === '') {
        diagramErrors.push({
            field: 'name',
            message: '다이어그램 이름은 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!diagram.nodes || diagram.nodes.length === 0) {
        diagramWarnings.push({
            field: 'nodes',
            message: '노드가 없습니다.',
            code: 'NO_NODES',
            suggestion: '최소 하나의 노드를 추가하세요.'
        });
    }
    // 각 노드 검증
    diagram.nodes.forEach(node => {
        const result = validateNode(node);
        nodeResults.push(result);
    });
    // 노드 ID 중복 검사
    const nodeIds = diagram.nodes.map(node => node.id);
    const duplicateIds = nodeIds.filter((id, index) => nodeIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        diagramErrors.push({
            field: 'nodes',
            message: `중복된 노드 ID가 있습니다: ${duplicateIds.join(', ')}`,
            code: 'DUPLICATE_NODE_IDS',
            severity: 'error'
        });
    }
    // 연결 검증
    if (diagram.connections) {
        diagram.connections.forEach((connection, index) => {
            validateConnection(connection, diagram.nodes, `connections[${index}]`, diagramErrors, diagramWarnings);
        });
    }
    const isValid = diagramErrors.length === 0 && nodeResults.every(result => result.isValid);
    return {
        isValid,
        nodeResults,
        diagramErrors,
        diagramWarnings
    };
}
// 연결 검증
function validateConnection(connection, nodes, fieldPrefix, errors, warnings) {
    if (!connection.source || connection.source.trim() === '') {
        errors.push({
            field: `${fieldPrefix}.source`,
            message: '소스 노드 ID는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    if (!connection.target || connection.target.trim() === '') {
        errors.push({
            field: `${fieldPrefix}.target`,
            message: '대상 노드 ID는 필수입니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
        });
    }
    // 노드 존재 여부 확인
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    if (!sourceNode) {
        errors.push({
            field: `${fieldPrefix}.source`,
            message: `소스 노드를 찾을 수 없습니다: ${connection.source}`,
            code: 'NODE_NOT_FOUND',
            severity: 'error'
        });
    }
    if (!targetNode) {
        errors.push({
            field: `${fieldPrefix}.target`,
            message: `대상 노드를 찾을 수 없습니다: ${connection.target}`,
            code: 'NODE_NOT_FOUND',
            severity: 'error'
        });
    }
    // 자기 자신으로의 연결 검사
    if (connection.source === connection.target) {
        warnings.push({
            field: `${fieldPrefix}`,
            message: '노드가 자기 자신과 연결되어 있습니다.',
            code: 'SELF_CONNECTION',
            suggestion: '다른 노드와 연결하세요.'
        });
    }
}
// 노드 타입별 입력 포트 수 검증
export function validateNodeInputs(nodeType, inputCount) {
    switch (nodeType) {
        case NodeType.DATABASE:
        case NodeType.LOGPRESSO:
        case NodeType.PYTHON:
            return inputCount === 0; // 데이터 소스 노드는 입력이 없어야 함
        case NodeType.FILTER:
        case NodeType.AGGREGATE:
        case NodeType.TRANSFORM:
        case NodeType.OUTPUT:
            return inputCount === 1; // 단일 입력 노드
        case NodeType.JOIN:
            return inputCount === 2; // 조인 노드는 2개의 입력 필요
        default:
            return true; // 알 수 없는 타입은 통과
    }
}
// 노드 타입별 출력 포트 수 검증
export function validateNodeOutputs(nodeType, outputCount) {
    switch (nodeType) {
        case NodeType.OUTPUT:
            return outputCount === 0; // 출력 노드는 출력이 없어야 함
        default:
            return outputCount <= 1; // 대부분의 노드는 최대 1개의 출력
    }
}
