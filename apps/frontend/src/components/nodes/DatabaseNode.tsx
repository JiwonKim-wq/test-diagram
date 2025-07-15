import React from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { Group, Text, Badge, Tooltip } from '@mantine/core';
import { IconDatabase, IconPlugConnected, IconPlugConnectedX } from '@tabler/icons-react';
import { DatabaseNodeData, NodeType } from '@diagram/common';
import { BaseNodeComponent } from './BaseNode';

interface DatabaseNodeProps extends NodeProps {
  data: DatabaseNodeData & {
    nodeType: NodeType.DATABASE;
    isValid?: boolean;
    errors?: string[];
    warnings?: string[];
    isConnected?: boolean;
    rowCount?: number;
  };
  onDelete?: (nodeId: string) => void;
}

export const DatabaseNode: React.FC<DatabaseNodeProps> = (props) => {
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
    hasInputs: false,
    hasOutputs: true,
  };

  return (
    <div>
      <BaseNodeComponent
        {...restProps}
        data={baseNodeData}
        onDelete={handleDelete}
      />
      
      {/* 데이터베이스 특화 정보 표시 */}
      <div style={{ position: 'absolute', bottom: 4, left: 8, right: 8 }}>
        <Group justify="space-between" gap="xs">
          {/* 연결 상태 */}
          <Group gap="xs">
            <Tooltip label={data.isConnected ? '연결됨' : '연결 안됨'}>
              {data.isConnected ? (
                <IconPlugConnected size={12} color="#40c057" />
              ) : (
                <IconPlugConnectedX size={12} color="#fa5252" />
              )}
            </Tooltip>
            {data.queryType && (
              <Badge size="xs" variant="outline" color="blue">
                {data.queryType.toUpperCase()}
              </Badge>
            )}
          </Group>
          
          {/* 행 개수 */}
          {data.rowCount !== undefined && (
            <Text size="xs" c="dimmed">
              {data.rowCount.toLocaleString()} rows
            </Text>
          )}
          
          {/* 호스트 정보 */}
          {data.connectionConfig?.host && (
            <Text size="xs" c="dimmed" style={{ fontSize: '10px' }}>
              {data.connectionConfig.host}:{data.connectionConfig.port}
            </Text>
          )}
        </Group>
        
        {/* 쿼리 미리보기 */}
        {data.query && (
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
            {data.query}
          </Text>
        )}
      </div>
    </div>
  );
};

export default DatabaseNode; 