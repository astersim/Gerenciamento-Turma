export interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  periodo: string;
  ativo: boolean;
}

export interface Professor {
  id: number;
  nome: string;
  cpf: string;
  titulacao: string;
  ativo: boolean;
}

export interface Sala {
  id: number;
  nome: string;
  local: string;
  capacidade: number;
  ativo: boolean;
  turmas?: Turma[];
}

export interface Turma {
  id: number;
  codigo: string;
  nome: string;
  diaSemana: string;
  horarioInicio: string;
  horarioTermino: string;
  disciplinaId: number;
  professorId: number;
  salaId: number;
  ativo: boolean;
  disciplina?: Disciplina;
  professor?: Professor;
  sala?: Sala;
}

export interface Aluno {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  ativo: boolean;
}

export interface TurmaAluno {
  id: number;
  turmaId: number;
  alunoId: number;
  turma?: Turma;
  aluno?: Aluno;
}