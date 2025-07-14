import React from 'react';
import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 300,
        breakpoint: 'md',
        collapsed: { desktop: false, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Text size="lg" fw={500}>
            다이어그램 데이터 처리 시스템
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text>노드 라이브러리</Text>
        {/* TODO: 노드 라이브러리 컴포넌트 추가 */}
      </AppShell.Navbar>

      <AppShell.Main>
        <Text>다이어그램 캔버스</Text>
        {/* TODO: React Flow 캔버스 추가 */}
      </AppShell.Main>

      <AppShell.Aside p="md">
        <Text>속성 패널</Text>
        {/* TODO: 속성 패널 컴포넌트 추가 */}
      </AppShell.Aside>
    </AppShell>
  );
}

export default App;
