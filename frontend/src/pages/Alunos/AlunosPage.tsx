import React, { useState } from 'react';
import ListaAlunos from './ListaAlunos';
import FormAluno from './FormAluno';
import { Aluno } from '../../types';
import Layout from '../../components/Layout/Layout';

const AlunosPage: React.FC = () => {
  const [alunoEdit, setAlunoEdit] = useState<Aluno | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (aluno: Aluno) => {
    setAlunoEdit(aluno);
    setShowForm(true);
  };

  const handleNew = () => {
    setAlunoEdit(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setAlunoEdit(null);
    setRefresh(r => !r);
  };

  const handleCancel = () => {
    setShowForm(false);
    setAlunoEdit(null);
  };  return (
    <Layout>
      <h1>Alunos</h1>      {showForm ? (
        <FormAluno alunoEdit={alunoEdit} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ListaAlunos key={String(refresh)} onEdit={handleEdit} onNew={handleNew} />
      )}
    </Layout>
  );
};

export default AlunosPage;
