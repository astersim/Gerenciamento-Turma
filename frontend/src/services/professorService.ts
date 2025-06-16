import api from './api';
import { Professor } from '../types';

export const getProfessores = async (params?: {
  search?: string;
  orderBy1?: string;
  orderDir1?: 'asc' | 'desc';
  orderBy2?: string;
  orderDir2?: 'asc' | 'desc';
  status?: boolean;
}) => {
  const response = await api.get<Professor[]>('/professores', { params });
  return response.data;
};

export const getProfessor = async (id: number) => {
  const response = await api.get<Professor>(`professores/${id}`);
  return response.data;
};

export const createProfessor = async (professor: { nome: string; disciplinaIds?: number[] }) => {
  const response = await api.post<Professor>('/professores', professor);
  return response.data;
};

export const updateProfessor = async (
  id: number,
  professor: { nome: string; disciplinaIds?: number[] }
) => {
  const response = await api.put<Professor>(`/professores/${id}`, professor);
  return response.data;
};

export const deleteProfessor = async (id: number) => {
  await api.delete(`/professores/${id}`);
};

export const reativarProfessor = async (id: number) => {
  const response = await api.patch<Professor>(`/professores/${id}/reativar`);
  return response.data;
};