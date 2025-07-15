import React from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { Group, Text, Badge } from '@mantine/core';
import { FilterNodeData, NodeType } from '@diagram/common';
import { BaseNodeComponent } from './BaseNode';

interface FilterNodeProps extends NodeProps {
  data: FilterNodeData & {
    nodeType: NodeType.FILTER;
    isValid?: boolean;
    errors?: string[];
    warnings?: string[];
    filteredCount?: number;
    totalCount?: number;
  };
  onDelete?: (nodeId: string) => void;
}

export const FilterNode: React.FC<FilterNodeProps> = (props) => {
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
    hasInputs: true,
    hasOutputs: true,
  };

  return (
    <div>
      <BaseNodeComponent
        {...restProps}
        data={baseNodeData}
        onDelete={handleDelete}
      />
      
      {/* 필터 특화 정보 표시 */}
      <div style={{ position: 'absolute', bottom: 4, left: 8, right: 8 }}>
        <Group justify="space-between" gap="xs">
          {/* 필터 개수 */}
          {data.filters && data.filters.length > 0 && (
            <Group gap="xs">
              <Badge size="xs" variant="outline" color="orange">
                {data.filters.length} filters
              </Badge>
              {data.operator && (
                <Badge size="xs" variant="filled" color="orange">
                  {data.operator}
                </Badge>
              )}
            </Group>
          )}
          
          {/* 필터링 결과 */}
          {data.filteredCount !== undefined && data.totalCount !== undefined && (
            <Text size="xs" c="dimmed">
              {data.filteredCount.toLocaleString()} / {data.totalCount.toLocaleString()}
            </Text>
          )}
        </Group>
        
        {/* 필터 규칙 미리보기 */}
        {data.filters && data.filters.length > 0 && (
          <Text 
            size="xs" 
            c="dimmed" 
            style={{ 
              fontSize: '10px',
              marginTop: 2,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {data.filters
              .filter(f => f.enabled)
              .map(f => `${f.field} ${f.operator} ${f.value}`)
              .join(` ${data.operator} `)
            }
          </Text>
        )}
      </div>
    </div>
  );
};

export default FilterNode; 