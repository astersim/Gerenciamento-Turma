import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { Turma, Aluno } from '../../types';
import { getTurma } from '../../services/turmaService';
import { getAlunos, getAlunosDaTurma, matricularAluno, desmatricularAluno } from '../../services/alunoService';

const GerenciarAlunosTurma: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turma, setTurma] = useState<Turma | null>(null);
  const [alunosMatriculados, setAlunosMatriculados] = useState<Aluno[]>([]);  const [alunosDisponiveis, setAlunosDisponiveis] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMatricularForm, setShowMatricularForm] = useState(false);
  const carregarDados = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [turmaData, alunosMatriculadosData, todosAlunos] = await Promise.all([
        getTurma(Number(id)),
        getAlunosDaTurma(Number(id)),
        getAlunos({ ativo: true })
      ]);
      
      setTurma(turmaData);
      setAlunosMatriculados(alunosMatriculadosData);
      
      // Filtrar alunos que não estão matriculados nesta turma
      const idsMatriculados = alunosMatriculadosData.map(aluno => aluno.id);
      const disponivel = todosAlunos.filter(aluno => !idsMatriculados.includes(aluno.id));
      setAlunosDisponiveis(disponivel);
      
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);
  const handleMatricular = async (alunoId: number) => {
    if (!turma) return;
    
    try {
      setLoadingAction(true);
      await matricularAluno(turma.id, alunoId);
      alert('Aluno matriculado com sucesso!');
      carregarDados(); // Recarregar dados
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao matricular aluno.');
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };  const handleDesmatricular = async (alunoId: number) => {
    if (!turma) return;
    
    const aluno = alunosMatriculados.find(a => a.id === alunoId);
    if (!aluno) return;

    const confirmacao = window.confirm(
      `Deseja realmente desmatricular ${aluno.nome} ${aluno.sobrenome} desta turma?`
    );
    
    if (confirmacao) {
      try {
        setLoadingAction(true);
        console.log('Desmatriculando aluno:', alunoId, 'da turma:', turma.id);
        await desmatricularAluno(turma.id, alunoId);
        console.log('Desmatrícula bem-sucedida');
        alert('Aluno desmatriculado com sucesso!');
        carregarDados(); // Recarregar dados
      } catch (err) {
        console.error('Erro na desmatrícula:', err);
        setError('Erro ao desmatricular aluno.');
      } finally {
        setLoadingAction(false);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!turma) {
    return (
      <Layout>
        <div className="alert alert-danger">Turma não encontrada.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>Gerenciar Alunos - {turma.codigo}</h1>
            <p className="text-muted mb-0">
              {turma.disciplina?.nome} | {turma.professor?.nome} | {turma.sala?.local}
            </p>
            <small className="text-muted">
              {turma.diaSemana} - {turma.horarioInicio} às {turma.horarioTermino}
            </small>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/turmas')}
          >
            Voltar às Turmas
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {/* Alunos Matriculados */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4>Alunos Matriculados ({alunosMatriculados.length})</h4>
              </div>
              <div className="card-body">
                {alunosMatriculados.length === 0 ? (
                  <p className="text-muted text-center">Nenhum aluno matriculado nesta turma.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alunosMatriculados.map(aluno => (
                          <tr key={aluno.id}>
                            <td>{aluno.nome} {aluno.sobrenome}</td>
                            <td>{aluno.email}</td>
                            <td>                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDesmatricular(aluno.id)}
                                disabled={loadingAction}
                              >
                                {loadingAction ? 'Desmatriculando...' : 'Desmatricular'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alunos Disponíveis */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4>Alunos Disponíveis ({alunosDisponiveis.length})</h4>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowMatricularForm(!showMatricularForm)}
                >
                  {showMatricularForm ? 'Ocultar' : 'Mostrar'} Lista
                </button>
              </div>
              <div className="card-body">
                {!showMatricularForm ? (
                  <p className="text-muted text-center">
                    Clique em "Mostrar Lista" para ver os alunos disponíveis para matrícula.
                  </p>
                ) : alunosDisponiveis.length === 0 ? (
                  <p className="text-muted text-center">Todos os alunos ativos já estão matriculados nesta turma.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alunosDisponiveis.map(aluno => (
                          <tr key={aluno.id}>
                            <td>{aluno.nome} {aluno.sobrenome}</td>
                            <td>{aluno.email}</td>
                            <td>                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleMatricular(aluno.id)}
                                disabled={loadingAction}
                              >
                                {loadingAction ? 'Matriculando...' : 'Matricular'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GerenciarAlunosTurma;
