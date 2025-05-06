import { Router } from 'express';
import {
  getSalas,
  getSalaById,
  createSala,
  updateSala,
  deleteSala,
  reativarSala
} from '../controllers/salaController';

const router = Router();

router.get('/', getSalas);
router.get('/:id', getSalaById);
router.post('/', createSala);
router.put('/:id', updateSala);
router.delete('/:id', deleteSala);
router.patch('/:id/reativar', reativarSala);

export default router;