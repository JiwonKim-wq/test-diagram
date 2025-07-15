import React, { useState } from 'react';
import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DiagramCanvas } from './components/DiagramCanvas';
import { NodeLibrary } from './components/NodeLibrary';
import { PropertyPanel } from './components/PropertyPanel';
import { Node } from 'reactflow';
import { NodeType } from '@diagram/common';

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [addNodeFunction, setAddNodeFunction] = useState<((nodeType: NodeType, position?: { x: number; y: number }) => void) | null>(null);
  const [updateNodeFunction, setUpdateNodeFunction] = useState<((nodeId: string, updates: any) => void) | null>(null);

  const handleNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
  };

  const handleNodeAdd = (nodeType: NodeType) => {
    if (addNodeFunction) {
      addNodeFunction(nodeType);
    }
  };

  const handleNodeUpdate = (nodeId: string, updates: any) => {
    if (updateNodeFunction) {
      updateNodeFunction(nodeId, updates);
      
      // 선택된 노드가 업데이트된 노드와 같다면 selectedNode도 업데이트
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({
          ...selectedNode,
          data: {
            ...selectedNode.data,
            ...updates
          }
        });
      }
    }
  };

  const handleCanvasReady = (addNodeFn: (nodeType: NodeType, position?: { x: number; y: number }) => void, updateNodeFn: (nodeId: string, updates: any) => void) => {
    setAddNodeFunction(() => addNodeFn);
    setUpdateNodeFunction(() => updateNodeFn);
  };

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
        <NodeLibrary onNodeAdd={handleNodeAdd} />
      </AppShell.Navbar>

      <AppShell.Main>
        <DiagramCanvas onNodeSelect={handleNodeSelect} onNodeAdd={handleCanvasReady} />
      </AppShell.Main>

      <AppShell.Aside p="md">
        <PropertyPanel selectedNode={selectedNode} onNodeUpdate={handleNodeUpdate} />
      </AppShell.Aside>
    </AppShell>
  );
}

export default App;
