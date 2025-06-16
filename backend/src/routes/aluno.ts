import { Router } from 'express';
import {
  createAluno,
  getAlunos,
  getAlunoById,
  updateAluno,
  deleteAluno,
  reativarAluno,
  reativarAlunos,
  matricularAluno,
  desmatricularAluno,
  getAlunosDaTurma,
  getTurmasDoAluno
} from '../controllers/alunoController';

const router = Router();

// Aluno CRUD
router.post('/', createAluno);
router.get('/', getAlunos);
router.get('/:id', getAlunoById);
router.put('/:id', updateAluno);
router.delete('/:id', deleteAluno);

// Reativação
router.patch('/:id/reativar', reativarAluno);
router.patch('/reativar', reativarAlunos);

// Matrícula (TurmaAluno)
router.post('/matricular', matricularAluno);
router.post('/desmatricular', desmatricularAluno);
router.get('/turma/:turmaId', getAlunosDaTurma);
router.get('/aluno/:alunoId/turmas', getTurmasDoAluno);

export default router;
