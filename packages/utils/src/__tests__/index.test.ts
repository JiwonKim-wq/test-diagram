import { generateId, validateNode, createError, deepClone, debounce, formatDate } from '../index';

describe('Utils Package', () => {
  describe('generateId', () => {
    test('유니크한 ID를 생성해야 한다', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });
  });

  describe('validateNode', () => {
    test('유효한 노드를 검증해야 한다', () => {
      const validNode = {
        id: '123',
        type: 'test',
        position: { x: 0, y: 0 },
        data: {}
      };

      expect(validateNode(validNode)).toBe(true);
    });

    test('유효하지 않은 노드를 거부해야 한다', () => {
      const invalidNode = {
        id: '123',
        // type이 누락됨
        position: { x: 0, y: 0 },
        data: {}
      };

      expect(validateNode(invalidNode)).toBe(false);
    });
  });

  describe('createError', () => {
    test('에러 객체를 생성해야 한다', () => {
      const error = createError('TEST_ERROR', 'Test message', { detail: 'test' });
      
      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test message');
      expect(error.details).toEqual({ detail: 'test' });
    });
  });

  describe('deepClone', () => {
    test('객체를 깊게 복사해야 한다', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });
  });

  describe('formatDate', () => {
    test('날짜를 한국어 형식으로 포맷해야 한다', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date);
      
      expect(formatted).toContain('2024');
      expect(formatted).toContain('01');
      expect(formatted).toContain('15');
    });
  });
}); 