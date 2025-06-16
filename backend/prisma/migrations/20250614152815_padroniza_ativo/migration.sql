/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Disciplina` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Disciplina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodo` to the `Disciplina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulacao` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacidade` to the `Sala` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Sala` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diaSemana` to the `Turma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarioInicio` to the `Turma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarioTermino` to the `Turma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Turma` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disciplina" ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "periodo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "titulacao" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sala" ADD COLUMN     "capacidade" INTEGER NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Turma" ADD COLUMN     "diaSemana" TEXT NOT NULL,
ADD COLUMN     "horarioInicio" TEXT NOT NULL,
ADD COLUMN     "horarioTermino" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ALTER COLUMN "codigo" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_codigo_key" ON "Disciplina"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_cpf_key" ON "Professor"("cpf");
