export interface Disciplina {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface Professor {
  id: number;
  nome: string;
  ativo: boolean;
  disciplinas: ProfessorDisciplina[];
}

export interface Sala {
  id: number;
  local: string;
  ativo: boolean;
  turmas?: Turma[];
}

export interface Turma {
  id: number;
  codigo: string;
  disciplinaId: number;
  salaId: number;
  professorId?: number | null; // Make professorId optional
  ativo: boolean;
  disciplina?: Disciplina;
  sala?: Sala;
  professor?: Professor;
}

export interface ProfessorDisciplina {
  id: number;
  professorId: number;
  disciplinaId: number;
  professor?: Professor;
  disciplina?: Disciplina;
}