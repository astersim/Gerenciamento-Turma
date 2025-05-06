/*
  Warnings:

  - Added the required column `salaId` to the `Turma` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turma" ADD COLUMN     "salaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Sala" (
    "id" SERIAL NOT NULL,
    "local" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
