import React from 'react';
import { Alert, Button, Group } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="오류 발생"
      color="red"
      variant="outline"
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          {message}
        </div>
        {showRetry && onRetry && (
          <Button
            variant="light"
            color="red"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={onRetry}
          >
            다시 시도
          </Button>
        )}
      </Group>
    </Alert>
  );
}; 