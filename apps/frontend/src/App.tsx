import React from 'react';
import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DiagramCanvas } from './components/DiagramCanvas';
import { NodeLibrary } from './components/NodeLibrary';
import { PropertyPanel } from './components/PropertyPanel';

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
        <NodeLibrary />
      </AppShell.Navbar>

      <AppShell.Main>
        <DiagramCanvas />
      </AppShell.Main>

      <AppShell.Aside p="md">
        <PropertyPanel />
      </AppShell.Aside>
    </AppShell>
  );
}

export default App;
