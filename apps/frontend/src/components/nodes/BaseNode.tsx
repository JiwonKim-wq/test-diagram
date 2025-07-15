import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, Group, Text, ActionIcon, Badge, Tooltip } from '@mantine/core';
import { IconGripVertical, IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';
import { BaseNode as BaseNodeType, NodeType } from '@diagram/common';

interface BaseNodeProps extends NodeProps {
  data: BaseNodeType['data'] & {
    nodeType: NodeType;
    hasInputs?: boolean;
    hasOutputs?: boolean;
    isValid?: boolean;
    errors?: string[];
    warnings?: string[];
  };
  onDelete?: (nodeId: string) => void;
}

const NodeTypeColors = {
  [NodeType.DATABASE]: '#1971c2',
  [NodeType.FILTER]: '#f76707',
  [NodeType.AGGREGATE]: '#7c2d12',
  [NodeType.TRANSFORM]: '#5f3dc4',
  [NodeType.JOIN]: '#2f9e44',
  [NodeType.OUTPUT]: '#c2255c',
  [NodeType.PYTHON]: '#3b82f6',
  [NodeType.LOGPRESSO]: '#0c8599'
};

const NodeTypeIcons = {
  [NodeType.DATABASE]: '🗄️',
  [NodeType.FILTER]: '🔍',
  [NodeType.AGGREGATE]: '📊',
  [NodeType.TRANSFORM]: '🔄',
  [NodeType.JOIN]: '🔗',
  [NodeType.OUTPUT]: '📤',
  [NodeType.PYTHON]: '🐍',
  [NodeType.LOGPRESSO]: '📋'
};

export const BaseNodeComponent: React.FC<BaseNodeProps> = ({ 
  data, 
  selected, 
  dragging,
  onDelete,
  id
}) => {
  const nodeColor = NodeTypeColors[data.nodeType] || '#868e96';
  const nodeIcon = NodeTypeIcons[data.nodeType] || '⚙️';
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
      {data.hasInputs && (
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
      )}

      {/* 노드 헤더 */}
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Text size="lg">{nodeIcon}</Text>
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
          
          {/* 삭제 버튼 */}
          {onDelete && (
            <Tooltip label="노드 삭제">
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <IconX size={12} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>

      {/* 노드 설명 */}
      {data.description && (
        <Text size="xs" c="dimmed" mb="xs">
          {data.description}
        </Text>
      )}

      {/* 출력 핸들 */}
      {data.hasOutputs && (
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
      )}
    </Card>
  );
};

export default BaseNodeComponent; 