import { Router } from 'express';
import disciplinaRoutes from './disciplina';
import professorRoutes from './professor';
import turmaRoutes from './turma';
import professorDisciplinaRoutes from './professorDisciplina';
import salaRoutes from './sala';

const router = Router();
router.use('/disciplinas', disciplinaRoutes);
router.use('/professores', professorRoutes);
router.use('/turmas', turmaRoutes);
router.use('/professor-disciplinas', professorDisciplinaRoutes);
router.use('/salas', salaRoutes);

export default router;