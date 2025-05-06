import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getProfessores = async (req: Request, res: Response) => {
  try {
    const { ativo } = req.query;
    
    const where = ativo !== undefined ? { ativo: ativo === 'true' } : {};
    
    const professores = await prisma.professor.findMany({
      where,
      include: {
        disciplinas: {
          include: {
            disciplina: true
          }
        }
      }
    });
    res.json(professores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar professores" });
  }
};

export const getProfessorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professor = await prisma.professor.findUnique({
      where: { id: Number(id) },
      include: {
        disciplinas: {
          include: {
            disciplina: true
          }
        }
      }
    });
    
    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar professor" });
  }
};

export const createProfessor = async (req: Request, res: Response) => {
  try {
    const { nome, disciplinaIds } = req.body;
    
    const professor = await prisma.professor.create({
      data: {
        nome,
        ativo: true,
        disciplinas: {
          create: disciplinaIds?.map((disciplinaId: number) => ({
            disciplina: {
              connect: { id: disciplinaId }
            }
          })) || []
        }
      },
      include: {
        disciplinas: {
          include: {
            disciplina: true
          }
        }
      }
    });
    
    res.status(201).json(professor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar professor" });
  }
};

export const updateProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, disciplinaIds } = req.body;
    
    // Primeiro, busca o professor para verificar se existe
    const existingProfessor = await prisma.professor.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingProfessor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    
    // Atualiza o nome do professor
    const professor = await prisma.professor.update({
      where: { id: Number(id) },
      data: { nome }
    });
    
    // Se disciplinaIds foi fornecido, atualiza as disciplinas
    if (disciplinaIds) {
      // Remove todas as associações existentes
      await prisma.professorDisciplina.deleteMany({
        where: { professorId: Number(id) }
      });
      
      // Adiciona as novas associações
      await Promise.all(
        disciplinaIds.map((disciplinaId: number) =>
          prisma.professorDisciplina.create({
            data: {
              professorId: Number(id),
              disciplinaId
            }
          })
        )
      );
    }
    
    // Busca o professor atualizado com suas disciplinas
    const updatedProfessor = await prisma.professor.findUnique({
      where: { id: Number(id) },
      include: {
        disciplinas: {
          include: {
            disciplina: true
          }
        }
      }
    });
    
    res.json(updatedProfessor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar professor" });
  }
};

export const deleteProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.professor.update({
      where: { id: Number(id) },
      data: { ativo: false }
    });
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Erro ao desativar professor" });
  }
};

export const reativarProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const professor = await prisma.professor.update({
      where: { id: Number(id) },
      data: { ativo: true }
    });
    
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao reativar professor" });
  }
};