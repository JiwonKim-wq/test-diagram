import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
} from 'reactflow';
import { NodeType } from '@diagram/common';
import { nodeTypes } from './nodes';

import 'reactflow/dist/style.css';

const initialNodes: any[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { 
      label: 'MySQL 데이터베이스',
      description: '사용자 데이터를 조회합니다',
      nodeType: NodeType.DATABASE,
      queryType: 'select' as const,
      isConnected: true,
      rowCount: 1250,
      connectionConfig: {
        host: 'localhost',
        port: 3306,
        database: 'userdb',
        username: 'admin',
        password: ''
      },
      query: 'SELECT * FROM users WHERE active = 1',
      isValid: true
    },
    type: NodeType.DATABASE,
  },
  {
    id: '2',
    position: { x: 400, y: 100 },
    data: { 
      label: '사용자 필터',
      description: '활성 사용자만 필터링합니다',
      nodeType: NodeType.FILTER,
      operator: 'AND' as const,
      filters: [
        {
          id: 'f1',
          field: 'status',
          operator: 'equals' as any,
          value: 'active',
          dataType: 'string' as const,
          enabled: true
        },
        {
          id: 'f2',
          field: 'created_at',
          operator: 'greaterThan' as any,
          value: '2023-01-01',
          dataType: 'date' as const,
          enabled: true
        }
      ],
      filteredCount: 890,
      totalCount: 1250,
      isValid: true
    },
    type: NodeType.FILTER,
  },
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    animated: true,
    style: { stroke: '#1971c2' }
  },
];

export const DiagramCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}; 