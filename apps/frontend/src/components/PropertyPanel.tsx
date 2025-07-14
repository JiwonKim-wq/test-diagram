import React from 'react';
import { Stack, Text, Card, TextInput, Select, Button, Group, Divider } from '@mantine/core';

interface PropertyPanelProps {
  selectedNode?: any;
  onNodeUpdate?: (nodeId: string, data: any) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  selectedNode, 
  onNodeUpdate 
}) => {
  if (!selectedNode) {
    return (
      <Stack gap="md">
        <Text size="lg" fw={600}>
          속성 패널
        </Text>
        <Text size="sm" c="dimmed">
          노드를 선택하여 속성을 편집하세요.
        </Text>
      </Stack>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    if (onNodeUpdate) {
      onNodeUpdate(selectedNode.id, {
        ...selectedNode.data,
        [field]: value
      });
    }
  };

  return (
    <Stack gap="md">
      <Text size="lg" fw={600}>
        속성 패널
      </Text>
      
      <Card withBorder padding="md">
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            기본 정보
          </Text>
          
          <TextInput
            label="노드 ID"
            value={selectedNode.id}
            disabled
            size="sm"
          />
          
          <TextInput
            label="노드 타입"
            value={selectedNode.type || 'default'}
            disabled
            size="sm"
          />
          
          <TextInput
            label="레이블"
            value={selectedNode.data?.label || ''}
            onChange={(event) => handleInputChange('label', event.currentTarget.value)}
            size="sm"
          />
        </Stack>
      </Card>

      {selectedNode.type === 'database' && (
        <Card withBorder padding="md">
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              데이터베이스 설정
            </Text>
            
            <Select
              label="데이터베이스 타입"
              data={[
                { value: 'mysql', label: 'MySQL' },
                { value: 'logpresso', label: 'Logpresso' }
              ]}
              value={selectedNode.data?.dbType || 'mysql'}
              onChange={(value) => handleInputChange('dbType', value)}
              size="sm"
            />
            
            <TextInput
              label="호스트"
              value={selectedNode.data?.host || ''}
              onChange={(event) => handleInputChange('host', event.currentTarget.value)}
              size="sm"
            />
            
            <TextInput
              label="포트"
              value={selectedNode.data?.port || ''}
              onChange={(event) => handleInputChange('port', event.currentTarget.value)}
              size="sm"
            />
            
            <TextInput
              label="데이터베이스명"
              value={selectedNode.data?.database || ''}
              onChange={(event) => handleInputChange('database', event.currentTarget.value)}
              size="sm"
            />
          </Stack>
        </Card>
      )}

      <Divider />
      
      <Group justify="flex-end">
        <Button variant="light" size="sm">
          삭제
        </Button>
        <Button size="sm">
          적용
        </Button>
      </Group>
    </Stack>
  );
}; 