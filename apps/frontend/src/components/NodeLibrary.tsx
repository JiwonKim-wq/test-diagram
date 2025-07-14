import React from 'react';
import { Stack, Text, Card, Group, ThemeIcon } from '@mantine/core';
import { IconDatabase, IconFilter, IconArrowsUpDown, IconFileExport } from '@tabler/icons-react';

interface NodeType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

const nodeTypes: NodeType[] = [
  {
    id: 'database-mysql',
    label: 'MySQL 연결',
    icon: <IconDatabase size={20} />,
    description: 'MySQL 데이터베이스에 연결',
    category: '데이터 소스'
  },
  {
    id: 'database-logpresso',
    label: 'Logpresso 연결',
    icon: <IconDatabase size={20} />,
    description: 'Logpresso에 연결',
    category: '데이터 소스'
  },
  {
    id: 'filter-data',
    label: '데이터 필터링',
    icon: <IconFilter size={20} />,
    description: '조건에 따라 데이터 필터링',
    category: '데이터 처리'
  },
  {
    id: 'transform-data',
    label: '데이터 변환',
    icon: <IconArrowsUpDown size={20} />,
    description: '데이터 형식 변환',
    category: '데이터 처리'
  },
  {
    id: 'export-csv',
    label: 'CSV 내보내기',
    icon: <IconFileExport size={20} />,
    description: 'CSV 파일로 내보내기',
    category: '출력'
  },
];

export const NodeLibrary: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const groupedNodes = nodeTypes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, NodeType[]>);

  return (
    <Stack gap="md">
      <Text size="lg" fw={600}>
        노드 라이브러리
      </Text>
      
      {Object.entries(groupedNodes).map(([category, nodes]) => (
        <div key={category}>
          <Text size="sm" fw={500} c="dimmed" mb="xs">
            {category}
          </Text>
          <Stack gap="xs">
            {nodes.map((node) => (
              <Card
                key={node.id}
                padding="xs"
                withBorder
                style={{ cursor: 'grab' }}
                draggable
                onDragStart={(event) => onDragStart(event, node.id)}
              >
                <Group gap="xs">
                  <ThemeIcon size="sm" variant="light">
                    {node.icon}
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      {node.label}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {node.description}
                    </Text>
                  </div>
                </Group>
              </Card>
            ))}
          </Stack>
        </div>
      ))}
    </Stack>
  );
}; 