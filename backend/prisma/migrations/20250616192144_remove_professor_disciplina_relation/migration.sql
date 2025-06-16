/*
  Warnings:

  - You are about to drop the `ProfessorDisciplina` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `professorId` to the `Turma` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProfessorDisciplina" DROP CONSTRAINT "ProfessorDisciplina_disciplinaId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorDisciplina" DROP CONSTRAINT "ProfessorDisciplina_professorId_fkey";

-- AlterTable
ALTER TABLE "Turma" ADD COLUMN     "professorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProfessorDisciplina";

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
