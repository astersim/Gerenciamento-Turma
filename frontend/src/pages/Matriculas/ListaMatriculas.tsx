import React, { useState, useEffect } from 'react';
import { Turma, Aluno } from '../../types';
import { getTurmas } from '../../services/turmaService';
import { getAlunosDaTurma, desmatricularAluno } from '../../services/alunoService';

interface Props {
  onNew: () => void;
  refreshTrigger: number;
}

const ListaMatriculas: React.FC<Props> = ({ onNew, refreshTrigger }) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [alunosDaTurma, setAlunosDaTurma] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      const data = await getTurmas({ ativo: true });
      setTurmas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar turmas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarAlunosDaTurma = async (turmaId: number) => {
    try {
      setLoadingAlunos(true);
      const data = await getAlunosDaTurma(turmaId);
      setAlunosDaTurma(data);
    } catch (err) {
      setError('Erro ao carregar alunos da turma.');
      console.error(err);
    } finally {
      setLoadingAlunos(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, [refreshTrigger]);

  useEffect(() => {
    if (turmaSelecionada) {
      carregarAlunosDaTurma(turmaSelecionada);
    } else {
      setAlunosDaTurma([]);
    }
  }, [turmaSelecionada]);

  const handleDesmatricular = async (alunoId: number) => {
    if (!turmaSelecionada) return;
    
    const aluno = alunosDaTurma.find(a => a.id === alunoId);
    if (!aluno) return;

    const confirmacao = window.confirm(
      `Deseja realmente desmatricular ${aluno.nome} ${aluno.sobrenome} desta turma?`
    );
    
    if (confirmacao) {
      try {
        await desmatricularAluno(turmaSelecionada, alunoId);
        alert('Aluno desmatriculado com sucesso!');
        carregarAlunosDaTurma(turmaSelecionada);
      } catch (err) {
        setError('Erro ao desmatricular aluno.');
        console.error(err);
      }
    }
  };

  const turmaSelecionadaObj = turmas.find(t => t.id === turmaSelecionada);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <label htmlFor="turmaSelect" className="form-label mb-0">Selecionar Turma:</label>
          <select
            id="turmaSelect"
            className="form-select w-auto"
            value={turmaSelecionada || ''}
            onChange={e => setTurmaSelecionada(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Selecione uma turma</option>
            {turmas.map(turma => (
              <option key={turma.id} value={turma.id}>
                {turma.codigo} - {turma.nome}
              </option>
            ))}
          </select>
        </div>
        
        <button className="btn btn-primary" onClick={onNew}>
          Nova Matrícula
        </button>
      </div>

      {turmaSelecionada && turmaSelecionadaObj && (
        <div className="card">
          <div className="card-header">
            <h4>
              Alunos matriculados em: {turmaSelecionadaObj.codigo} - {turmaSelecionadaObj.nome}
            </h4>
            <small className="text-muted">
              {turmaSelecionadaObj.diaSemana} - {turmaSelecionadaObj.horarioInicio} às {turmaSelecionadaObj.horarioTermino}
            </small>
          </div>
          <div className="card-body">
            {loadingAlunos ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Carregando alunos...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>CPF</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosDaTurma.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          Nenhum aluno matriculado nesta turma.
                        </td>
                      </tr>
                    ) : (
                      alunosDaTurma.map(aluno => (
                        <tr key={aluno.id}>
                          <td>{aluno.nome} {aluno.sobrenome}</td>
                          <td>{aluno.email}</td>
                          <td>{aluno.cpf}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDesmatricular(aluno.id)}
                            >
                              Desmatricular
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!turmaSelecionada && (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          Selecione uma turma para visualizar os alunos matriculados.
        </div>
      )}
    </>
  );
};

export default ListaMatriculas;
