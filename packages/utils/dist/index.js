// ID 생성 유틸리티
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
// 노드 유효성 검증
export const validateNode = (node) => {
    return !!(node.id &&
        node.type &&
        node.position &&
        typeof node.position.x === 'number' &&
        typeof node.position.y === 'number' &&
        node.data);
};
// 에러 생성 헬퍼
export const createError = (code, message, details) => {
    return {
        code,
        message,
        details
    };
};
// 딥 클론 유틸리티
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const copy = {};
        for (const key in obj) {
            copy[key] = deepClone(obj[key]);
        }
        return copy;
    }
    return obj;
};
// 디바운스 유틸리티
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
// 날짜 포맷팅
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
