import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export const getTurmas = async (req: Request, res: Response) => {
  try {
    const { ativo } = req.query;
    
    const where = ativo !== undefined ? { ativo: ativo === 'true' } : {};
    
    const turmas = await prisma.turma.findMany({
      where,
      include: {
        disciplina: true,
        sala: true
      }
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
      where: { id: Number(id) },
      include: {
        disciplina: true,
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
    const { codigo, disciplinaId, salaId } = req.body;
    
    // Verifica se a disciplina existe
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: Number(disciplinaId) }
    });
    
    if (!disciplina) {
      return res.status(400).json({ error: 'Disciplina não encontrada' });
    }
    
    // Verifica se a sala existe
    const sala = await prisma.sala.findUnique({
      where: { id: Number(salaId) }
    });
    
    if (!sala) {
      return res.status(400).json({ error: 'Sala não encontrada' });
    }
    
    // Verifica se a sala está ativa
    if (!sala.ativo) {
      return res.status(400).json({ error: 'Esta sala está desativada' });
    }
    
    const turma = await prisma.turma.create({
      data: {
        codigo,
        disciplinaId: Number(disciplinaId),
        salaId: Number(salaId),
        ativo: true
      },
      include: {
        disciplina: true,
        sala: true
      }
    });
    
    res.status(201).json(turma);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar turma" });
  }
};

export const updateTurma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { codigo, disciplinaId, salaId } = req.body;
    
    // Verifica se a turma existe
    const existingTurma = await prisma.turma.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingTurma) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    
    // Dados para atualização
    const updateData: any = {};
    
    // Atualiza código se fornecido
    if (codigo !== undefined) {
      updateData.codigo = codigo;
    }
    
    // Se um disciplinaId foi fornecido, verifica se a disciplina existe
    if (disciplinaId !== undefined) {
      const disciplina = await prisma.disciplina.findUnique({
        where: { id: Number(disciplinaId) }
      });
      
      if (!disciplina) {
        return res.status(400).json({ error: 'Disciplina não encontrada' });
      }
      
      updateData.disciplinaId = Number(disciplinaId);
    }
    
    // Se um salaId foi fornecido, verifica se a sala existe e está ativa
    if (salaId !== undefined) {
      const sala = await prisma.sala.findUnique({
        where: { id: Number(salaId) }
      });
      
      if (!sala) {
        return res.status(400).json({ error: 'Sala não encontrada' });
      }
      
      if (!sala.ativo) {
        return res.status(400).json({ error: 'Esta sala está desativada' });
      }
      
      updateData.salaId = Number(salaId);
    }
    
    const turma = await prisma.turma.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        disciplina: true,
        sala: true
      }
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
      data: { ativo: true },
      include: {
        disciplina: true,
        sala: true
      }
    });
    
    res.json(updatedTurma);
  } catch (error) {
    res.status(500).json({ error: "Erro ao reativar turma" });
  }
};