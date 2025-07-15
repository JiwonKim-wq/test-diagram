import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from 'reactflow';

interface DiagramState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  executionResults: any[];
  errors: string[];
}

const initialState: DiagramState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isExecuting: false,
  executionResults: [],
  errors: []
};

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.data = { ...node.data, ...action.payload.data };
      }
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(n => n.id !== action.payload);
      state.edges = state.edges.filter(e => 
        e.source !== action.payload && e.target !== action.payload
      );
    },
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    setExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    addExecutionResult: (state, action: PayloadAction<any>) => {
      state.executionResults.push(action.payload);
    },
    clearExecutionResults: (state) => {
      state.executionResults = [];
    },
    addError: (state, action: PayloadAction<string>) => {
      state.errors.push(action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    }
  }
});

export const {
  setNodes,
  setEdges,
  addNode,
  updateNode,
  removeNode,
  setSelectedNode,
  setExecuting,
  addExecutionResult,
  clearExecutionResults,
  addError,
  clearErrors
} = diagramSlice.actions;

export default diagramSlice.reducer; 