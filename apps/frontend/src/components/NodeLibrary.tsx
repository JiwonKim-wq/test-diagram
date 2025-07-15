import React, { useState } from 'react';
import {
  Card,
  Group,
  Text,
  Stack,
  ThemeIcon,
  Divider,
  ScrollArea,
  Badge,
  Box,
} from '@mantine/core';
import {
  IconDatabase,
  IconFilter,
  IconChartBar,
  IconTransform,
  IconGitBranch,
  IconCode,
  IconFileExport,
  IconCloud
} from '@tabler/icons-react';
import { NodeType, NodeCategory } from '@diagram/common';

interface NodeTemplate {
  id: string;
  nodeType: NodeType;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: NodeCategory;
  color: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    id: 'mysql-database',
    nodeType: NodeType.DATABASE,
    label: 'MySQL 데이터베이스',
    icon: <IconDatabase size={18} />,
    description: 'MySQL 데이터베이스에서 데이터를 조회합니다',
    category: NodeCategory.DATA_SOURCE,
    color: '#1971c2'
  },
  {
    id: 'logpresso-database',
    nodeType: NodeType.LOGPRESSO,
    label: 'Logpresso',
    icon: <IconFileExport size={18} />,
    description: 'Logpresso에서 로그 데이터를 조회합니다',
    category: NodeCategory.DATA_SOURCE,
    color: '#0c8599'
  },
  {
    id: 'filter-node',
    nodeType: NodeType.FILTER,
    label: '데이터 필터링',
    icon: <IconFilter size={18} />,
    description: '조건에 따라 데이터를 필터링합니다',
    category: NodeCategory.PROCESSING,
    color: '#f76707'
  },
  {
    id: 'aggregate-node',
    nodeType: NodeType.AGGREGATE,
    label: '데이터 집계',
    icon: <IconChartBar size={18} />,
    description: '데이터를 그룹화하고 집계합니다',
    category: NodeCategory.PROCESSING,
    color: '#7c2d12'
  },
  {
    id: 'transform-node',
    nodeType: NodeType.TRANSFORM,
    label: '데이터 변환',
    icon: <IconTransform size={18} />,
    description: '데이터 형식을 변환합니다',
    category: NodeCategory.PROCESSING,
    color: '#5f3dc4'
  },
  {
    id: 'join-node',
    nodeType: NodeType.JOIN,
    label: '데이터 조인',
    icon: <IconGitBranch size={18} />,
    description: '두 데이터셋을 조인합니다',
    category: NodeCategory.PROCESSING,
    color: '#2f9e44'
  },
  {
    id: 'python-node',
    nodeType: NodeType.PYTHON,
    label: 'Python 스크립트',
    icon: <IconCode size={18} />,
    description: 'Python 코드를 실행합니다',
    category: NodeCategory.CUSTOM,
    color: '#3b82f6'
  },
  {
    id: 'table-output',
    nodeType: NodeType.OUTPUT,
    label: '결과 출력',
    icon: <IconCloud size={18} />,
    description: '결과를 테이블로 출력합니다',
    category: NodeCategory.OUTPUT,
    color: '#c2255c'
  }
];

interface NodeLibraryProps {
  onNodeAdd?: (nodeType: NodeType, position?: { x: number; y: number }) => void;
}

const NodeLibraryItem: React.FC<{ 
  template: NodeTemplate; 
  onNodeAdd?: (nodeType: NodeType, position?: { x: number; y: number }) => void;
}> = ({ template, onNodeAdd }) => {
  const [isDragging, setIsDragging] = useState(false);

  // 더블클릭으로 노드 추가
  const handleDoubleClick = () => {
    if (onNodeAdd) {
      onNodeAdd(template.nodeType);
    }
  };

  const handleDragStart = (event: React.DragEvent) => {
    console.log('드래그 시작:', template.nodeType);
    setIsDragging(true);
    
    // 드래그 데이터 설정
    const dragData = {
      nodeType: template.nodeType,
      label: template.label,
      description: template.description,
      color: template.color
    };
    
    // 여러 형식으로 데이터 설정 (크롬 호환성)
    event.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'copy';
    
    console.log('드래그 데이터 설정 완료:', dragData);
  };

  const handleDragEnd = () => {
    console.log('드래그 종료');
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 마우스 이벤트를 통한 시각적 피드백
    (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
  };

  return (
    <Card 
      shadow="sm" 
      padding="sm" 
      radius="md"
      withBorder
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        borderColor: template.color + '20',
        backgroundColor: template.color + '05',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        position: 'relative'
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Group gap="sm">
        <ThemeIcon 
          variant="light" 
          size="lg" 
          color={template.color}
          style={{ pointerEvents: 'none' }}
        >
          {template.icon}
        </ThemeIcon>
        
        <Box style={{ flex: 1, pointerEvents: 'none' }}>
          <Text fw={500} size="sm" style={{ pointerEvents: 'none' }}>
            {template.label}
          </Text>
          <Text size="xs" c="dimmed" style={{ pointerEvents: 'none' }}>
            {template.description}
          </Text>
          <Text size="xs" c="blue" style={{ pointerEvents: 'none', marginTop: 2 }}>
            드래그하거나 더블클릭하세요
          </Text>
        </Box>
      </Group>
      
      {isDragging && (
        <Badge
          size="xs"
          variant="filled"
          color={template.color}
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            animation: 'pulse 1s infinite'
          }}
        >
          드래그 중
        </Badge>
      )}
    </Card>
  );
};

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ onNodeAdd }) => {
  const dataSourceNodes = nodeTemplates.filter(template => template.category === NodeCategory.DATA_SOURCE);
  const processingNodes = nodeTemplates.filter(template => template.category === NodeCategory.PROCESSING);
  const outputNodes = nodeTemplates.filter(template => template.category === NodeCategory.OUTPUT);
  const customNodes = nodeTemplates.filter(template => template.category === NodeCategory.CUSTOM);

  return (
    <ScrollArea h="100%">
      <Stack gap="md">
        <div>
          <Text size="sm" fw={600} c="dimmed" mb="xs">
            데이터 소스
          </Text>
          <Stack gap="xs">
            {dataSourceNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} onNodeAdd={onNodeAdd} />
            ))}
          </Stack>
        </div>

        <Divider />

        <div>
          <Text size="sm" fw={600} c="dimmed" mb="xs">
            데이터 처리
          </Text>
          <Stack gap="xs">
            {processingNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} onNodeAdd={onNodeAdd} />
            ))}
          </Stack>
        </div>

        <Divider />

        <div>
          <Text size="sm" fw={600} c="dimmed" mb="xs">
            사용자 정의
          </Text>
          <Stack gap="xs">
            {customNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} onNodeAdd={onNodeAdd} />
            ))}
          </Stack>
        </div>

        <Divider />

        <div>
          <Text size="sm" fw={600} c="dimmed" mb="xs">
            출력
          </Text>
          <Stack gap="xs">
            {outputNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} onNodeAdd={onNodeAdd} />
            ))}
          </Stack>
        </div>
      </Stack>
    </ScrollArea>
  );
}; 