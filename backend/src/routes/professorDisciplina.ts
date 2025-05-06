import { Router } from 'express';
import {
  getProfessorDisciplinas,
  createProfessorDisciplina,
  deleteProfessorDisciplina
} from '../controllers/professorDisciplinaController';

const router = Router();

router.get('/', getProfessorDisciplinas);
router.post('/', createProfessorDisciplina);
router.delete('/:id', deleteProfessorDisciplina);

export default router;