export { default as BaseNodeComponent } from './BaseNode';
export { default as DatabaseNode } from './DatabaseNode';
export { default as FilterNode } from './FilterNode';
export { default as GenericNode } from './GenericNode';

// 노드 타입별 컴포넌트 매핑
import { NodeType } from '@diagram/common';
import { DatabaseNode } from './DatabaseNode';
import { FilterNode } from './FilterNode';
import { GenericNode } from './GenericNode';

export const nodeTypes = {
  [NodeType.DATABASE]: DatabaseNode,
  [NodeType.FILTER]: FilterNode,
  [NodeType.AGGREGATE]: GenericNode,
  [NodeType.TRANSFORM]: GenericNode,
  [NodeType.JOIN]: GenericNode,
  [NodeType.OUTPUT]: GenericNode,
  [NodeType.PYTHON]: GenericNode,
  [NodeType.LOGPRESSO]: GenericNode,
}; 