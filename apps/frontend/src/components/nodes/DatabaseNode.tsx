import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, Group, Text, Badge, Tooltip, ActionIcon } from '@mantine/core';
import { IconDatabase, IconPlugConnected, IconPlugConnectedX, IconGripVertical, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { DatabaseNodeData, NodeType } from '@diagram/common';

interface DatabaseNodeProps extends NodeProps {
  data: DatabaseNodeData & {
    nodeType: NodeType.DATABASE;
    isValid?: boolean;
    errors?: string[];
    warnings?: string[];
    isConnected?: boolean;
    rowCount?: number;
  };
}

export const DatabaseNode: React.FC<DatabaseNodeProps> = ({ 
  data, 
  selected, 
  dragging 
}) => {
  const nodeColor = '#1971c2';
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
          <IconDatabase size={16} color={nodeColor} />
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

      {/* 추가 정보 표시 */}
      <Group justify="space-between" mt="xs">
        <Group gap="xs">
          {/* 연결 상태 */}
          {data.isConnected ? (
            <Tooltip label="연결됨">
              <Badge color="green" size="xs" variant="light">
                <IconPlugConnected size={10} />
              </Badge>
            </Tooltip>
          ) : (
            <Tooltip label="연결 안됨">
              <Badge color="red" size="xs" variant="light">
                <IconPlugConnectedX size={10} />
              </Badge>
            </Tooltip>
          )}
          
          {/* 쿼리 타입 */}
          {data.queryType && (
            <Badge color="blue" size="xs" variant="outline">
              {data.queryType.toUpperCase()}
            </Badge>
          )}
        </Group>
        
        {/* 행 수 표시 */}
        {data.rowCount !== undefined && (
          <Text size="xs" c="dimmed">
            {data.rowCount.toLocaleString()} rows
          </Text>
        )}
      </Group>
      
      {/* 연결 정보 */}
      {data.connectionConfig && (
        <Group mt="xs">
          <Text size="xs" c="dimmed">
            {data.connectionConfig.host}:{data.connectionConfig.port}
          </Text>
        </Group>
      )}
      
      {/* 쿼리 미리보기 */}
      {data.query && (
        <Tooltip label={data.query}>
          <Text size="xs" c="dimmed" truncate mt="xs">
            {data.query}
          </Text>
        </Tooltip>
      )}
    </Card>
  );
};

export default DatabaseNode; 