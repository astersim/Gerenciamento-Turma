import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Página Inicial
import HomePage from './pages/Home/HomePage';

// Páginas de Disciplinas
import ListaDisciplinas from './pages/Disciplinas/ListaDisciplinas';
import FormDisciplina from './pages/Disciplinas/FormDisciplina';
import ReativarDisciplinas from './pages/Disciplinas/ReativarDisciplinas';

// Páginas de Professores
import ListaProfessores from './pages/Professores/ListaProfessores';
import FormProfessor from './pages/Professores/FormProfessor';
import ReativarProfessores from './pages/Professores/ReativarProfessores';

// Páginas de Salas
import ListaSalas from './pages/Salas/ListaSalas';
import FormSala from './pages/Salas/FormSala';
import ReativarSalas from './pages/Salas/ReativarSalas';

// Páginas de Turmas
import ListaTurmas from './pages/Turmas/ListaTurmas';
import FormTurma from './pages/Turmas/FormTurma';
import ReativarTurmas from './pages/Turmas/ReativarTurmas';
import GerenciarAlunosTurma from './pages/Turmas/GerenciarAlunosTurma';

// Páginas de Alunos
import AlunosPage from './pages/Alunos/AlunosPage';
import ReativarAlunos from './pages/Alunos/ReativarAlunos';

// Páginas de Matrículas
import MatriculasPage from './pages/Matriculas/MatriculasPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota padrão para Home */}
        <Route path="/" element={<HomePage />} />

        {/* Rotas de Disciplinas */}
        <Route path="/disciplinas" element={<ListaDisciplinas />} />
        <Route path="/disciplinas/novo" element={<FormDisciplina />} />
        <Route path="/disciplinas/editar/:id" element={<FormDisciplina />} />
        <Route path="/disciplinas/reativar" element={<ReativarDisciplinas />} />

        {/* Rotas de Professores */}
        <Route path="/professores" element={<ListaProfessores />} />
        <Route path="/professores/novo" element={<FormProfessor />} />
        <Route path="/professores/editar/:id" element={<FormProfessor />} />
        <Route path="/professores/reativar" element={<ReativarProfessores />} />

        {/* Rotas de Salas */}
        <Route path="/salas" element={<ListaSalas />} />
        <Route path="/salas/novo" element={<FormSala />} />
        <Route path="/salas/editar/:id" element={<FormSala />} />
        <Route path="/salas/reativar" element={<ReativarSalas />} />        {/* Rotas de Turmas */}
        <Route path="/turmas" element={<ListaTurmas />} />
        <Route path="/turmas/novo" element={<FormTurma />} />
        <Route path="/turmas/editar/:id" element={<FormTurma />} />
        <Route path="/turmas/reativar" element={<ReativarTurmas />} />
        <Route path="/turmas/:id/alunos" element={<GerenciarAlunosTurma />} />{/* Rota de Alunos */}
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/alunos/reativar" element={<ReativarAlunos />} />

        {/* Rota de Matrículas */}
        <Route path="/matriculas" element={<MatriculasPage />} />
      </Routes>
    </Router>
  );
};

export default App;