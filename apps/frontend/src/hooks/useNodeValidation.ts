import { useState, useEffect, useCallback } from 'react';
import { 
  BaseNode, 
  NodeValidationResult, 
  NodeType, 
  DatabaseNodeData, 
  LogpressoNodeData, 
  FilterNodeData, 
  PythonNodeData 
} from '@diagram/common';

// 타입 가드 함수들
const isDatabaseNode = (node: BaseNode): node is BaseNode & { data: DatabaseNodeData } => {
  return node.type === NodeType.DATABASE;
};

const isLogpressoNode = (node: BaseNode): node is BaseNode & { data: LogpressoNodeData } => {
  return node.type === NodeType.LOGPRESSO;
};

const isFilterNode = (node: BaseNode): node is BaseNode & { data: FilterNodeData } => {
  return node.type === NodeType.FILTER;
};

const isPythonNode = (node: BaseNode): node is BaseNode & { data: PythonNodeData } => {
  return node.type === NodeType.PYTHON;
};

// 간단한 노드 검증 함수
const validateNodeData = (node: BaseNode): NodeValidationResult => {
  const errors: any[] = [];
  const warnings: any[] = [];

  // 기본 검증
  if (!node.id) {
    errors.push({
      field: 'id',
      message: '노드 ID가 필요합니다.',
      code: 'REQUIRED_FIELD',
      severity: 'error'
    });
  }

  // 노드 타입별 검증
  switch (node.type) {
    case NodeType.DATABASE:
      if (isDatabaseNode(node)) {
        if (!node.data?.connectionConfig?.host) {
          errors.push({
            field: 'host',
            message: '호스트 주소가 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
          });
        }
        if (!node.data?.connectionConfig?.database) {
          errors.push({
            field: 'database',
            message: '데이터베이스명이 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
          });
        }
        if (!node.data?.query) {
          errors.push({
            field: 'query',
            message: '쿼리가 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
          });
        }
      }
      break;

    case NodeType.LOGPRESSO:
      if (isLogpressoNode(node)) {
        if (!node.data?.query) {
          errors.push({
            field: 'query',
            message: '쿼리가 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
          });
        }
      }
      break;

    case NodeType.FILTER:
      if (isFilterNode(node)) {
        if (!node.data?.filters || node.data.filters.length === 0) {
          warnings.push({
            field: 'filters',
            message: '필터 조건이 없습니다.',
            code: 'EMPTY_FILTERS',
            severity: 'warning'
          });
        }
      }
      break;

    case NodeType.PYTHON:
      if (isPythonNode(node)) {
        if (!node.data?.code || node.data.code.trim() === '') {
          errors.push({
            field: 'code',
            message: 'Python 코드가 필요합니다.',
            code: 'REQUIRED_FIELD',
            severity: 'error'
          });
        }
      }
      break;
  }

  return {
    nodeId: node.id,
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

interface UseNodeValidationProps {
  node: BaseNode | null;
  autoValidate?: boolean;
}

interface UseNodeValidationReturn {
  validationResult: NodeValidationResult | null;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validateNow: () => void;
  isValidating: boolean;
}

export const useNodeValidation = ({ 
  node, 
  autoValidate = true 
}: UseNodeValidationProps): UseNodeValidationReturn => {
  const [validationResult, setValidationResult] = useState<NodeValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateNow = useCallback(() => {
    if (!node) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    
    try {
      // 실제 검증 로직 실행
      const result = validateNodeData(node);
      setValidationResult(result);
    } catch (error) {
      console.error('노드 검증 중 오류 발생:', error);
      setValidationResult({
        nodeId: node.id,
        isValid: false,
        errors: [{
          field: 'general',
          message: '검증 중 오류가 발생했습니다.',
          code: 'VALIDATION_ERROR',
          severity: 'error'
        }],
        warnings: []
      });
    } finally {
      setIsValidating(false);
    }
  }, [node]);

  // 자동 검증 활성화 시 노드 변경 감지
  useEffect(() => {
    if (autoValidate && node) {
      // 디바운스를 위한 타이머
      const timer = setTimeout(() => {
        validateNow();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [node, autoValidate, validateNow]);

  // 반환값 계산
  const isValid = validationResult?.isValid ?? false;
  const errors = validationResult?.errors?.map(err => err.message) ?? [];
  const warnings = validationResult?.warnings?.map(warn => warn.message) ?? [];

  return {
    validationResult,
    isValid,
    errors,
    warnings,
    validateNow,
    isValidating
  };
};

// 노드 데이터 변경 감지를 위한 훅
export const useNodeDataChange = (nodeData: any) => {
  const [lastChange, setLastChange] = useState<number>(Date.now());

  useEffect(() => {
    setLastChange(Date.now());
  }, [nodeData]);

  return lastChange;
}; 