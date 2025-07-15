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
import { Node } from 'reactflow';
import { NodeType } from '@diagram/common';

interface PropertyPanelProps {
  selectedNode?: Node | null;
}

const DatabaseNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  const [connectionData, setConnectionData] = useState({
    host: nodeData?.connectionConfig?.host || '',
    port: nodeData?.connectionConfig?.port?.toString() || '3306',
    database: nodeData?.connectionConfig?.database || '',
    username: nodeData?.connectionConfig?.username || '',
    password: nodeData?.connectionConfig?.password || '',
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
        value={nodeData?.nodeType === NodeType.LOGPRESSO ? 'logpresso' : 'mysql'}
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
        label="필터 연산자"
        placeholder="선택하세요"
        data={[
          { value: 'AND', label: 'AND (모든 조건)' },
          { value: 'OR', label: 'OR (하나 이상)' }
        ]}
        value={nodeData?.operator || 'AND'}
      />

      <Text size="sm" fw={500}>
        필터 조건
      </Text>

      {nodeData?.filters?.length > 0 ? (
        nodeData.filters.map((filter: any, index: number) => (
          <Card key={filter.id || index} padding="sm" withBorder>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={500}>필터 {index + 1}</Text>
                <Badge color={filter.enabled ? 'green' : 'gray'}>
                  {filter.enabled ? '활성' : '비활성'}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                {filter.field} {filter.operator} {filter.value}
              </Text>
            </Stack>
          </Card>
        ))
      ) : (
        <Alert icon={<IconInfoCircle size={16} />} color="blue">
          필터 조건이 없습니다. 새로운 필터를 추가해보세요.
        </Alert>
      )}

      <Button size="sm" variant="outline">
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
      
      <Alert icon={<IconInfoCircle size={16} />} color="blue">
        집계 기능은 개발 중입니다.
      </Alert>

      <Button size="sm" variant="outline">
        집계 규칙 추가
      </Button>
    </Stack>
  );
};

const TransformNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="purple">
        변환 설정
      </Text>
      
      <Alert icon={<IconInfoCircle size={16} />} color="blue">
        변환 기능은 개발 중입니다.
      </Alert>

      <Button size="sm" variant="outline">
        변환 규칙 추가
      </Button>
    </Stack>
  );
};

const JoinNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="teal">
        조인 설정
      </Text>
      
      <Select
        label="조인 타입"
        placeholder="선택하세요"
        data={[
          { value: 'INNER', label: 'INNER JOIN' },
          { value: 'LEFT', label: 'LEFT JOIN' },
          { value: 'RIGHT', label: 'RIGHT JOIN' },
          { value: 'FULL', label: 'FULL JOIN' }
        ]}
        value={nodeData?.joinType || 'INNER'}
      />

      <TextInput
        label="왼쪽 키"
        placeholder="left_key"
        value={nodeData?.leftKey || ''}
      />

      <TextInput
        label="오른쪽 키"
        placeholder="right_key"
        value={nodeData?.rightKey || ''}
      />

      <Button size="sm">
        저장
      </Button>
    </Stack>
  );
};

const PythonNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="indigo">
        Python 스크립트 설정
      </Text>
      
      <Textarea
        label="Python 코드"
        placeholder="# Python 코드를 입력하세요"
        rows={8}
        value={nodeData?.code || '# Python 코드를 입력하세요\n'}
        style={{ fontFamily: 'monospace' }}
      />

      <Button size="sm">
        코드 실행
      </Button>
    </Stack>
  );
};

const OutputNodeProperties: React.FC<{ nodeData: any }> = ({ nodeData }) => {
  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="pink">
        출력 설정
      </Text>
      
      <Select
        label="출력 타입"
        placeholder="선택하세요"
        data={[
          { value: 'table', label: '테이블' },
          { value: 'chart', label: '차트' },
          { value: 'file', label: '파일' }
        ]}
        value={nodeData?.outputType || 'table'}
      />

      <Select
        label="출력 형식"
        placeholder="선택하세요"
        data={[
          { value: 'json', label: 'JSON' },
          { value: 'csv', label: 'CSV' },
          { value: 'xlsx', label: 'Excel' }
        ]}
        value={nodeData?.format || 'json'}
      />

      <Button size="sm">
        저장
      </Button>
    </Stack>
  );
};

const renderNodeProperties = (nodeType: NodeType, nodeData: any) => {
  switch (nodeType) {
    case NodeType.DATABASE:
    case NodeType.LOGPRESSO:
      return <DatabaseNodeProperties nodeData={nodeData} />;
    case NodeType.FILTER:
      return <FilterNodeProperties nodeData={nodeData} />;
    case NodeType.AGGREGATE:
      return <AggregateNodeProperties nodeData={nodeData} />;
    case NodeType.TRANSFORM:
      return <TransformNodeProperties nodeData={nodeData} />;
    case NodeType.JOIN:
      return <JoinNodeProperties nodeData={nodeData} />;
    case NodeType.PYTHON:
      return <PythonNodeProperties nodeData={nodeData} />;
    case NodeType.OUTPUT:
      return <OutputNodeProperties nodeData={nodeData} />;
    default:
      return (
        <Alert icon={<IconInfoCircle size={16} />} color="gray">
          알 수 없는 노드 타입입니다.
        </Alert>
      );
  }
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <Stack gap="md">
        <Text size="lg" fw={500}>
          속성 패널
        </Text>
        <Alert icon={<IconInfoCircle size={16} />} color="blue">
          노드를 선택하면 속성을 편집할 수 있습니다.
        </Alert>
      </Stack>
    );
  }

  return (
    <ScrollArea style={{ height: 'calc(100vh - 120px)' }}>
      <Stack gap="md">
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="lg" fw={500}>
              속성 패널
            </Text>
            <Badge color="blue" variant="light">
              {selectedNode.type}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            {selectedNode.data?.label || '이름 없음'}
          </Text>
        </div>

        <Divider />

        <Tabs defaultValue="properties" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="properties" leftSection={<IconSettings size={16} />}>
              속성
            </Tabs.Tab>
            <Tabs.Tab value="info" leftSection={<IconInfoCircle size={16} />}>
              정보
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="properties" pt="md">
            {renderNodeProperties(selectedNode.type as NodeType, selectedNode.data)}
          </Tabs.Panel>

          <Tabs.Panel value="info" pt="md">
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} mb="xs">노드 정보</Text>
                <Card padding="sm" withBorder>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">ID</Text>
                      <Text size="xs" style={{ fontFamily: 'monospace' }}>
                        {selectedNode.id}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">타입</Text>
                      <Text size="xs">{selectedNode.type}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">위치</Text>
                      <Text size="xs" style={{ fontFamily: 'monospace' }}>
                        ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">유효성</Text>
                      <Badge 
                        color={selectedNode.data?.isValid ? 'green' : 'red'} 
                        size="xs"
                      >
                        {selectedNode.data?.isValid ? '유효' : '무효'}
                      </Badge>
                    </Group>
                  </Stack>
                </Card>
              </div>

              {selectedNode.data?.description && (
                <div>
                  <Text size="sm" fw={500} mb="xs">설명</Text>
                  <Text size="sm" c="dimmed">
                    {selectedNode.data.description}
                  </Text>
                </div>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </ScrollArea>
  );
}; 