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
  IconGitMerge,
  IconCode,
  IconFileText,
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
    icon: <IconFileText size={18} />,
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
    icon: <IconGitMerge size={18} />,
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
    icon: <IconTable size={18} />,
    description: '결과를 테이블로 출력합니다',
    category: NodeCategory.OUTPUT,
    color: '#c2255c'
  }
];

const NodeLibraryItem: React.FC<{ template: NodeTemplate }> = ({ template }) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      nodeType: template.nodeType,
      label: template.label,
      description: template.description,
      color: template.color
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card 
      shadow="sm" 
      padding="sm" 
      radius="md"
      withBorder
      style={{ 
        cursor: 'grab',
        borderColor: template.color + '20',
        backgroundColor: template.color + '05'
      }}
      draggable
      onDragStart={handleDragStart}
    >
      <Group gap="sm">
        <ThemeIcon 
          variant="light" 
          size="md"
          color={template.color}
        >
          {template.icon}
        </ThemeIcon>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {template.label}
          </Text>
          <Text size="xs" c="dimmed">
            {template.description}
          </Text>
        </div>
      </Group>
    </Card>
  );
};

export const NodeLibrary: React.FC = () => {
  const dataSourceNodes = nodeTemplates.filter(template => template.category === NodeCategory.DATA_SOURCE);
  const processingNodes = nodeTemplates.filter(template => template.category === NodeCategory.PROCESSING);
  const outputNodes = nodeTemplates.filter(template => template.category === NodeCategory.OUTPUT);
  const customNodes = nodeTemplates.filter(template => template.category === NodeCategory.CUSTOM);

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
            {dataSourceNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} />
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
            {processingNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} />
            ))}
          </Stack>
        </div>

        <Divider />

        {/* 사용자 정의 노드 */}
        <div>
          <Text size="sm" fw={500} mb="xs" c="violet">
            사용자 정의
          </Text>
          <Stack gap="xs">
            {customNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} />
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
            {outputNodes.map(template => (
              <NodeLibraryItem key={template.id} template={template} />
            ))}
          </Stack>
        </div>
      </Stack>
    </ScrollArea>
  );
}; 