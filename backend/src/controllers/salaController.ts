import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getSalas = async (req: Request, res: Response) => {
  try {
    const { ativo, search, orderBy1, orderBy2, orderDir1 = 'asc', orderDir2 = 'asc' } = req.query;
    const where: any = {};
    if (ativo !== undefined) where.ativo = ativo === 'true';
    if (search) {
      where.OR = [
        { nome: { contains: String(search), mode: 'insensitive' } },
        { local: { contains: String(search), mode: 'insensitive' } }
      ];
    }
    const orderBy: any[] = [];
    if (orderBy1) orderBy.push({ [orderBy1 as string]: orderDir1 });
    if (orderBy2) orderBy.push({ [orderBy2 as string]: orderDir2 });
    const salas = await prisma.sala.findMany({
      where,
      orderBy: orderBy.length ? orderBy : undefined,
      include: { turmas: true }
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
    const { nome, local, capacidade } = req.body;
    if (!nome || !local || capacidade === undefined) {
      return res.status(400).json({ error: 'Nome, local e capacidade são obrigatórios.' });
    }
    if (typeof capacidade !== 'number' || capacidade <= 0) {
      return res.status(400).json({ error: 'Capacidade deve ser um número positivo.' });
    }
    const sala = await prisma.sala.create({
      data: { nome, local, capacidade, ativo: true }
    });
    res.status(201).json(sala);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar sala" });
  }
};

export const updateSala = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, local, capacidade } = req.body;
    if (!nome || !local || capacidade === undefined) {
      return res.status(400).json({ error: 'Nome, local e capacidade são obrigatórios.' });
    }
    if (typeof capacidade !== 'number' || capacidade <= 0) {
      return res.status(400).json({ error: 'Capacidade deve ser um número positivo.' });
    }
    const sala = await prisma.sala.update({
      where: { id: Number(id) },
      data: { nome, local, capacidade }
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