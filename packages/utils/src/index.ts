// ID 생성 유틸리티
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 노드 검증 유틸리티 export
export * from './nodeValidation';

// 에러 생성 헬퍼
export const createError = (code: string, message: string, details?: Record<string, any>) => {
  return {
    code,
    message,
    details
  };
};

// 딥 클론 유틸리티
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const copy: Record<string, any> = {};
    for (const key in obj) {
      copy[key] = deepClone(obj[key]);
    }
    return copy as T;
  }
  return obj;
};

// 디바운스 유틸리티
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 날짜 포맷팅
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}; 