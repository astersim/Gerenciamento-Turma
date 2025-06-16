import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

// Função para validar CPF (formato e dígito)
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[\.-]/g, '');
  if (!cpf || cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

export const getProfessores = async (req: Request, res: Response) => {
  try {
    const { status, orderBy1, orderBy2, orderDir1 = 'asc', orderDir2 = 'asc', search } = req.query;
    const where: any = {};
    if (status !== undefined) where.ativo = status === 'true';
    if (search) {
      where.OR = [
        { nome: { contains: String(search), mode: 'insensitive' } },
        { cpf: { contains: String(search), mode: 'insensitive' } },
        { titulacao: { contains: String(search), mode: 'insensitive' } }
      ];
    }
    const orderBy: any[] = [];
    if (orderBy1) orderBy.push({ [orderBy1 as string]: orderDir1 });
    if (orderBy2) orderBy.push({ [orderBy2 as string]: orderDir2 });    const professores = await prisma.professor.findMany({
      where,
      orderBy: orderBy.length ? orderBy : undefined
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
      where: { id: Number(id) }
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
    const { nome, cpf, titulacao } = req.body;
    if (!nome || !cpf || !titulacao) {
      return res.status(400).json({ error: 'Nome, CPF e titulação são obrigatórios.' });
    }
    if (!validarCPF(cpf)) {
      return res.status(400).json({ error: 'CPF inválido.' });
    }
    const exists = await prisma.professor.findUnique({ where: { cpf } });
    if (exists) {
      return res.status(400).json({ error: 'CPF já cadastrado.' });
    }
    const professor = await prisma.professor.create({
      data: {
        nome,
        cpf,
        titulacao,
        ativo: true
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
    const { nome, cpf, titulacao } = req.body;
    if (!nome || !cpf || !titulacao) {
      return res.status(400).json({ error: 'Nome, CPF e titulação são obrigatórios.' });
    }
    if (!validarCPF(cpf)) {
      return res.status(400).json({ error: 'CPF inválido.' });
    }
    const existingProfessor = await prisma.professor.findUnique({ where: { id: Number(id) }, select: { cpf: true } as any });
    if (!existingProfessor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    if (cpf !== existingProfessor.cpf) {
      const exists = await prisma.professor.findUnique({ where: { cpf } });
      if (exists) {
        return res.status(400).json({ error: 'CPF já cadastrado.' });
      }
    }
    const updatedProfessor = await prisma.professor.update({
      where: { id: Number(id) },
      data: { nome, cpf, titulacao }
    });
    res.json(updatedProfessor);
  } catch (error) {
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