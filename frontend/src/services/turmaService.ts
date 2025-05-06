import api from './api';
import { Turma } from '../types';

export const getTurmas = async (ativo?: boolean) => {
  const response = await api.get<Turma[]>(
    `/turmas${ativo !== undefined ? `?ativo=${ativo}` : ''}`
  );
  return response.data;
};

export const getTurma = async (id: number) => {
  const response = await api.get<Turma>(`/turmas/${id}`);
  return response.data;
};

export const createTurma = async (turma: { codigo: string; disciplinaId: number; salaId: number }) => {
  const response = await api.post<Turma>('/turmas', turma);
  return response.data;
};

export const updateTurma = async (
  id: number,
  turma: { codigo?: string; disciplinaId?: number; salaId?: number }
) => {
  const response = await api.put<Turma>(`/turmas/${id}`, turma);
  return response.data;
};

export const deleteTurma = async (id: number) => {
  await api.delete(`/turmas/${id}`);
};

export const reativarTurma = async (id: number) => {
  const response = await api.patch<Turma>(`/turmas/${id}/reativar`);
  return response.data;
};