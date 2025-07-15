import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, Group, Text, Badge, Tooltip, ActionIcon } from '@mantine/core';
import { IconFilter, IconGripVertical, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { FilterNodeData, NodeType } from '@diagram/common';

interface FilterNodeProps extends NodeProps {
  data: FilterNodeData & {
    nodeType: NodeType.FILTER;
    isValid?: boolean;
    errors?: string[];
    warnings?: string[];
    filteredCount?: number;
    totalCount?: number;
  };
}

export const FilterNode: React.FC<FilterNodeProps> = ({ 
  data, 
  selected, 
  dragging 
}) => {
  const nodeColor = '#f76707';
  const hasErrors = data.errors && data.errors.length > 0;
  const hasWarnings = data.warnings && data.warnings.length > 0;
  
  return (
    <Card
      shadow={selected ? 'md' : 'sm'}
      padding="sm"
      radius="md"
      style={{
        borderColor: selected ? nodeColor : 'transparent',
        borderWidth: selected ? 2 : 1,
        borderStyle: 'solid',
        backgroundColor: dragging ? '#f8f9fa' : 'white',
        minWidth: 180,
        maxWidth: 250,
        cursor: dragging ? 'grabbing' : 'grab'
      }}
    >
      {/* 입력 핸들 */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: nodeColor,
          width: 12,
          height: 12,
          border: '2px solid white'
        }}
      />

      {/* 출력 핸들 */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 12,
          height: 12,
          border: '2px solid white'
        }}
      />

      {/* 노드 헤더 */}
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <IconFilter size={16} color={nodeColor} />
          <Text size="sm" fw={500} c={nodeColor}>
            {data.label}
          </Text>
        </Group>
        
        <Group gap="xs">
          {/* 상태 표시 */}
          {hasErrors && (
            <Tooltip label={data.errors?.join(', ')}>
              <Badge color="red" size="sm" variant="light">
                <IconAlertTriangle size={12} />
              </Badge>
            </Tooltip>
          )}
          {hasWarnings && (
            <Tooltip label={data.warnings?.join(', ')}>
              <Badge color="yellow" size="sm" variant="light">
                <IconAlertTriangle size={12} />
              </Badge>
            </Tooltip>
          )}
          {data.isValid && !hasErrors && !hasWarnings && (
            <Badge color="green" size="sm" variant="light">
              <IconCheck size={12} />
            </Badge>
          )}
          
          {/* 드래그 핸들 */}
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            style={{ cursor: 'grab' }}
          >
            <IconGripVertical size={12} />
          </ActionIcon>
        </Group>
      </Group>

      {/* 노드 설명 */}
      {data.description && (
        <Text size="xs" c="dimmed" mb="xs">
          {data.description}
        </Text>
      )}

      {/* 필터 정보 표시 */}
      <Group justify="space-between" mt="xs">
        <Group gap="xs">
          {/* 필터 개수 */}
          <Badge color="blue" size="xs" variant="outline">
            {data.filters?.length || 0} filters
          </Badge>
          
          {/* 연산자 */}
          {data.operator && (
            <Badge color="gray" size="xs" variant="light">
              {data.operator}
            </Badge>
          )}
        </Group>
        
        {/* 필터링 결과 */}
        {data.filteredCount !== undefined && data.totalCount !== undefined && (
          <Text size="xs" c="dimmed">
            {data.filteredCount.toLocaleString()} / {data.totalCount.toLocaleString()}
          </Text>
        )}
      </Group>
      
      {/* 필터 규칙 미리보기 */}
      {data.filters && data.filters.length > 0 && (
        <Group mt="xs">
          <Text size="xs" c="dimmed" truncate>
            {data.filters.slice(0, 2).map(filter => 
              `${filter.field} ${filter.operator} ${filter.value}`
            ).join(` ${data.operator} `)}
            {data.filters.length > 2 && '...'}
          </Text>
        </Group>
      )}
    </Card>
  );
};

export default FilterNode; 