import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const createAluno = async (req: Request, res: Response) => {
  try {
    const { nome, sobrenome, email, cpf } = req.body;
    if (!nome || !sobrenome || !email || !cpf) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    // Validação simples de CPF (pode ser aprimorada)
    if (!/^\d{11}$/.test(cpf)) {
      return res.status(400).json({ error: 'CPF inválido.' });
    }
    const aluno = await prisma.aluno.create({
      data: { nome, sobrenome, email, cpf },
    });
    res.status(201).json(aluno);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email ou CPF já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao criar aluno.' });
  }
};

export const getAlunos = async (req: Request, res: Response) => {
  try {
    const { ativo, search, orderBy1, orderBy2, orderDir1 = 'asc', orderDir2 = 'asc' } = req.query;
    const where: any = {};
    
    if (ativo !== undefined) where.ativo = ativo === 'true';
    
    if (search) {
      where.OR = [
        { nome: { contains: String(search), mode: 'insensitive' } },
        { sobrenome: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { cpf: { contains: String(search), mode: 'insensitive' } }
      ];
    }
    
    const orderBy: any[] = [];
    if (orderBy1) orderBy.push({ [orderBy1 as string]: orderDir1 });
    if (orderBy2) orderBy.push({ [orderBy2 as string]: orderDir2 });
    
    const alunos = await prisma.aluno.findMany({
      where,
      orderBy: orderBy.length ? orderBy : undefined
    });
    
    res.json(alunos);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar alunos.' });
  }
};

export const getAlunoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const aluno = await prisma.aluno.findUnique({ where: { id: Number(id) } });
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado.' });
    res.json(aluno);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar aluno.' });
  }
};

export const updateAluno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, email, cpf } = req.body;
    const aluno = await prisma.aluno.update({
      where: { id: Number(id) },
      data: { nome, sobrenome, email, cpf },
    });
    res.json(aluno);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email ou CPF já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar aluno.' });
  }
};

export const deleteAluno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.aluno.update({
      where: { id: Number(id) },
      data: { ativo: false }
    });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro ao desativar aluno.' });
  }
};

export const reativarAluno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const aluno = await prisma.aluno.update({
      where: { id: Number(id) },
      data: { ativo: true }
    });
    res.json(aluno);
  } catch {
    res.status(500).json({ error: 'Erro ao reativar aluno.' });
  }
};

export const reativarAlunos = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Lista de IDs é obrigatória.' });
    }
    
    const result = await prisma.aluno.updateMany({
      where: { 
        id: { in: ids.map(id => Number(id)) },
        ativo: false
      },
      data: { ativo: true }
    });
    
    res.json({ message: `${result.count} aluno(s) reativado(s) com sucesso.` });
  } catch {
    res.status(500).json({ error: 'Erro ao reativar alunos.' });
  }
};

// CRUD para matrícula (TurmaAluno)
export const matricularAluno = async (req: Request, res: Response) => {
  try {
    const { turmaId, alunoId } = req.body;
    const matricula = await prisma.turmaAluno.create({
      data: { turmaId, alunoId },
    });
    res.status(201).json(matricula);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Aluno já matriculado nesta turma.' });
    }
    res.status(500).json({ error: 'Erro ao matricular aluno.' });
  }
};

export const desmatricularAluno = async (req: Request, res: Response) => {
  try {
    const { turmaId, alunoId } = req.body;
    await prisma.turmaAluno.delete({
      where: { turmaId_alunoId: { turmaId, alunoId } },
    });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro ao desmatricular aluno.' });
  }
};

export const getAlunosDaTurma = async (req: Request, res: Response) => {
  try {
    const { turmaId } = req.params;
    const alunos = await prisma.turmaAluno.findMany({
      where: { turmaId: Number(turmaId) },
      include: { aluno: true },
    });
    res.json(alunos.map((m) => m.aluno));
  } catch {
    res.status(500).json({ error: 'Erro ao buscar alunos da turma.' });
  }
};

export const getTurmasDoAluno = async (req: Request, res: Response) => {
  try {
    const { alunoId } = req.params;
    const turmas = await prisma.turmaAluno.findMany({
      where: { alunoId: Number(alunoId) },
      include: { turma: true },
    });
    res.json(turmas.map((m) => m.turma));
  } catch {
    res.status(500).json({ error: 'Erro ao buscar turmas do aluno.' });
  }
};
