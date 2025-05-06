import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getSalas = async (req: Request, res: Response) => {
  try {
    const { ativo } = req.query;
    
    const where = ativo !== undefined ? { ativo: ativo === 'true' } : {};
    
    const salas = await prisma.sala.findMany({
      where,
      include: {
        turmas: true
      }
    });
    res.json(salas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar salas" });
  }
};

export const getSalaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sala = await prisma.sala.findUnique({
      where: { id: Number(id) },
      include: {
        turmas: true
      }
    });
    
    if (!sala) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }
    
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar sala" });
  }
};

export const createSala = async (req: Request, res: Response) => {
  try {
    const { local } = req.body;
    
    const sala = await prisma.sala.create({
      data: {
        local,
        ativo: true
      }
    });
    
    res.status(201).json(sala);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar sala" });
  }
};

export const updateSala = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { local } = req.body;
    
    const sala = await prisma.sala.update({
      where: { id: Number(id) },
      data: { local }
    });
    
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar sala" });
  }
};

export const deleteSala = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verifica se há turmas usando esta sala
    const turmasCount = await prisma.turma.count({
      where: { 
        salaId: Number(id),
        ativo: true
      }
    });
    
    if (turmasCount > 0) {
      return res.status(400).json({ 
        error: "Não é possível desativar esta sala pois existem turmas ativas associadas a ela" 
      });
    }
    
    await prisma.sala.update({
      where: { id: Number(id) },
      data: { ativo: false }
    });
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Erro ao desativar sala" });
  }
};

export const reativarSala = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const sala = await prisma.sala.update({
      where: { id: Number(id) },
      data: { ativo: true }
    });
    
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: "Erro ao reativar sala" });
  }
};