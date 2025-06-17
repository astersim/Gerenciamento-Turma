-- Script de inicialização do banco de dados
-- Este arquivo será executado automaticamente quando o PostgreSQL iniciar

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar índices para otimização (serão criados após as migrações do Prisma)
-- Os índices serão criados automaticamente pelo Prisma quando as tabelas existirem
