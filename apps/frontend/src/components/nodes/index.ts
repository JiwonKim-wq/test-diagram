export { default as BaseNodeComponent } from './BaseNode';
export { default as DatabaseNode } from './DatabaseNode';
export { default as FilterNode } from './FilterNode';

// 노드 타입별 컴포넌트 매핑
import { NodeType } from '@diagram/common';
import { DatabaseNode } from './DatabaseNode';
import { FilterNode } from './FilterNode';

export const nodeTypes = {
  [NodeType.DATABASE]: DatabaseNode,
  [NodeType.FILTER]: FilterNode,
  // 추후 추가될 노드 타입들
  // [NodeType.AGGREGATE]: AggregateNode,
  // [NodeType.TRANSFORM]: TransformNode,
  // [NodeType.JOIN]: JoinNode,
  // [NodeType.OUTPUT]: OutputNode,
  // [NodeType.PYTHON]: PythonNode,
  // [NodeType.LOGPRESSO]: LogpressoNode,
}; 