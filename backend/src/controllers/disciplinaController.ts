import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function validarCodigo(codigo: string) {
  // Letras e números, até 10 caracteres
  return /^[A-Za-z0-9]{1,10}$/.test(codigo);
}

export const getDisciplinas = async (req: Request, res: Response) => {
  try {
    const { ativo, orderBy1, orderBy2, orderDir1 = 'asc', orderDir2 = 'asc', search } = req.query;
    const where: any = {};
    if (ativo !== undefined) where.ativo = ativo === 'true';
    if (search) {
      where.OR = [
        { nome: { contains: String(search), mode: 'insensitive' } },
        { codigo: { contains: String(search), mode: 'insensitive' } },
        { periodo: { contains: String(search), mode: 'insensitive' } }
      ];
    }
    const orderBy: any[] = [];
    if (orderBy1) orderBy.push({ [orderBy1 as string]: orderDir1 });
    if (orderBy2) orderBy.push({ [orderBy2 as string]: orderDir2 });
    const disciplinas = await prisma.disciplina.findMany({
      where,
      orderBy: orderBy.length ? orderBy : undefined
    });
    res.json(disciplinas);
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
    const { nome, codigo, periodo } = req.body;
    if (!nome || !codigo || !periodo) {
      return res.status(400).json({ error: 'Nome, código e período são obrigatórios.' });
    }
    if (!validarCodigo(codigo)) {
      return res.status(400).json({ error: 'Código deve conter apenas letras e números e até 10 caracteres.' });
    }
    // Busca disciplina por código usando findFirst (compatibilidade)
    const exists = await prisma.disciplina.findFirst({ where: { codigo } });
    if (exists) {
      return res.status(400).json({ error: 'Código já cadastrado.' });
    }
    const disciplina = await prisma.disciplina.create({
      data: { nome, codigo, periodo, ativo: true }
    });
    res.status(201).json(disciplina);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar disciplina" });
  }
};

export const updateDisciplina = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, codigo, periodo } = req.body;
    if (!nome || !codigo || !periodo) {
      return res.status(400).json({ error: 'Nome, código e período são obrigatórios.' });
    }
    if (!validarCodigo(codigo)) {
      return res.status(400).json({ error: 'Código deve conter apenas letras e números e até 10 caracteres.' });
    }
    // Busca o registro completo para garantir acesso ao campo codigo
    const existing = await prisma.disciplina.findFirst({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    if (codigo !== existing.codigo) {
      const exists = await prisma.disciplina.findFirst({ where: { codigo } });
      if (exists) {
        return res.status(400).json({ error: 'Código já cadastrado.' });
      }
    }
    const disciplina = await prisma.disciplina.update({
      where: { id: Number(id) },
      data: { nome, codigo, periodo }
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