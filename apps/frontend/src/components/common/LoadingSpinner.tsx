import React from 'react';
import { Loader, Stack, Text } from '@mantine/core';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = '로딩 중...' 
}) => {
  return (
    <Stack align="center" justify="center" gap="md" p="xl">
      <Loader size={size} />
      <Text size="sm" c="dimmed">
        {message}
      </Text>
    </Stack>
  );
}; 