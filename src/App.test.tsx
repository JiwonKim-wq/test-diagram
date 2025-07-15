import React from 'react';
import { render } from '@testing-library/react';

// 매우 간단한 기본 테스트
test('basic React rendering test', () => {
  const TestComponent = () => <div data-testid="test">Hello Test</div>;
  const { getByTestId } = render(<TestComponent />);
  expect(getByTestId('test')).toBeInTheDocument();
});

test('Jest and testing-library are working', () => {
  expect(true).toBe(true);
}); 