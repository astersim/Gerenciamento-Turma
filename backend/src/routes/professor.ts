import { Router } from 'express';
import {
  getProfessores,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  reativarProfessor
} from '../controllers/professorController';

const router = Router();

router.get('/', getProfessores);
router.get('/:id', getProfessorById);
router.post('/', createProfessor);
router.put('/:id', updateProfessor);
router.delete('/:id', deleteProfessor);
router.patch('/:id/reativar', reativarProfessor);

export default router;