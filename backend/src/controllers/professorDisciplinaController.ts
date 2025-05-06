import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getProfessorDisciplinas = async (_req: Request, res: Response) => {
  try {
    const professorDisciplinas = await prisma.professorDisciplina.findMany({
      include: {
        professor: true,
        disciplina: true
      }
    });
    res.json(professorDisciplinas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar relações professor-disciplina" });
  }
};

export const createProfessorDisciplina = async (req: Request, res: Response) => {
  try {
    const { professorId, disciplinaId } = req.body;
    
    // Verifica se professor e disciplina existem
    const professor = await prisma.professor.findUnique({
      where: { id: Number(professorId) }
    });
    
    if (!professor) {
      return res.status(400).json({ error: 'Professor não encontrado' });
    }
    
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: Number(disciplinaId) }
    });
    
    if (!disciplina) {
      return res.status(400).json({ error: 'Disciplina não encontrada' });
    }
    
    // Verifica se a relação já existe
    const existingRelation = await prisma.professorDisciplina.findFirst({
      where: {
        professorId: Number(professorId),
        disciplinaId: Number(disciplinaId)
      }
    });
    
    if (existingRelation) {
      return res.status(400).json({ error: 'Esta relação já existe' });
    }
    
    const professorDisciplina = await prisma.professorDisciplina.create({
      data: {
        professorId: Number(professorId),
        disciplinaId: Number(disciplinaId)
      },
      include: {
        professor: true,
        disciplina: true
      }
    });
    
    res.status(201).json(professorDisciplina);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar relação professor-disciplina" });
  }
};

export const deleteProfessorDisciplina = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verifica se a relação existe
    const professorDisciplina = await prisma.professorDisciplina.findUnique({
      where: { id: Number(id) }
    });
    
    if (!professorDisciplina) {
      return res.status(404).json({ error: 'Relação não encontrada' });
    }
    
    await prisma.professorDisciplina.delete({
      where: { id: Number(id) }
    });
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar relação professor-disciplina" });
  }
};