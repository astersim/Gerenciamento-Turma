import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDisciplinas = async (req: Request, res: Response) => {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      orderBy: {
        nome: 'asc'
      }
    });

    return res.json(disciplinas);
  } catch (error) {
    console.error('Error fetching disciplinas:', error);
    return res.status(500).json({
      error: 'Erro interno ao buscar disciplinas',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const getDisciplinaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: Number(id) }
    });

    if (!disciplina) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }

    return res.json(disciplina);
  } catch (error) {
    console.error('Error fetching disciplina:', error);
    return res.status(500).json({
      error: 'Erro interno ao buscar disciplina',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const createDisciplina = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    const disciplina = await prisma.disciplina.create({
      data: { nome, ativo: true }
    });
    res.json(disciplina);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar disciplina" });
  }
};

export const updateDisciplina = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    const disciplina = await prisma.disciplina.update({
      where: { id: Number(id) },
      data: { nome }
    });
    res.json(disciplina);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar disciplina" });
  }
};

export const deleteDisciplina = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.disciplina.update({
      where: { id: Number(id) },
      data: { ativo: false }
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Erro ao desativar disciplina" });
  }
};

export const reativarDisciplina = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const disciplina = await prisma.disciplina.update({
      where: { id: Number(id) },
      data: { ativo: true }
    });
    res.json(disciplina);
  } catch (error) {
    res.status(500).json({ error: "Erro ao reativar disciplina" });
  }
};