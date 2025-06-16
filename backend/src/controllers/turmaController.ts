import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getTurmas = async (req: Request, res: Response) => {
  try {
    const { ativo, search, orderBy1, orderBy2, orderDir1 = 'asc', orderDir2 = 'asc' } = req.query;
    const where: any = {};
    if (ativo !== undefined) where.ativo = ativo === 'true';
    if (search) {
      where.OR = [
        { nome: { contains: String(search), mode: 'insensitive' } },
        { codigo: { contains: String(search), mode: 'insensitive' } }
      ];
    }
    const orderBy: any[] = [];
    if (orderBy1) orderBy.push({ [orderBy1 as string]: orderDir1 });
    if (orderBy2) orderBy.push({ [orderBy2 as string]: orderDir2 });    const turmas = await prisma.turma.findMany({
      where,
      orderBy: orderBy.length ? orderBy : undefined,
      include: { disciplina: true, professor: true, sala: true }
    });
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar turmas" });
  }
};

export const getTurmaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const turma = await prisma.turma.findUnique({
      where: { id: Number(id) },      include: {
        disciplina: true,
        professor: true,
        sala: true
      }
    });
    
    if (!turma) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    res.json(turma);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar turma" });
  }
};

export const createTurma = async (req: Request, res: Response) => {
  try {
    const { nome, diaSemana, horarioInicio, horarioTermino, codigo, disciplinaId, professorId, salaId } = req.body;
    if (!nome || !diaSemana || !horarioInicio || !horarioTermino || !disciplinaId || !professorId || !salaId) {
      return res.status(400).json({ error: 'Nome, dia da semana, horário de início, horário de término, disciplina, professor e sala são obrigatórios.' });
    }
    // Verifica se a disciplina existe
    const disciplina = await prisma.disciplina.findUnique({ where: { id: Number(disciplinaId) } });
    if (!disciplina) {
      return res.status(400).json({ error: 'Disciplina não encontrada' });
    }
    // Verifica se o professor existe
    const professor = await prisma.professor.findUnique({ where: { id: Number(professorId) } });
    if (!professor) {
      return res.status(400).json({ error: 'Professor não encontrado' });
    }
    if (!professor.ativo) {
      return res.status(400).json({ error: 'Este professor está desativado' });
    }
    // Verifica se a sala existe
    const sala = await prisma.sala.findUnique({ where: { id: Number(salaId) } });
    if (!sala) {
      return res.status(400).json({ error: 'Sala não encontrada' });
    }
    if (!sala.ativo) {
      return res.status(400).json({ error: 'Esta sala está desativada' });
    }
    const turma = await prisma.turma.create({
      data: { nome, diaSemana, horarioInicio, horarioTermino, codigo, disciplinaId, professorId, salaId, ativo: true }
    });
    res.status(201).json(turma);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar turma" });
  }
};

export const updateTurma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, diaSemana, horarioInicio, horarioTermino, codigo, disciplinaId, professorId, salaId } = req.body;
    if (!nome || !diaSemana || !horarioInicio || !horarioTermino || !disciplinaId || !professorId || !salaId) {
      return res.status(400).json({ error: 'Nome, dia da semana, horário de início, horário de término, disciplina, professor e sala são obrigatórios.' });
    }
    // Verifica se a turma existe
    const existingTurma = await prisma.turma.findUnique({ where: { id: Number(id) } });
    if (!existingTurma) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    // Verifica se a disciplina existe
    const disciplina = await prisma.disciplina.findUnique({ where: { id: Number(disciplinaId) } });
    if (!disciplina) {
      return res.status(400).json({ error: 'Disciplina não encontrada' });
    }
    // Verifica se o professor existe
    const professor = await prisma.professor.findUnique({ where: { id: Number(professorId) } });
    if (!professor) {
      return res.status(400).json({ error: 'Professor não encontrado' });
    }
    if (!professor.ativo) {
      return res.status(400).json({ error: 'Este professor está desativado' });
    }
    // Verifica se a sala existe e está ativa
    const sala = await prisma.sala.findUnique({ where: { id: Number(salaId) } });
    if (!sala) {
      return res.status(400).json({ error: 'Sala não encontrada' });
    }
    if (!sala.ativo) {
      return res.status(400).json({ error: 'Esta sala está desativada' });
    }
    const turma = await prisma.turma.update({
      where: { id: Number(id) },
      data: { nome, diaSemana, horarioInicio, horarioTermino, codigo, disciplinaId, professorId, salaId }
    });
    res.json(turma);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar turma" });
  }
};

export const deleteTurma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.turma.update({
      where: { id: Number(id) },
      data: { ativo: false }
    });
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Erro ao desativar turma" });
  }
};

export const reativarTurma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Obtém a turma para verificar a sala
    const turma = await prisma.turma.findUnique({
      where: { id: Number(id) },
      include: { sala: true }
    });
    
    if (!turma) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Verifica se a sala está ativa
    if (!turma.sala.ativo) {
      return res.status(400).json({ 
        error: 'Não é possível reativar a turma pois a sala associada está desativada' 
      });
    }
    
    const updatedTurma = await prisma.turma.update({
      where: { id: Number(id) },
      data: { ativo: true }
    });
    
    res.json(updatedTurma);
  } catch (error) {
    res.status(500).json({ error: "Erro ao reativar turma" });
  }
};