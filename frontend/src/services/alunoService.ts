import { Aluno, TurmaAluno } from '../types';
import api from './api';

interface GetAlunosParams {
  ativo?: boolean;
  search?: string;
  orderBy1?: string;
  orderBy2?: string;
  orderDir1?: 'asc' | 'desc';
  orderDir2?: 'asc' | 'desc';
}

export const getAlunos = async (params?: GetAlunosParams): Promise<Aluno[]> => {
  const { data } = await api.get('/alunos', { params });
  return data;
};

export const getAlunoById = async (id: number): Promise<Aluno> => {
  const { data } = await api.get(`/alunos/${id}`);
  return data;
};

export const createAluno = async (aluno: Omit<Aluno, 'id'>): Promise<Aluno> => {
  const { data } = await api.post('/alunos', aluno);
  return data;
};

export const updateAluno = async (id: number, aluno: Omit<Aluno, 'id'>): Promise<Aluno> => {
  const { data } = await api.put(`/alunos/${id}`, aluno);
  return data;
};

export const deleteAluno = async (id: number): Promise<void> => {
  await api.delete(`/alunos/${id}`);
};

// Matrícula (TurmaAluno)
export const matricularAluno = async (turmaId: number, alunoId: number): Promise<TurmaAluno> => {
  const { data } = await api.post('/alunos/matricular', { turmaId, alunoId });
  return data;
};

export const desmatricularAluno = async (turmaId: number, alunoId: number): Promise<void> => {
  await api.post('/alunos/desmatricular', { turmaId, alunoId });
};

export const getAlunosDaTurma = async (turmaId: number): Promise<Aluno[]> => {
  const { data } = await api.get(`/alunos/turma/${turmaId}`);
  return data;
};

export const getTurmasDoAluno = async (alunoId: number): Promise<TurmaAluno[]> => {
  const { data } = await api.get(`/alunos/aluno/${alunoId}/turmas`);
  return data;
};

// Função para reativar aluno individual
export const reativarAluno = async (id: number): Promise<Aluno> => {
  const { data } = await api.patch(`/alunos/${id}/reativar`);
  return data;
};

// Função para reativar múltiplos alunos
export const reativarAlunos = async (ids: number[]): Promise<Aluno[]> => {
  const { data } = await api.patch('/alunos/reativar', { ids });
  return data;
};

export const getAlunosInativos = async (): Promise<Aluno[]> => {
  const { data } = await api.get('/alunos?ativo=false');
  return data;
};
