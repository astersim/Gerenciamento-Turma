import { Router } from 'express';
import disciplinaRoutes from './disciplina';
import professorRoutes from './professor';
import turmaRoutes from './turma';
import salaRoutes from './sala';
import alunoRoutes from './aluno';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'gerenciamento-turma-backend'
  });
});

router.use('/disciplinas', disciplinaRoutes);
router.use('/professores', professorRoutes);
router.use('/turmas', turmaRoutes);
router.use('/salas', salaRoutes);
router.use('/alunos', alunoRoutes);

export default router;