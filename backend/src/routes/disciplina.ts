import { Router } from 'express';
import {
  getDisciplinas,
  createDisciplina,
  updateDisciplina,
  deleteDisciplina,
  reativarDisciplina
} from '../controllers/disciplinaController';

const router = Router();

router.get('/', getDisciplinas);
router.post('/', createDisciplina);
router.put('/:id', updateDisciplina);
router.delete('/:id', deleteDisciplina);
router.patch('/:id/reativar', reativarDisciplina);

export default router;