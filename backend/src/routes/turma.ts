import { Router } from 'express';
import {
  getTurmas,
  getTurmaById,
  createTurma,
  updateTurma,
  deleteTurma,
  reativarTurma
} from '../controllers/turmaController';

const router = Router();

router.get('/', getTurmas);
router.get('/:id', getTurmaById);
router.post('/', createTurma);
router.put('/:id', updateTurma);
router.delete('/:id', deleteTurma);
router.patch('/:id/reativar', reativarTurma);

export default router;