import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Página Inicial
import HomePage from './pages/Home/Homepage';

// Páginas de Disciplinas
import ListaDisciplinas from './pages/Disciplinas/ListaDisciplinas';
import FormDisciplina from './pages/Disciplinas/FormDisciplina';

// Páginas de Professores
import ListaProfessores from './pages/Professores/ListaProfessores';
import FormProfessor from './pages/Professores/FormProfessor';

// Páginas de Salas
import ListaSalas from './pages/Salas/ListaSalas';
import FormSala from './pages/Salas/FormSala';

// Páginas de Turmas
import ListaTurmas from './pages/Turmas/ListaTurmas';
import FormTurma from './pages/Turmas/FormTurma';

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

        {/* Rotas de Professores */}
        <Route path="/professores" element={<ListaProfessores />} />
        <Route path="/professores/novo" element={<FormProfessor />} />
        <Route path="/professores/editar/:id" element={<FormProfessor />} />

        {/* Rotas de Salas */}
        <Route path="/salas" element={<ListaSalas />} />
        <Route path="/salas/novo" element={<FormSala />} />
        <Route path="/salas/editar/:id" element={<FormSala />} />

        {/* Rotas de Turmas */}
        <Route path="/turmas" element={<ListaTurmas />} />
        <Route path="/turmas/novo" element={<FormTurma />} />
        <Route path="/turmas/editar/:id" element={<FormTurma />} />
      </Routes>
    </Router>
  );
};

export default App;