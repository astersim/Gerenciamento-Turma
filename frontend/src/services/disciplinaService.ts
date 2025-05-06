import api from './api';
import { Disciplina } from '../types';

export const getDisciplinas = async () => {
  const response = await api.get<Disciplina[]>('/disciplinas');
  return response.data;
};

export const getDisciplina = async (id: number) => {
  const response = await api.get<Disciplina>(`/disciplinas/${id}`);
  return response.data;
};

export const createDisciplina = async (disciplina: { nome: string }) => {
  const response = await api.post<Disciplina>('/disciplinas', disciplina);
  return response.data;
};

export const updateDisciplina = async (id: number, disciplina: { nome: string }) => {
  const response = await api.put<Disciplina>(`/disciplinas/${id}`, disciplina);
  return response.data;
};

export const deleteDisciplina = async (id: number) => {
  await api.delete(`/disciplinas/${id}`);
};

export const reativarDisciplina = async (id: number) => {
  const response = await api.patch<Disciplina>(`/disciplinas/${id}/reativar`);
  return response.data;
};