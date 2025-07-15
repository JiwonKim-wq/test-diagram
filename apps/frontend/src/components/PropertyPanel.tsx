import React, { useState } from 'react';
import { 
  Stack, 
  Text, 
  Tabs, 
  Card,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Alert,
  ScrollArea,
  Badge,
  Divider
} from '@mantine/core';
import { 
  IconSettings, 
  IconCode, 
  IconTable,
  IconInfoCircle,
  IconDatabase,
  IconFilter,
  IconChartBar
} from '@tabler/icons-react';

interface PropertyPanelProps {
  selectedNode?: {
    id: string;
    type: string;
    data: any;
  };
}

const DatabaseNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  const [connectionData, setConnectionData] = useState({
    host: nodeData?.host || '',
    port: nodeData?.port || '3306',
    database: nodeData?.database || '',
    username: nodeData?.username || '',
    password: nodeData?.password || '',
    query: nodeData?.query || 'SELECT * FROM users LIMIT 10'
  });

  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="blue">
        데이터베이스 연결 설정
      </Text>
      
      <Select
        label="데이터베이스 타입"
        placeholder="선택하세요"
        data={[
          { value: 'mysql', label: 'MySQL' },
          { value: 'logpresso', label: 'Logpresso' }
        ]}
        value={nodeData?.dbType || 'mysql'}
      />

      <TextInput
        label="호스트"
        placeholder="localhost"
        value={connectionData.host}
        onChange={(e) => setConnectionData({...connectionData, host: e.target.value})}
      />

      <TextInput
        label="포트"
        placeholder="3306"
        value={connectionData.port}
        onChange={(e) => setConnectionData({...connectionData, port: e.target.value})}
      />

      <TextInput
        label="데이터베이스명"
        placeholder="database_name"
        value={connectionData.database}
        onChange={(e) => setConnectionData({...connectionData, database: e.target.value})}
      />

      <TextInput
        label="사용자명"
        placeholder="username"
        value={connectionData.username}
        onChange={(e) => setConnectionData({...connectionData, username: e.target.value})}
      />

      <TextInput
        label="비밀번호"
        placeholder="password"
        type="password"
        value={connectionData.password}
        onChange={(e) => setConnectionData({...connectionData, password: e.target.value})}
      />

      <Textarea
        label="쿼리"
        placeholder="SELECT * FROM table_name"
        rows={4}
        value={connectionData.query}
        onChange={(e) => setConnectionData({...connectionData, query: e.target.value})}
      />

      <Group justify="space-between">
        <Button variant="outline" size="sm">
          연결 테스트
        </Button>
        <Button size="sm">
          저장
        </Button>
      </Group>
    </Stack>
  );
};

const FilterNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="green">
        필터링 설정
      </Text>
      
      <Select
        label="필터 타입"
        placeholder="선택하세요"
        data={[
          { value: 'equal', label: '같음 (=)' },
          { value: 'not_equal', label: '다름 (!=)' },
          { value: 'greater', label: '크다 (>)' },
          { value: 'less', label: '작다 (<)' },
          { value: 'like', label: '포함 (LIKE)' },
          { value: 'in', label: '포함 (IN)' }
        ]}
      />

      <TextInput
        label="컬럼명"
        placeholder="column_name"
      />

      <TextInput
        label="조건값"
        placeholder="value"
      />

      <Button size="sm">
        필터 추가
      </Button>
    </Stack>
  );
};

const AggregateNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="orange">
        집계 설정
      </Text>
      
      <Select
        label="집계 함수"
        placeholder="선택하세요"
        data={[
          { value: 'count', label: 'COUNT' },
          { value: 'sum', label: 'SUM' },
          { value: 'avg', label: 'AVG' },
          { value: 'min', label: 'MIN' },
          { value: 'max', label: 'MAX' }
        ]}
      />

      <TextInput
        label="대상 컬럼"
        placeholder="column_name"
      />

      <TextInput
        label="그룹 컬럼"
        placeholder="group_column"
      />

      <Button size="sm">
        집계 추가
      </Button>
    </Stack>
  );
};

const DefaultNodeProperties: React.FC = () => {
  return (
    <Stack gap="md" align="center" justify="center" h={200}>
      <IconSettings size={48} color="gray" />
      <Text size="sm" c="dimmed" ta="center">
        노드를 선택하면 속성을 편집할 수 있습니다
      </Text>
    </Stack>
  );
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedNode }) => {
  const renderNodeProperties = () => {
    if (!selectedNode) {
      return <DefaultNodeProperties />;
    }

    switch (selectedNode.type) {
      case 'mysql-db':
      case 'logpresso-db':
        return <DatabaseNodeProperties nodeData={selectedNode.data} />;
      case 'filter-node':
        return <FilterNodeProperties nodeData={selectedNode.data} />;
      case 'aggregate-node':
        return <AggregateNodeProperties nodeData={selectedNode.data} />;
      default:
        return <DefaultNodeProperties />;
    }
  };

  return (
    <ScrollArea h="100%">
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            속성 패널
          </Text>
          {selectedNode && (
            <Badge variant="light" color="blue">
              {selectedNode.type}
            </Badge>
          )}
        </Group>

        {selectedNode && (
          <Card withBorder padding="sm">
            <Group gap="sm">
              <IconInfoCircle size={16} />
              <Text size="sm" fw={500}>
                {selectedNode.id}
              </Text>
            </Group>
          </Card>
        )}

        <Divider />

        <Tabs defaultValue="properties" variant="outline">
          <Tabs.List grow>
            <Tabs.Tab value="properties" leftSection={<IconSettings size={16} />}>
              속성
            </Tabs.Tab>
            <Tabs.Tab value="preview" leftSection={<IconTable size={16} />}>
              미리보기
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="properties" pt="md">
            {renderNodeProperties()}
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="md">
            <Stack gap="md">
              <Text size="sm" fw={500}>
                데이터 미리보기
              </Text>
              <Alert icon={<IconInfoCircle size={16} />} color="blue">
                노드를 실행하면 결과를 미리볼 수 있습니다
              </Alert>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </ScrollArea>
  );
}; 