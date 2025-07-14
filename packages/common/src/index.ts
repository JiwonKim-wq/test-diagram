// 기본 데이터베이스 연결 타입
export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'mysql' | 'logpresso';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  isConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 노드 기본 타입
export interface BaseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 다이어그램 타입
export interface Diagram {
  id: string;
  name: string;
  description?: string;
  nodes: BaseNode[];
  edges: DiagramEdge[];
  createdAt: Date;
  updatedAt: Date;
}

// 다이어그램 엣지 타입
export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: Record<string, any>;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 에러 타입
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
} 