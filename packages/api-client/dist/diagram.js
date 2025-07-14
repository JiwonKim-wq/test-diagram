import { apiClient } from './index';
// 다이어그램 목록 조회
export const getDiagrams = async () => {
    return apiClient.get('/diagrams');
};
// 다이어그램 상세 조회
export const getDiagram = async (id) => {
    return apiClient.get(`/diagrams/${id}`);
};
// 다이어그램 생성
export const createDiagram = async (diagramData) => {
    return apiClient.post('/diagrams', diagramData);
};
// 다이어그램 수정
export const updateDiagram = async (id, diagramData) => {
    return apiClient.put(`/diagrams/${id}`, diagramData);
};
// 다이어그램 삭제
export const deleteDiagram = async (id) => {
    return apiClient.delete(`/diagrams/${id}`);
};
// 다이어그램 실행
export const executeDiagram = async (id) => {
    return apiClient.post(`/diagrams/${id}/execute`);
};
