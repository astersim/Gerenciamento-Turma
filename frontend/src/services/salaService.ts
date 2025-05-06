import api from './api';
import { Sala } from '../types';

export const getSalas = async (ativo?: boolean) => {
  const response = await api.get<Sala[]>(
    `/salas${ativo !== undefined ? `?ativo=${ativo}` : ''}`
  );
  return response.data;
};

export const getSala = async (id: number) => {
  const response = await api.get<Sala>(`/salas/${id}`);
  return response.data;
};

export const createSala = async (sala: { local: string }) => {
  const response = await api.post<Sala>('/salas', sala);
  return response.data;
};

export const updateSala = async (id: number, sala: { local: string }) => {
  const response = await api.put<Sala>(`/salas/${id}`, sala);
  return response.data;
};

export const deleteSala = async (id: number) => {
  await api.delete(`/salas/${id}`);
};

export const reativarSala = async (id: number) => {
  const response = await api.patch<Sala>(`/salas/${id}/reativar`);
  return response.data;
};