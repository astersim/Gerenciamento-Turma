import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getDisciplinas = async (_req: Request, res: Response) => {
  try {
    const disciplinas = await prisma.disciplina.findMany();
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar disciplinas" });
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