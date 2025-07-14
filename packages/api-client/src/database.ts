import { apiClient } from './index';

// 데이터베이스 연결 테스트
export const testDatabaseConnection = async (connectionData: any) => {
  return apiClient.post('/database/test-connection', connectionData);
};

// 데이터베이스 연결 목록 조회
export const getDatabaseConnections = async () => {
  return apiClient.get('/database/connections');
};

// 데이터베이스 연결 생성
export const createDatabaseConnection = async (connectionData: any) => {
  return apiClient.post('/database/connections', connectionData);
};

// 데이터베이스 연결 수정
export const updateDatabaseConnection = async (id: string, connectionData: any) => {
  return apiClient.put(`/database/connections/${id}`, connectionData);
};

// 데이터베이스 연결 삭제
export const deleteDatabaseConnection = async (id: string) => {
  return apiClient.delete(`/database/connections/${id}`);
};

// 쿼리 실행
export const executeQuery = async (connectionId: string, query: string) => {
  return apiClient.post('/database/execute-query', {
    connectionId,
    query
  });
}; 