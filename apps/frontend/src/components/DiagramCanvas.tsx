import React, { useCallback, useRef, useEffect, useState } from 'react';
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
  useReactFlow,
  ReactFlowProvider,
  Node,
  NodeMouseHandler,
} from 'reactflow';
import { NodeType } from '@diagram/common';
import { nodeTypes } from './nodes';

import 'reactflow/dist/style.css';

// 노드 ID 생성 유틸리티
let nodeId = 0;
const generateNodeId = () => `node_${++nodeId}`;

// 노드 타입별 기본 데이터 생성
const createNodeData = (nodeType: NodeType, label: string, description: string) => {
  const baseData = {
    label,
    description,
    nodeType,
    isValid: false,
  };

  switch (nodeType) {
    case NodeType.DATABASE:
      return {
        ...baseData,
        queryType: 'select' as const,
        isConnected: false,
        rowCount: 0,
        connectionConfig: {
          host: '',
          port: 3306,
          database: '',
          username: '',
          password: ''
        },
        query: '',
      };
    
    case NodeType.LOGPRESSO:
      return {
        ...baseData,
        isConnected: false,
        rowCount: 0,
        connectionConfig: {
          host: '',
          port: 8080,
          username: '',
          password: ''
        },
        query: '',
      };
    
    case NodeType.FILTER:
      return {
        ...baseData,
        operator: 'AND' as const,
        filters: [],
      };
    
    case NodeType.AGGREGATE:
      return {
        ...baseData,
        groupBy: [],
        aggregations: [],
      };
    
    case NodeType.TRANSFORM:
      return {
        ...baseData,
        transformations: [],
      };
    
    case NodeType.JOIN:
      return {
        ...baseData,
        joinType: 'INNER' as const,
        leftKey: '',
        rightKey: '',
      };
    
    case NodeType.PYTHON:
      return {
        ...baseData,
        code: '# Python 코드를 입력하세요\n',
        dependencies: [],
      };
    
    case NodeType.OUTPUT:
      return {
        ...baseData,
        outputType: 'table' as const,
        format: 'json',
        options: {},
      };
    
    default:
      return baseData;
  }
};

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

interface DiagramCanvasProps {
  onNodeSelect?: (node: Node | null) => void;
  onNodeAdd?: (addNodeFn: (nodeType: NodeType, position?: { x: number; y: number }) => void, updateNodeFn: (nodeId: string, updates: any) => void) => void;
}

const DiagramCanvasInner: React.FC<DiagramCanvasProps> = ({ onNodeSelect, onNodeAdd }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  // 노드 업데이트 함수
  const updateNode = useCallback((nodeId: string, updates: any) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updates
          }
        };
      }
      return node;
    }));
  }, [setNodes]);

  // 노드 추가 함수 (더블클릭용)
  const addNodeToCanvas = useCallback((nodeType: NodeType, position?: { x: number; y: number }) => {
    const nodeTemplates = {
      [NodeType.DATABASE]: { label: 'MySQL 데이터베이스', description: 'MySQL 데이터베이스에서 데이터를 조회합니다' },
      [NodeType.LOGPRESSO]: { label: 'Logpresso', description: 'Logpresso에서 로그 데이터를 조회합니다' },
      [NodeType.FILTER]: { label: '데이터 필터링', description: '조건에 따라 데이터를 필터링합니다' },
      [NodeType.AGGREGATE]: { label: '데이터 집계', description: '데이터를 그룹화하고 집계합니다' },
      [NodeType.TRANSFORM]: { label: '데이터 변환', description: '데이터 형식을 변환합니다' },
      [NodeType.JOIN]: { label: '데이터 조인', description: '두 데이터셋을 조인합니다' },
      [NodeType.PYTHON]: { label: 'Python 스크립트', description: 'Python 코드를 실행합니다' },
      [NodeType.OUTPUT]: { label: '결과 출력', description: '결과를 테이블로 출력합니다' },
    };

    const template = nodeTemplates[nodeType];
    const newPosition = position || { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 };
    
    const nodeId = generateNodeId();
    const newNode = {
      id: nodeId,
      type: nodeType,
      position: newPosition,
      data: createNodeData(nodeType, template.label, template.description),
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // onNodeAdd prop을 통해 노드 추가 및 업데이트 함수 전달
  React.useEffect(() => {
    if (onNodeAdd) {
      onNodeAdd(addNodeToCanvas as any, updateNode);
    }
  }, [onNodeAdd, addNodeToCanvas, updateNode]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 노드 삭제 함수
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      onNodeSelect?.(null);
    }
  }, [setNodes, setEdges, selectedNodeId, onNodeSelect]);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  }, [selectedNodeId, deleteNode]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        event.preventDefault();
        deleteSelectedNode();
      }
    };

    // 브라우저 전체에 키보드 이벤트 리스너 추가
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteSelectedNode]);

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // 크롬 호환성을 위한 추가 처리
    if (event.dataTransfer.types.includes('application/reactflow')) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) {
        console.warn('React Flow bounds not found');
        return;
      }

      // 여러 데이터 타입 시도
      let nodeData = event.dataTransfer.getData('application/reactflow');
      if (!nodeData) {
        // 대체 방법 시도
        nodeData = event.dataTransfer.getData('text/plain');
        if (!nodeData) {
          console.warn('No drag data found');
          return;
        }
      }

      try {
        let parsedData;
        try {
          parsedData = JSON.parse(nodeData);
        } catch {
          // JSON 파싱 실패 시 기본값 사용
          console.warn('Failed to parse drag data, using fallback');
          parsedData = {
            nodeType: 'database',
            label: '새 노드',
            description: '드래그된 노드'
          };
        }

        const { nodeType, label, description } = parsedData;
        
        // 정확한 위치 계산
        const position = project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
          id: generateNodeId(),
          type: nodeType,
          position,
          data: createNodeData(nodeType, label, description),
        };

        console.log('새 노드 추가:', newNode);
        setNodes((nds) => nds.concat(newNode));
        
        // 드롭 성공 피드백 (선택사항)
        if (reactFlowWrapper.current) {
          reactFlowWrapper.current.style.backgroundColor = '#e3f2fd';
          setTimeout(() => {
            if (reactFlowWrapper.current) {
              reactFlowWrapper.current.style.backgroundColor = '';
            }
          }, 200);
        }
      } catch (error) {
        console.error('드롭 이벤트 처리 중 오류:', error);
      }
    },
    [project, setNodes]
  );

  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // 드래그 진입 시 시각적 피드백
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.style.backgroundColor = '#f3e5f5';
    }
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // 드래그가 영역을 벗어날 때 피드백 제거
    if (reactFlowWrapper.current && event.relatedTarget && 
        !reactFlowWrapper.current.contains(event.relatedTarget as Element)) {
      reactFlowWrapper.current.style.backgroundColor = '';
    }
  }, []);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 120px)' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
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

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ onNodeSelect, onNodeAdd }) => {
  return (
    <ReactFlowProvider>
      <DiagramCanvasInner onNodeSelect={onNodeSelect} onNodeAdd={onNodeAdd} />
    </ReactFlowProvider>
  );
}; 