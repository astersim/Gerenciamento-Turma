import React, { useState, useEffect } from 'react';
import { Aluno, Turma } from '../../types';
import { getAlunos, matricularAluno } from '../../services/alunoService';
import { getTurmas } from '../../services/turmaService';

interface Props {
  onSave: () => void;
  onCancel: () => void;
}

const FormMatricula: React.FC<Props> = ({ onSave, onCancel }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoadingData(true);
        const [alunosData, turmasData] = await Promise.all([
          getAlunos({ ativo: true }), // Apenas alunos ativos
          getTurmas({ ativo: true })  // Apenas turmas ativas
        ]);
        setAlunos(alunosData);
        setTurmas(turmasData);
      } catch (err) {
        setError('Erro ao carregar dados.');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    carregarDados();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!alunoId || !turmaId) {
      setError('Selecione um aluno e uma turma.');
      return;
    }
    
    setLoading(true);
    try {
      await matricularAluno(turmaId, alunoId);
      alert('Aluno matriculado com sucesso!');
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao matricular aluno.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Nova Matrícula</h3>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="aluno" className="form-label">Aluno</label>
                <select
                  id="aluno"
                  className="form-select"
                  value={alunoId || ''}
                  onChange={e => setAlunoId(e.target.value ? Number(e.target.value) : null)}
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome} {aluno.sobrenome} - {aluno.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="turma" className="form-label">Turma</label>
                <select
                  id="turma"
                  className="form-select"
                  value={turmaId || ''}
                  onChange={e => setTurmaId(e.target.value ? Number(e.target.value) : null)}
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>
                      {turma.codigo} - {turma.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Matriculando...' : 'Matricular'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormMatricula;
