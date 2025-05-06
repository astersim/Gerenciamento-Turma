import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initDatabase = async () => {
  try {
    console.log('Conectando ao banco de dados...');
    
    const count = await prisma.disciplina.count();
    console.log(`Conexão bem-sucedida. Tabela "disciplinas" contém ${count} registros.`);
    
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
};

initDatabase();