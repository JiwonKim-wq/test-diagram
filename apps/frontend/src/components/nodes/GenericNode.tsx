import React from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { BaseNodeComponent } from './BaseNode';

interface GenericNodeProps extends NodeProps {
  data: any;
}

export const GenericNode: React.FC<GenericNodeProps> = (props) => {
  const { data, ...restProps } = props;
  const { setNodes, setEdges } = useReactFlow();
  
  // 노드 삭제 함수
  const handleDelete = (nodeId: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  };
  
  // BaseNode에 전달할 데이터 준비
  const baseNodeData = {
    ...data,
    hasInputs: data.nodeType !== 'database' && data.nodeType !== 'logpresso',
    hasOutputs: data.nodeType !== 'output',
  };

  return (
    <BaseNodeComponent
      {...restProps}
      data={baseNodeData}
      onDelete={handleDelete}
    />
  );
};

export default GenericNode; 