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
  NumberInput,
  Textarea,
  MultiSelect,
  Badge
} from '@mantine/core';
import { IconPlus, IconTrash, IconGripVertical } from '@tabler/icons-react';
import { FilterNodeData, FilterRule, FilterOperator } from '@diagram/common';

interface FilterConfigProps {
  data: FilterNodeData;
  onChange: (data: FilterNodeData) => void;
  availableFields: string[];
}

const FILTER_OPERATORS = [
  { value: FilterOperator.EQUALS, label: '같음 (=)' },
  { value: FilterOperator.NOT_EQUALS, label: '다름 (≠)' },
  { value: FilterOperator.GREATER_THAN, label: '초과 (>)' },
  { value: FilterOperator.GREATER_THAN_OR_EQUAL, label: '이상 (≥)' },
  { value: FilterOperator.LESS_THAN, label: '미만 (<)' },
  { value: FilterOperator.LESS_THAN_OR_EQUAL, label: '이하 (≤)' },
  { value: FilterOperator.CONTAINS, label: '포함' },
  { value: FilterOperator.NOT_CONTAINS, label: '포함하지 않음' },
  { value: FilterOperator.STARTS_WITH, label: '시작함' },
  { value: FilterOperator.ENDS_WITH, label: '끝남' },
  { value: FilterOperator.IN, label: '목록에 포함' },
  { value: FilterOperator.NOT_IN, label: '목록에 포함하지 않음' },
  { value: FilterOperator.IS_NULL, label: '비어있음' },
  { value: FilterOperator.IS_NOT_NULL, label: '비어있지 않음' },
  { value: FilterOperator.REGEX, label: '정규식' },
  { value: FilterOperator.BETWEEN, label: '범위' }
];

const DATA_TYPES = [
  { value: 'string', label: '문자열' },
  { value: 'number', label: '숫자' },
  { value: 'boolean', label: '불린' },
  { value: 'date', label: '날짜' },
  { value: 'array', label: '배열' }
];

export const FilterConfig: React.FC<FilterConfigProps> = ({
  data,
  onChange,
  availableFields
}) => {
  const [newFilter, setNewFilter] = useState<Partial<FilterRule>>({
    field: '',
    operator: FilterOperator.EQUALS,
    value: '',
    dataType: 'string',
    caseSensitive: false,
    enabled: true
  });

  const addFilter = () => {
    if (!newFilter.field) return;

    const filter: FilterRule = {
      id: Date.now().toString(),
      field: newFilter.field!,
      operator: newFilter.operator!,
      value: newFilter.value,
      dataType: newFilter.dataType!,
      caseSensitive: newFilter.caseSensitive,
      enabled: newFilter.enabled
    };

    onChange({
      ...data,
      filters: [...data.filters, filter]
    });

    setNewFilter({
      field: '',
      operator: FilterOperator.EQUALS,
      value: '',
      dataType: 'string',
      caseSensitive: false,
      enabled: true
    });
  };

  const updateFilter = (index: number, updates: Partial<FilterRule>) => {
    const updatedFilters = [...data.filters];
    updatedFilters[index] = { ...updatedFilters[index], ...updates };
    onChange({ ...data, filters: updatedFilters });
  };

  const removeFilter = (index: number) => {
    const updatedFilters = data.filters.filter((_, i) => i !== index);
    onChange({ ...data, filters: updatedFilters });
  };

  const renderValueInput = (filter: FilterRule, index: number) => {
    const updateValue = (value: any) => updateFilter(index, { value });

    switch (filter.operator) {
      case FilterOperator.IS_NULL:
      case FilterOperator.IS_NOT_NULL:
        return null; // 값 입력 불필요

      case FilterOperator.IN:
      case FilterOperator.NOT_IN:
        const multiValue = Array.isArray(filter.value) ? filter.value : [];
        return (
          <Stack gap="xs">
            <MultiSelect
              placeholder="값 목록 선택"
              data={multiValue.map((val: any) => ({ value: String(val), label: String(val) }))}
              value={multiValue.map((val: any) => String(val))}
              onChange={(values: string[]) => updateValue(values)}
              searchable
            />
            <TextInput
              placeholder="새 값 추가 후 Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const newValue = e.currentTarget.value.trim();
                  const updatedValue = [...multiValue, newValue];
                  updateValue(updatedValue);
                  e.currentTarget.value = '';
                }
              }}
            />
          </Stack>
        );

      case FilterOperator.BETWEEN:
        const betweenValue = Array.isArray(filter.value) ? filter.value : ['', ''];
        return (
          <Group>
            {filter.dataType === 'number' ? (
              <>
                <NumberInput
                  placeholder="최소값"
                  value={betweenValue[0] || ''}
                  onChange={(val) => updateValue([val, betweenValue[1]])}
                  style={{ flex: 1 }}
                />
                <NumberInput
                  placeholder="최대값"
                  value={betweenValue[1] || ''}
                  onChange={(val) => updateValue([betweenValue[0], val])}
                  style={{ flex: 1 }}
                />
              </>
            ) : (
              <>
                <TextInput
                  placeholder="최소값"
                  value={betweenValue[0] || ''}
                  onChange={(e) => updateValue([e.target.value, betweenValue[1]])}
                  style={{ flex: 1 }}
                />
                <TextInput
                  placeholder="최대값"
                  value={betweenValue[1] || ''}
                  onChange={(e) => updateValue([betweenValue[0], e.target.value])}
                  style={{ flex: 1 }}
                />
              </>
            )}
          </Group>
        );

      case FilterOperator.REGEX:
        return (
          <Textarea
            placeholder="정규식 패턴"
            value={filter.value || ''}
            onChange={(e) => updateValue(e.target.value)}
            minRows={2}
          />
        );

      default:
        if (filter.dataType === 'number') {
          return (
            <NumberInput
              placeholder="값 입력"
              value={filter.value || ''}
              onChange={updateValue}
            />
          );
        } else if (filter.dataType === 'boolean') {
          return (
            <Select
              placeholder="값 선택"
              value={filter.value?.toString() || ''}
              onChange={(val) => updateValue(val === 'true')}
              data={[
                { value: 'true', label: 'True' },
                { value: 'false', label: 'False' }
              ]}
            />
          );
        } else {
          return (
            <TextInput
              placeholder="값 입력"
              value={filter.value || ''}
              onChange={(e) => updateValue(e.target.value)}
            />
          );
        }
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <h3>필터 설정</h3>
        <Select
          label="논리 연산자"
          value={data.operator}
          onChange={(value) => onChange({ ...data, operator: value as 'AND' | 'OR' })}
          data={[
            { value: 'AND', label: 'AND (모든 조건 만족)' },
            { value: 'OR', label: 'OR (하나 이상 조건 만족)' }
          ]}
        />
      </Group>

      {/* 기존 필터 목록 */}
      <Stack gap="sm">
        {data.filters.map((filter, index) => (
          <Paper key={filter.id} p="md" withBorder>
            <Group justify="space-between" mb="sm">
              <Group>
                <IconGripVertical size={16} />
                <Badge color={filter.enabled ? 'blue' : 'gray'}>
                  필터 {index + 1}
                </Badge>
              </Group>
              <Group>
                <Switch
                  checked={filter.enabled}
                  onChange={(e) => updateFilter(index, { enabled: e.target.checked })}
                  size="sm"
                />
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeFilter(index)}
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
                  value={filter.field}
                  onChange={(value) => updateFilter(index, { field: value! })}
                  data={availableFields.map(field => ({ value: field, label: field }))}
                  style={{ flex: 1 }}
                />
                <Select
                  label="연산자"
                  value={filter.operator}
                  onChange={(value) => updateFilter(index, { operator: value as FilterOperator })}
                  data={FILTER_OPERATORS}
                  style={{ flex: 1 }}
                />
                <Select
                  label="데이터 타입"
                  value={filter.dataType}
                  onChange={(value) => updateFilter(index, { dataType: value as any })}
                  data={DATA_TYPES}
                  style={{ flex: 1 }}
                />
              </Group>

              {renderValueInput(filter, index)}

              {(filter.operator === FilterOperator.CONTAINS ||
                filter.operator === FilterOperator.NOT_CONTAINS ||
                filter.operator === FilterOperator.STARTS_WITH ||
                filter.operator === FilterOperator.ENDS_WITH ||
                filter.operator === FilterOperator.REGEX) && (
                <Switch
                  label="대소문자 구분"
                  checked={filter.caseSensitive}
                  onChange={(e) => updateFilter(index, { caseSensitive: e.target.checked })}
                />
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* 새 필터 추가 */}
      <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
        <Stack gap="sm">
          <h4>새 필터 추가</h4>
          <Group>
            <Select
              label="필드"
              placeholder="필드 선택"
              value={newFilter.field}
              onChange={(value) => setNewFilter({ ...newFilter, field: value! })}
              data={availableFields.map(field => ({ value: field, label: field }))}
              style={{ flex: 1 }}
            />
            <Select
              label="연산자"
              value={newFilter.operator}
              onChange={(value) => setNewFilter({ ...newFilter, operator: value as FilterOperator })}
              data={FILTER_OPERATORS}
              style={{ flex: 1 }}
            />
            <Select
              label="데이터 타입"
              value={newFilter.dataType}
              onChange={(value) => setNewFilter({ ...newFilter, dataType: value as any })}
              data={DATA_TYPES}
              style={{ flex: 1 }}
            />
          </Group>

          <TextInput
            label="값"
            placeholder="필터 값 입력"
            value={newFilter.value || ''}
            onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          />

          <Group justify="space-between">
            <Switch
              label="대소문자 구분"
              checked={newFilter.caseSensitive}
              onChange={(e) => setNewFilter({ ...newFilter, caseSensitive: e.target.checked })}
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={addFilter}
              disabled={!newFilter.field}
            >
              필터 추가
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}; 