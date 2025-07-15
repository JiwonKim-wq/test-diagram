import React from 'react';
import { 
  Stack, 
  Text, 
  Card, 
  Group, 
  ThemeIcon,
  ScrollArea,
  Divider 
} from '@mantine/core';
import { 
  IconDatabase, 
  IconFilter, 
  IconChartBar, 
  IconTable,
  IconTransform,
  IconOutput
} from '@tabler/icons-react';

interface NodeType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

const nodeTypes: NodeType[] = [
  {
    id: 'mysql-db',
    label: 'MySQL 데이터베이스',
    icon: <IconDatabase size={18} />,
    description: 'MySQL 데이터베이스 연결',
    category: 'data-source'
  },
  {
    id: 'logpresso-db',
    label: 'Logpresso',
    icon: <IconDatabase size={18} />,
    description: 'Logpresso 로그 데이터 연결',
    category: 'data-source'
  },
  {
    id: 'filter-node',
    label: '데이터 필터링',
    icon: <IconFilter size={18} />,
    description: '조건에 따른 데이터 필터링',
    category: 'processing'
  },
  {
    id: 'aggregate-node',
    label: '데이터 집계',
    icon: <IconChartBar size={18} />,
    description: '데이터 그룹화 및 집계',
    category: 'processing'
  },
  {
    id: 'transform-node',
    label: '데이터 변환',
    icon: <IconTransform size={18} />,
    description: '데이터 형식 변환',
    category: 'processing'
  },
  {
    id: 'table-output',
    label: '테이블 출력',
    icon: <IconTable size={18} />,
    description: '결과를 테이블로 출력',
    category: 'output'
  }
];

const NodeLibraryItem: React.FC<{ node: NodeType }> = ({ node }) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', node.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card 
      shadow="sm" 
      padding="sm" 
      radius="md"
      withBorder
      style={{ cursor: 'grab' }}
      draggable
      onDragStart={handleDragStart}
    >
      <Group gap="sm">
        <ThemeIcon variant="light" size="md">
          {node.icon}
        </ThemeIcon>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {node.label}
          </Text>
          <Text size="xs" c="dimmed">
            {node.description}
          </Text>
        </div>
      </Group>
    </Card>
  );
};

export const NodeLibrary: React.FC = () => {
  const dataSourceNodes = nodeTypes.filter(node => node.category === 'data-source');
  const processingNodes = nodeTypes.filter(node => node.category === 'processing');
  const outputNodes = nodeTypes.filter(node => node.category === 'output');

  return (
    <ScrollArea h="100%">
      <Stack gap="md">
        <Text size="lg" fw={600}>
          노드 라이브러리
        </Text>
        
        {/* 데이터 소스 노드 */}
        <div>
          <Text size="sm" fw={500} mb="xs" c="blue">
            데이터 소스
          </Text>
          <Stack gap="xs">
            {dataSourceNodes.map(node => (
              <NodeLibraryItem key={node.id} node={node} />
            ))}
          </Stack>
        </div>

        <Divider />

        {/* 데이터 처리 노드 */}
        <div>
          <Text size="sm" fw={500} mb="xs" c="green">
            데이터 처리
          </Text>
          <Stack gap="xs">
            {processingNodes.map(node => (
              <NodeLibraryItem key={node.id} node={node} />
            ))}
          </Stack>
        </div>

        <Divider />

        {/* 출력 노드 */}
        <div>
          <Text size="sm" fw={500} mb="xs" c="orange">
            출력
          </Text>
          <Stack gap="xs">
            {outputNodes.map(node => (
              <NodeLibraryItem key={node.id} node={node} />
            ))}
          </Stack>
        </div>
      </Stack>
    </ScrollArea>
  );
}; 