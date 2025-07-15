import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { store } from './store';
import App from './App';

// 테스트 헬퍼: 앱을 모든 필요한 Provider로 래핑
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <MantineProvider>
        {component}
      </MantineProvider>
    </Provider>
  );
};

test('renders diagram application', () => {
  renderWithProviders(<App />);
  
  // 다이어그램 캔버스가 렌더링되는지 확인
  const canvasElement = screen.getByRole('region');
  expect(canvasElement).toBeInTheDocument();
});

test('renders node library', () => {
  renderWithProviders(<App />);
  
  // 노드 라이브러리가 렌더링되는지 확인
  const nodeLibrary = screen.getByText('Node Library');
  expect(nodeLibrary).toBeInTheDocument();
});

test('renders property panel', () => {
  renderWithProviders(<App />);
  
  // 속성 패널이 렌더링되는지 확인
  const propertyPanel = screen.getByText('Properties');
  expect(propertyPanel).toBeInTheDocument();
});
