-- CreateTable
CREATE TABLE "professores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplinas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salas" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "bloco" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "salaId" INTEGER NOT NULL,
    "professorId" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_disciplina" (
    "id" SERIAL NOT NULL,
    "professorId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,

    CONSTRAINT "professor_disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professores_email_key" ON "professores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "professor_disciplina_professorId_disciplinaId_key" ON "professor_disciplina"("professorId", "disciplinaId");

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_disciplina" ADD CONSTRAINT "professor_disciplina_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_disciplina" ADD CONSTRAINT "professor_disciplina_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
