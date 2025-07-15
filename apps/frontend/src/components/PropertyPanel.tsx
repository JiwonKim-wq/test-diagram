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
  Divider,
  Loader,
  List,
  ThemeIcon,
  Table,
  Paper,
  Checkbox,
  Modal,
  Pagination,
  Code
} from '@mantine/core';
import { 
  IconSettings, 
  IconCode, 
  IconTable,
  IconInfoCircle,
  IconDatabase,
  IconFilter,
  IconChartBar,
  IconAlertTriangle,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';
import { Node } from 'reactflow';
import { NodeType } from '@diagram/common';
import { useNodeValidation } from '../hooks/useNodeValidation';
import { FilterConfig } from './PropertyPanel/FilterConfig';
import { AggregateConfig } from './PropertyPanel/AggregateConfig';

interface PropertyPanelProps {
  selectedNode?: Node | null;
  onNodeUpdate?: (nodeId: string, updates: any) => void;
}

// 검증 결과 표시 컴포넌트
const ValidationStatus: React.FC<{ node: Node | null }> = ({ node }) => {
  const { validationResult, isValid, errors, warnings, isValidating } = useNodeValidation({
    node: node as any,
    autoValidate: true
  });

  if (!node) return null;

  if (isValidating) {
    return (
      <Alert color="blue" icon={<Loader size={16} />}>
        검증 중...
      </Alert>
    );
  }

  if (isValid && warnings.length === 0) {
    return (
      <Alert color="green" icon={<IconCheck size={16} />}>
        모든 설정이 올바릅니다.
      </Alert>
    );
  }

  return (
    <Stack gap="xs">
      {errors.length > 0 && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          <Text size="sm" fw={500} mb="xs">오류</Text>
          <List size="sm" spacing="xs">
            {errors.map((error, index) => (
              <List.Item key={index}>{error}</List.Item>
            ))}
          </List>
        </Alert>
      )}
      
      {warnings.length > 0 && (
        <Alert color="yellow" icon={<IconAlertTriangle size={16} />}>
          <Text size="sm" fw={500} mb="xs">경고</Text>
          <List size="sm" spacing="xs">
            {warnings.map((warning, index) => (
              <List.Item key={index}>{warning}</List.Item>
            ))}
          </List>
        </Alert>
      )}
    </Stack>
  );
};

const DatabaseNodeProperties: React.FC<{ nodeData: any; onNodeUpdate?: (updates: any) => void }> = ({ nodeData, onNodeUpdate }) => {
  const [connectionData, setConnectionData] = useState({
    host: nodeData?.connectionConfig?.host || '',
    port: nodeData?.connectionConfig?.port?.toString() || '3306',
    database: nodeData?.connectionConfig?.database || '',
    username: nodeData?.connectionConfig?.username || '',
    password: nodeData?.connectionConfig?.password || '',
    query: nodeData?.query || 'SELECT * FROM users LIMIT 10'
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  
  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 연결 데이터 변경 시 노드 업데이트
  const handleConnectionDataChange = (field: string, value: string) => {
    const newConnectionData = { ...connectionData, [field]: value };
    setConnectionData(newConnectionData);
    
    // 노드 데이터 업데이트
    if (onNodeUpdate) {
      const updates: any = {
        connectionConfig: {
          ...connectionData,
          [field]: field === 'port' ? parseInt(value) || 3306 : value
        }
      };
      
      if (field === 'query') {
        updates.query = value;
      }
      
      onNodeUpdate(updates);
    }
  };

  // 연결 테스트 함수
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setConnectionMessage('');

    try {
      const connectionConfig = {
        type: 'mysql',
        host: connectionData.host,
        port: parseInt(connectionData.port),
        database: connectionData.database,
        username: connectionData.username,
        password: connectionData.password
      };

      // 백엔드 API 호출
      const response = await fetch('http://localhost:3001/api/database/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionConfig)
      });

      const result = await response.json();

      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage('✅ 데이터베이스 연결 성공!');
      } else {
        setConnectionStatus('error');
        setConnectionMessage(`❌ ${result.error || '연결 실패'}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage(`❌ ${error instanceof Error ? error.message : '연결 테스트 중 오류 발생'}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // 쿼리 실행 함수
  const handleExecuteQuery = async () => {
    setIsExecutingQuery(true);
    setQueryResult(null);

    try {
      const requestBody = {
        config: {
          type: 'mysql',
          host: connectionData.host,
          port: parseInt(connectionData.port),
          database: connectionData.database,
          username: connectionData.username,
          password: connectionData.password
        },
        query: connectionData.query,
        options: {
          limit: 100
        }
      };

      const response = await fetch('http://localhost:3001/api/database/execute-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success) {
        setQueryResult(result.data);
        setConnectionMessage(`✅ 쿼리 실행 성공! ${result.data.rows?.length || 0}건의 결과`);
        setConnectionStatus('success');
      } else {
        setConnectionMessage(`❌ ${result.error || '쿼리 실행 실패'}`);
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionMessage(`❌ ${error instanceof Error ? error.message : '쿼리 실행 중 오류 발생'}`);
      setConnectionStatus('error');
    } finally {
      setIsExecutingQuery(false);
    }
  };

  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="blue">
        데이터베이스 연결 설정
      </Text>
      
      <TextInput
        label="호스트"
        placeholder="localhost"
        value={connectionData.host}
        onChange={(e) => handleConnectionDataChange('host', e.target.value)}
        error={!connectionData.host ? '호스트 주소가 필요합니다.' : null}
      />

      <TextInput
        label="포트"
        placeholder="3306"
        value={connectionData.port}
        onChange={(e) => handleConnectionDataChange('port', e.target.value)}
        error={!connectionData.port ? '포트 번호가 필요합니다.' : null}
      />

      <TextInput
        label="데이터베이스"
        placeholder="database_name"
        value={connectionData.database}
        onChange={(e) => handleConnectionDataChange('database', e.target.value)}
        error={!connectionData.database ? '데이터베이스 이름이 필요합니다.' : null}
      />

      <TextInput
        label="사용자명"
        placeholder="username"
        value={connectionData.username}
        onChange={(e) => handleConnectionDataChange('username', e.target.value)}
        error={!connectionData.username ? '사용자명이 필요합니다.' : null}
      />

      <TextInput
        label="비밀번호"
        placeholder="password"
        type="password"
        value={connectionData.password}
        onChange={(e) => handleConnectionDataChange('password', e.target.value)}
      />

      <Textarea
        label="SQL 쿼리"
        placeholder="SELECT * FROM table_name"
        value={connectionData.query}
        onChange={(e) => handleConnectionDataChange('query', e.target.value)}
        minRows={3}
        error={!connectionData.query ? '쿼리가 필요합니다.' : null}
      />

      {/* 상태 메시지 */}
      {connectionMessage && (
        <Alert 
          color={connectionStatus === 'success' ? 'green' : connectionStatus === 'error' ? 'red' : 'blue'}
        >
          {connectionMessage}
        </Alert>
      )}

      {/* 버튼 그룹 */}
      <Stack gap="sm">
        <Group justify="space-between">
          <Button 
            variant="outline" 
            size="sm" 
            loading={isTestingConnection}
            onClick={handleTestConnection}
            disabled={!connectionData.host || !connectionData.database || !connectionData.username}
          >
            연결 테스트
          </Button>
          <Button 
            size="sm"
            onClick={() => console.log('저장:', connectionData)}
          >
            저장
          </Button>
        </Group>

        <Button 
          variant="light" 
          color="blue"
          loading={isExecutingQuery}
          onClick={handleExecuteQuery}
          disabled={connectionStatus !== 'success' || !connectionData.query}
        >
          쿼리 실행
        </Button>
      </Stack>

      {/* 쿼리 결과 표시 */}
      {queryResult && (
        <Paper p="md" withBorder>
          <Group justify="space-between" mb="sm">
            <Text size="sm" fw={500}>쿼리 결과</Text>
            <Text size="xs" c="dimmed">더블클릭하여 큰 화면으로 보기</Text>
          </Group>
          {queryResult.rows && queryResult.rows.length > 0 ? (
            <ScrollArea h={200}>
              <Table 
                striped 
                highlightOnHover 
                style={{ cursor: 'pointer' }}
                onDoubleClick={() => setIsModalOpen(true)}
              >
                <Table.Thead>
                  <Table.Tr>
                    {Object.keys(queryResult.rows[0]).map((column) => (
                      <Table.Th key={column}>{column}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {queryResult.rows.slice(0, 10).map((row: any, index: number) => (
                    <Table.Tr key={index}>
                      {Object.values(row).map((value: any, cellIndex: number) => (
                        <Table.Td key={cellIndex}>
                          {value !== null ? String(value) : 'NULL'}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {queryResult.rows.length > 10 && (
                <Text size="xs" c="dimmed" mt="xs">
                  처음 10개 결과만 표시됩니다. 총 {queryResult.rows.length}건
                </Text>
              )}
            </ScrollArea>
          ) : (
            <Text size="sm" c="dimmed">결과가 없습니다.</Text>
          )}
        </Paper>
      )}

      {/* 쿼리 결과 모달 */}
      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentPage(1);
        }}
        size="95%"
        title={
          <Group>
            <IconTable size={20} />
            <Text fw={500}>데이터베이스 쿼리 결과</Text>
            <Badge color="blue">{queryResult?.rows?.length || 0}건</Badge>
          </Group>
        }
      >
        <Stack gap="md">
          {/* 연결 정보 표시 */}
          <Paper p="sm" withBorder>
            <Group>
              <IconDatabase size={16} />
              <Text size="sm" fw={500}>연결 정보:</Text>
              <Code>{connectionData.host}:{connectionData.port}/{connectionData.database}</Code>
            </Group>
          </Paper>

          {/* 실행된 쿼리 표시 */}
          <Paper p="sm" withBorder>
            <Text size="sm" fw={500} mb="xs">실행된 쿼리:</Text>
            <Code block>{connectionData.query}</Code>
          </Paper>

          {/* 전체 쿼리 결과 테이블 */}
          {queryResult?.rows && queryResult.rows.length > 0 ? (
            <>
              <ScrollArea h={400}>
                <Table striped highlightOnHover>
                  <Table.Thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                    <Table.Tr>
                      <Table.Th style={{ width: '50px' }}>#</Table.Th>
                      {Object.keys(queryResult.rows[0]).map((column) => (
                        <Table.Th key={column}>{column}</Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {queryResult.rows
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((row: any, index: number) => (
                        <Table.Tr key={index}>
                          <Table.Td style={{ fontWeight: 500, color: '#666' }}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </Table.Td>
                          {Object.values(row).map((value: any, cellIndex: number) => (
                            <Table.Td key={cellIndex}>
                              {value !== null ? String(value) : <Text c="dimmed" fs="italic">NULL</Text>}
                            </Table.Td>
                          ))}
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {/* 페이지네이션 */}
              {queryResult.rows.length > itemsPerPage && (
                <Group justify="center" mt="md">
                  <Pagination
                    value={currentPage}
                    onChange={setCurrentPage}
                    total={Math.ceil(queryResult.rows.length / itemsPerPage)}
                    size="sm"
                  />
                  <Text size="xs" c="dimmed">
                    {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, queryResult.rows.length)} / {queryResult.rows.length}건
                  </Text>
                </Group>
              )}
            </>
          ) : (
            <Text ta="center" c="dimmed" py="xl">결과가 없습니다.</Text>
          )}
        </Stack>
      </Modal>
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

const AggregateNodeProperties: React.FC<{ nodeData: any; onNodeUpdate?: (updates: any) => void }> = ({ nodeData, onNodeUpdate }) => {
  const [aggregations, setAggregations] = useState(nodeData?.aggregations || []);
  const [groupByFields, setGroupByFields] = useState(nodeData?.groupBy || []);

  const aggregateFunctions = [
    { value: 'count', label: 'COUNT - 개수' },
    { value: 'sum', label: 'SUM - 합계' },
    { value: 'avg', label: 'AVG - 평균' },
    { value: 'min', label: 'MIN - 최솟값' },
    { value: 'max', label: 'MAX - 최댓값' },
    { value: 'first', label: 'FIRST - 첫번째 값' },
    { value: 'last', label: 'LAST - 마지막 값' },
    { value: 'stddev', label: 'STDDEV - 표준편차' },
    { value: 'variance', label: 'VARIANCE - 분산' }
  ];

  const addAggregation = () => {
    const newAggregation = {
      id: `agg_${Date.now()}`,
      field: '',
      function: 'count',
      alias: '',
      distinct: false,
      enabled: true
    };
    const updatedAggregations = [...aggregations, newAggregation];
    setAggregations(updatedAggregations);
    onNodeUpdate?.({ aggregations: updatedAggregations });
  };

  const updateAggregation = (index: number, field: string, value: any) => {
    const updatedAggregations = aggregations.map((agg: any, i: number) => 
      i === index ? { ...agg, [field]: value } : agg
    );
    setAggregations(updatedAggregations);
    onNodeUpdate?.({ aggregations: updatedAggregations });
  };

  const removeAggregation = (index: number) => {
    const updatedAggregations = aggregations.filter((_: any, i: number) => i !== index);
    setAggregations(updatedAggregations);
    onNodeUpdate?.({ aggregations: updatedAggregations });
  };

  const addGroupByField = () => {
    const newField = {
      field: '',
      alias: '',
      enabled: true
    };
    const updatedGroupBy = [...groupByFields, newField];
    setGroupByFields(updatedGroupBy);
    onNodeUpdate?.({ groupBy: updatedGroupBy });
  };

  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="orange">
        집계 설정
      </Text>

      {/* 그룹화 필드 설정 */}
      <div>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>그룹화 필드</Text>
          <Button size="xs" variant="outline" onClick={addGroupByField}>
            필드 추가
          </Button>
        </Group>
        
        {groupByFields.map((field: any, index: number) => (
          <Group key={index} gap="xs" mb="xs">
            <TextInput
              placeholder="필드명"
              size="xs"
              style={{ flex: 1 }}
              value={field.field}
              onChange={(e) => {
                const updatedGroupBy = groupByFields.map((f: any, i: number) => 
                  i === index ? { ...f, field: e.target.value } : f
                );
                setGroupByFields(updatedGroupBy);
                onNodeUpdate?.({ groupBy: updatedGroupBy });
              }}
            />
            <TextInput
              placeholder="별칭 (선택사항)"
              size="xs"
              style={{ flex: 1 }}
              value={field.alias}
              onChange={(e) => {
                const updatedGroupBy = groupByFields.map((f: any, i: number) => 
                  i === index ? { ...f, alias: e.target.value } : f
                );
                setGroupByFields(updatedGroupBy);
                onNodeUpdate?.({ groupBy: updatedGroupBy });
              }}
            />
            <Button 
              size="xs" 
              color="red" 
              variant="outline"
              onClick={() => {
                const updatedGroupBy = groupByFields.filter((_: any, i: number) => i !== index);
                setGroupByFields(updatedGroupBy);
                onNodeUpdate?.({ groupBy: updatedGroupBy });
              }}
            >
              제거
            </Button>
          </Group>
        ))}
      </div>

      {/* 집계 규칙 설정 */}
      <div>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>집계 규칙</Text>
          <Button size="xs" variant="outline" onClick={addAggregation}>
            집계 규칙 추가
          </Button>
        </Group>

        {aggregations.map((agg: any, index: number) => (
          <Card key={agg.id} padding="xs" withBorder mb="xs">
            <Stack gap="xs">
              <Group gap="xs">
                <Select
                  placeholder="집계 함수"
                  size="xs"
                  style={{ flex: 1 }}
                  data={aggregateFunctions}
                  value={agg.function}
                  onChange={(value) => updateAggregation(index, 'function', value)}
                />
                <Button 
                  size="xs" 
                  color="red" 
                  variant="outline"
                  onClick={() => removeAggregation(index)}
                >
                  제거
                </Button>
              </Group>
              
              <TextInput
                placeholder="필드명"
                size="xs"
                value={agg.field}
                onChange={(e) => updateAggregation(index, 'field', e.target.value)}
              />
              
              <TextInput
                placeholder="별칭 (선택사항)"
                size="xs"
                value={agg.alias}
                onChange={(e) => updateAggregation(index, 'alias', e.target.value)}
              />

              <Group gap="xs">
                <Checkbox
                  label="DISTINCT"
                  size="xs"
                  checked={agg.distinct || false}
                  onChange={(e) => updateAggregation(index, 'distinct', e.target.checked)}
                />
                <Checkbox
                  label="활성화"
                  size="xs"
                  checked={agg.enabled !== false}
                  onChange={(e) => updateAggregation(index, 'enabled', e.target.checked)}
                />
              </Group>
            </Stack>
          </Card>
        ))}

        {aggregations.length === 0 && (
          <Text size="xs" c="dimmed" ta="center" py="md">
            집계 규칙을 추가하세요
          </Text>
        )}
      </div>
    </Stack>
  );
};

const TransformNodeProperties: React.FC<{ nodeData: any; onNodeUpdate?: (updates: any) => void }> = ({ nodeData, onNodeUpdate }) => {
  const [transformRules, setTransformRules] = useState(nodeData?.transformRules || []);

  const transformTypes = [
    { value: 'fieldMapping', label: '필드 매핑' },
    { value: 'dataTypeConversion', label: '데이터 타입 변환' },
    { value: 'calculation', label: '계산' },
    { value: 'stringManipulation', label: '문자열 조작' },
    { value: 'dateManipulation', label: '날짜 조작' },
    { value: 'conditional', label: '조건부 변환' }
  ];

  const transformOperations = {
    fieldMapping: [
      { value: 'rename', label: '이름 변경' },
      { value: 'copy', label: '복사' }
    ],
    dataTypeConversion: [
      { value: 'toString', label: '문자열로 변환' },
      { value: 'toNumber', label: '숫자로 변환' },
      { value: 'toBoolean', label: '불린으로 변환' },
      { value: 'toDate', label: '날짜로 변환' }
    ],
    calculation: [
      { value: 'add', label: '더하기' },
      { value: 'subtract', label: '빼기' },
      { value: 'multiply', label: '곱하기' },
      { value: 'divide', label: '나누기' },
      { value: 'modulo', label: '나머지' }
    ],
    stringManipulation: [
      { value: 'upperCase', label: '대문자 변환' },
      { value: 'lowerCase', label: '소문자 변환' },
      { value: 'trim', label: '공백 제거' },
      { value: 'substring', label: '부분 문자열' },
      { value: 'replace', label: '문자열 교체' },
      { value: 'split', label: '문자열 분할' },
      { value: 'concat', label: '문자열 연결' }
    ]
  };

  const addTransformRule = () => {
    const newRule = {
      id: `transform_${Date.now()}`,
      type: 'fieldMapping',
      sourceField: '',
      targetField: '',
      operation: 'rename',
      parameters: {},
      enabled: true
    };
    const updatedRules = [...transformRules, newRule];
    setTransformRules(updatedRules);
    onNodeUpdate?.({ transformRules: updatedRules });
  };

  const updateTransformRule = (index: number, field: string, value: any) => {
    const updatedRules = transformRules.map((rule: any, i: number) => 
      i === index ? { ...rule, [field]: value } : rule
    );
    setTransformRules(updatedRules);
    onNodeUpdate?.({ transformRules: updatedRules });
  };

  const removeTransformRule = (index: number) => {
    const updatedRules = transformRules.filter((_: any, i: number) => i !== index);
    setTransformRules(updatedRules);
    onNodeUpdate?.({ transformRules: updatedRules });
  };

  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="purple">
        변환 설정
      </Text>

      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500}>변환 규칙</Text>
        <Button size="xs" variant="outline" onClick={addTransformRule}>
          변환 규칙 추가
        </Button>
      </Group>

      {transformRules.map((rule: any, index: number) => (
        <Card key={rule.id} padding="xs" withBorder mb="xs">
          <Stack gap="xs">
            <Group gap="xs">
              <Select
                placeholder="변환 타입"
                size="xs"
                style={{ flex: 1 }}
                data={transformTypes}
                value={rule.type}
                onChange={(value) => {
                  updateTransformRule(index, 'type', value);
                  // 타입이 변경되면 operation도 초기화
                  const firstOperation = transformOperations[value as keyof typeof transformOperations]?.[0]?.value;
                  if (firstOperation) {
                    updateTransformRule(index, 'operation', firstOperation);
                  }
                }}
              />
              <Button 
                size="xs" 
                color="red" 
                variant="outline"
                onClick={() => removeTransformRule(index)}
              >
                제거
              </Button>
            </Group>
            
            <Select
              placeholder="변환 작업"
              size="xs"
              data={transformOperations[rule.type as keyof typeof transformOperations] || []}
              value={rule.operation}
              onChange={(value) => updateTransformRule(index, 'operation', value)}
            />
            
            <TextInput
              placeholder="원본 필드명"
              size="xs"
              value={rule.sourceField}
              onChange={(e) => updateTransformRule(index, 'sourceField', e.target.value)}
            />
            
            <TextInput
              placeholder="대상 필드명"
              size="xs"
              value={rule.targetField}
              onChange={(e) => updateTransformRule(index, 'targetField', e.target.value)}
            />

            {/* 계산 타입일 때 추가 매개변수 입력 */}
            {rule.type === 'calculation' && (
              <TextInput
                placeholder="값 (숫자 또는 필드명)"
                size="xs"
                value={rule.parameters?.value || ''}
                onChange={(e) => updateTransformRule(index, 'parameters', { ...rule.parameters, value: e.target.value })}
              />
            )}

            {/* 문자열 조작일 때 추가 매개변수 */}
            {rule.type === 'stringManipulation' && ['substring', 'replace'].includes(rule.operation) && (
              <Group gap="xs">
                {rule.operation === 'substring' && (
                  <>
                    <TextInput
                      placeholder="시작 위치"
                      size="xs"
                      style={{ flex: 1 }}
                      value={rule.parameters?.start || ''}
                      onChange={(e) => updateTransformRule(index, 'parameters', { ...rule.parameters, start: e.target.value })}
                    />
                    <TextInput
                      placeholder="길이"
                      size="xs"
                      style={{ flex: 1 }}
                      value={rule.parameters?.length || ''}
                      onChange={(e) => updateTransformRule(index, 'parameters', { ...rule.parameters, length: e.target.value })}
                    />
                  </>
                )}
                {rule.operation === 'replace' && (
                  <>
                    <TextInput
                      placeholder="찾을 문자열"
                      size="xs"
                      style={{ flex: 1 }}
                      value={rule.parameters?.search || ''}
                      onChange={(e) => updateTransformRule(index, 'parameters', { ...rule.parameters, search: e.target.value })}
                    />
                    <TextInput
                      placeholder="바꿀 문자열"
                      size="xs"
                      style={{ flex: 1 }}
                      value={rule.parameters?.replace || ''}
                      onChange={(e) => updateTransformRule(index, 'parameters', { ...rule.parameters, replace: e.target.value })}
                    />
                  </>
                )}
              </Group>
            )}

            <Checkbox
              label="활성화"
              size="xs"
              checked={rule.enabled !== false}
              onChange={(e) => updateTransformRule(index, 'enabled', e.target.checked)}
            />
          </Stack>
        </Card>
      ))}

      {transformRules.length === 0 && (
        <Text size="xs" c="dimmed" ta="center" py="md">
          변환 규칙을 추가하세요
        </Text>
      )}
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
  const [code, setCode] = useState(nodeData?.code || '# Python 코드를 입력하세요\n');

  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c="indigo">
        Python 스크립트 설정
      </Text>
      
      <Textarea
        label="Python 코드"
        placeholder="# Python 코드를 입력하세요"
        rows={8}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ fontFamily: 'monospace' }}
        error={!code.trim() ? 'Python 코드가 필요합니다.' : null}
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

const renderNodeProperties = (nodeType: NodeType, nodeData: any, onNodeUpdate?: (updates: any) => void) => {
  // 임시 더미 데이터 (실제로는 노드 간 연결에서 가져와야 함)
  const mockInputData = [
    { id: 1, name: 'John', age: 25, department: 'IT', salary: 5000, active: true },
    { id: 2, name: 'Jane', age: 30, department: 'HR', salary: 4500, active: false },
    { id: 3, name: 'Bob', age: 35, department: 'IT', salary: 6000, active: true },
    { id: 4, name: 'Alice', age: 28, department: 'Finance', salary: 5500, active: true }
  ];

  const mockFields = ['id', 'name', 'age', 'department', 'salary', 'active'];

  switch (nodeType) {
    case NodeType.DATABASE:
    case NodeType.LOGPRESSO:
      return <DatabaseNodeProperties nodeData={nodeData} onNodeUpdate={onNodeUpdate} />;
    case NodeType.FILTER:
      return (
        <FilterConfig 
          data={nodeData} 
          onChange={(updates) => onNodeUpdate?.(updates)}
          availableFields={mockFields}
          inputData={mockInputData}
          onExecute={(result) => {
            console.log('Filter execution result:', result);
            // 여기서 결과를 노드 데이터에 저장하거나 다른 처리를 할 수 있음
          }}
        />
      );
    case NodeType.AGGREGATE:
      return (
        <AggregateConfig 
          data={nodeData} 
          onChange={(updates) => onNodeUpdate?.(updates)}
          availableFields={mockFields}
          inputData={mockInputData}
          onExecute={(result) => {
            console.log('Aggregate execution result:', result);
            // 여기서 결과를 노드 데이터에 저장하거나 다른 처리를 할 수 있음
          }}
        />
      );
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

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedNode, onNodeUpdate }) => {
  const handleNodeDataUpdate = (updates: any) => {
    if (selectedNode && onNodeUpdate) {
      onNodeUpdate(selectedNode.id, updates);
    }
  };

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

        {/* 실시간 검증 상태 표시 */}
        <ValidationStatus node={selectedNode} />

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
            {renderNodeProperties(selectedNode.type as NodeType, selectedNode.data, handleNodeDataUpdate)}
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