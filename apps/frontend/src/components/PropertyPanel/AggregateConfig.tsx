import React, { useState } from 'react';
import {
  Box,
  Button,
  Select,
  TextInput,
  Group,
  Stack,
  Paper,
  ActionIcon,
  Switch,
  MultiSelect,
  Badge,
  Divider
} from '@mantine/core';
import { IconPlus, IconTrash, IconGripVertical } from '@tabler/icons-react';
import { AggregateNodeData, AggregationRule, AggregateFunction, OrderByRule } from '@diagram/common';

interface AggregateConfigProps {
  data: AggregateNodeData;
  onChange: (data: AggregateNodeData) => void;
  availableFields: string[];
}

const AGGREGATE_FUNCTIONS = [
  { value: AggregateFunction.COUNT, label: 'COUNT (개수)' },
  { value: AggregateFunction.SUM, label: 'SUM (합계)' },
  { value: AggregateFunction.AVG, label: 'AVG (평균)' },
  { value: AggregateFunction.MIN, label: 'MIN (최소값)' },
  { value: AggregateFunction.MAX, label: 'MAX (최대값)' },
  { value: AggregateFunction.FIRST, label: 'FIRST (첫번째)' },
  { value: AggregateFunction.LAST, label: 'LAST (마지막)' },
  { value: AggregateFunction.STDDEV, label: 'STDDEV (표준편차)' },
  { value: AggregateFunction.VARIANCE, label: 'VARIANCE (분산)' }
];

export const AggregateConfig: React.FC<AggregateConfigProps> = ({
  data,
  onChange,
  availableFields
}) => {
  const [newAggregation, setNewAggregation] = useState<Partial<AggregationRule>>({
    field: '',
    function: AggregateFunction.COUNT,
    alias: '',
    distinct: false,
    enabled: true
  });

  const [newOrderBy, setNewOrderBy] = useState<Partial<OrderByRule>>({
    field: '',
    direction: 'ASC'
  });

  const addAggregation = () => {
    if (!newAggregation.field) return;

    const aggregation: AggregationRule = {
      id: Date.now().toString(),
      field: newAggregation.field!,
      function: newAggregation.function!,
      alias: newAggregation.alias || `${newAggregation.function}_${newAggregation.field}`,
      distinct: newAggregation.distinct,
      enabled: newAggregation.enabled
    };

    onChange({
      ...data,
      aggregations: [...data.aggregations, aggregation]
    });

    setNewAggregation({
      field: '',
      function: AggregateFunction.COUNT,
      alias: '',
      distinct: false,
      enabled: true
    });
  };

  const updateAggregation = (index: number, updates: Partial<AggregationRule>) => {
    const updatedAggregations = [...data.aggregations];
    updatedAggregations[index] = { ...updatedAggregations[index], ...updates };
    onChange({ ...data, aggregations: updatedAggregations });
  };

  const removeAggregation = (index: number) => {
    const updatedAggregations = data.aggregations.filter((_, i) => i !== index);
    onChange({ ...data, aggregations: updatedAggregations });
  };

  const addOrderBy = () => {
    if (!newOrderBy.field) return;

    const orderBy: OrderByRule = {
      field: newOrderBy.field!,
      direction: newOrderBy.direction! as 'ASC' | 'DESC'
    };

    onChange({
      ...data,
      orderBy: [...(data.orderBy || []), orderBy]
    });

    setNewOrderBy({
      field: '',
      direction: 'ASC'
    });
  };

  const updateOrderBy = (index: number, updates: Partial<OrderByRule>) => {
    const updatedOrderBy = [...(data.orderBy || [])];
    updatedOrderBy[index] = { ...updatedOrderBy[index], ...updates };
    onChange({ ...data, orderBy: updatedOrderBy });
  };

  const removeOrderBy = (index: number) => {
    const updatedOrderBy = (data.orderBy || []).filter((_, i) => i !== index);
    onChange({ ...data, orderBy: updatedOrderBy });
  };

  // 그룹화 + 집계 필드를 정렬 옵션으로 생성
  const sortableFields = [
    ...data.groupBy,
    ...data.aggregations.map(agg => agg.alias || `${agg.function}_${agg.field}`)
  ];

  return (
    <Stack gap="md">
      <h3>집계 설정</h3>

      {/* 그룹화 설정 */}
      <Box>
        <h4>그룹화</h4>
        <MultiSelect
          placeholder="그룹화할 필드 선택"
          data={availableFields.map(field => ({ value: field, label: field }))}
          value={data.groupBy}
          onChange={(value) => onChange({ ...data, groupBy: value })}
          searchable
        />
      </Box>

      <Divider />

      {/* 집계 함수 설정 */}
      <Box>
        <h4>집계 함수</h4>
        <Stack gap="sm">
          {data.aggregations.map((aggregation, index) => (
            <Paper key={aggregation.id} p="md" withBorder>
              <Group justify="space-between" mb="sm">
                <Group>
                  <IconGripVertical size={16} />
                  <Badge color={aggregation.enabled ? 'blue' : 'gray'}>
                    집계 {index + 1}
                  </Badge>
                </Group>
                <Group>
                  <Switch
                    checked={aggregation.enabled}
                    onChange={(e) => updateAggregation(index, { enabled: e.target.checked })}
                    size="sm"
                  />
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeAggregation(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>

              <Stack gap="sm">
                <Group>
                  <Select
                    label="필드"
                    placeholder="필드 선택"
                    value={aggregation.field}
                    onChange={(value) => updateAggregation(index, { field: value! })}
                    data={[
                      { value: '*', label: '* (전체)' },
                      ...availableFields.map(field => ({ value: field, label: field }))
                    ]}
                    style={{ flex: 1 }}
                  />
                  <Select
                    label="함수"
                    value={aggregation.function}
                    onChange={(value) => updateAggregation(index, { function: value as AggregateFunction })}
                    data={AGGREGATE_FUNCTIONS}
                    style={{ flex: 1 }}
                  />
                </Group>

                <Group>
                  <TextInput
                    label="별칭 (선택사항)"
                    placeholder="결과 필드명"
                    value={aggregation.alias || ''}
                    onChange={(e) => updateAggregation(index, { alias: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <Box pt="xl">
                    <Switch
                      label="중복 제거"
                      checked={aggregation.distinct}
                      onChange={(e) => updateAggregation(index, { distinct: e.target.checked })}
                    />
                  </Box>
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>

        {/* 새 집계 추가 */}
        <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }} mt="md">
          <Stack gap="sm">
            <h4>새 집계 추가</h4>
            <Group>
              <Select
                label="필드"
                placeholder="필드 선택"
                value={newAggregation.field}
                onChange={(value) => setNewAggregation({ ...newAggregation, field: value! })}
                data={[
                  { value: '*', label: '* (전체)' },
                  ...availableFields.map(field => ({ value: field, label: field }))
                ]}
                style={{ flex: 1 }}
              />
              <Select
                label="함수"
                value={newAggregation.function}
                onChange={(value) => setNewAggregation({ ...newAggregation, function: value as AggregateFunction })}
                data={AGGREGATE_FUNCTIONS}
                style={{ flex: 1 }}
              />
            </Group>

            <Group>
              <TextInput
                label="별칭 (선택사항)"
                placeholder="결과 필드명"
                value={newAggregation.alias || ''}
                onChange={(e) => setNewAggregation({ ...newAggregation, alias: e.target.value })}
                style={{ flex: 1 }}
              />
              <Box pt="xl">
                <Switch
                  label="중복 제거"
                  checked={newAggregation.distinct}
                  onChange={(e) => setNewAggregation({ ...newAggregation, distinct: e.target.checked })}
                />
              </Box>
            </Group>

            <Group justify="flex-end">
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={addAggregation}
                disabled={!newAggregation.field}
              >
                집계 추가
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Box>

      <Divider />

      {/* 정렬 설정 */}
      <Box>
        <h4>정렬</h4>
        <Stack gap="sm">
          {(data.orderBy || []).map((orderBy, index) => (
            <Paper key={index} p="md" withBorder>
              <Group justify="space-between">
                <Group style={{ flex: 1 }}>
                  <Select
                    placeholder="정렬 필드 선택"
                    value={orderBy.field}
                    onChange={(value) => updateOrderBy(index, { field: value! })}
                    data={sortableFields.map(field => ({ value: field, label: field }))}
                    style={{ flex: 1 }}
                  />
                  <Select
                    value={orderBy.direction}
                    onChange={(value) => updateOrderBy(index, { direction: value as 'ASC' | 'DESC' })}
                    data={[
                      { value: 'ASC', label: '오름차순' },
                      { value: 'DESC', label: '내림차순' }
                    ]}
                    style={{ width: 120 }}
                  />
                </Group>
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeOrderBy(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>

        {/* 새 정렬 추가 */}
        {sortableFields.length > 0 && (
          <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }} mt="md">
            <Stack gap="sm">
              <h4>새 정렬 추가</h4>
              <Group>
                <Select
                  label="필드"
                  placeholder="정렬 필드 선택"
                  value={newOrderBy.field}
                  onChange={(value) => setNewOrderBy({ ...newOrderBy, field: value! })}
                  data={sortableFields.map(field => ({ value: field, label: field }))}
                  style={{ flex: 1 }}
                />
                <Select
                  label="방향"
                  value={newOrderBy.direction}
                  onChange={(value) => setNewOrderBy({ ...newOrderBy, direction: value as 'ASC' | 'DESC' })}
                  data={[
                    { value: 'ASC', label: '오름차순' },
                    { value: 'DESC', label: '내림차순' }
                  ]}
                  style={{ width: 120 }}
                />
                <Box pt="xl">
                  <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={addOrderBy}
                    disabled={!newOrderBy.field}
                  >
                    정렬 추가
                  </Button>
                </Box>
              </Group>
            </Stack>
          </Paper>
        )}
      </Box>
    </Stack>
  );
}; 