import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Turma } from '../../types';
import { getTurmas, deleteTurma, reativarTurma } from '../../services/turmaService';
import StatusBadge from '../../components/ui/StatusBadge';
import Layout from '../../components/Layout/Layout';
import SearchBar from '../../components/ui/SearchBar';

const ListaTurmas: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      const data = await getTurmas();
      setTurmas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar turmas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja desativar esta turma?')) {
      try {
        await deleteTurma(id);
        setTurmas(
          turmas.map((turma) =>
            turma.id === id ? { ...turma, ativo: false } : turma
          )
        );
      } catch (err) {
        setError('Erro ao desativar turma.');
        console.error(err);
      }
    }
  };

  const handleReativar = async (id: number) => {
    try {
      await reativarTurma(id);
      setTurmas(
        turmas.map((turma) =>
          turma.id === id ? { ...turma, ativo: true } : turma
        )
      );
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao reativar turma.');
      }
      console.error(err);
    }
  };

  const turmasFiltradas = mostrarInativas
    ? turmas
    : turmas.filter((turma) => turma.ativo);

  const turmasPesquisadas = turmasFiltradas
    .filter((turma) =>
      turma.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.disciplina?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.sala?.local.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.codigo.localeCompare(b.codigo));

  return (
    <Layout>
      <h1>Turmas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por código, disciplina ou sala..."
        />
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="mostrarInativas"
            checked={mostrarInativas}
            onChange={(e) => setMostrarInativas(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mostrarInativas">
            Mostrar turmas inativas
          </label>
        </div>
        <Link to="/turmas/novo" className="btn btn-primary">
          Nova Turma
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Disciplina</th>
                <th>Professor</th>
                <th>Sala</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmasPesquisadas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Nenhuma turma encontrada.
                  </td>
                </tr>
              ) : (
                turmasPesquisadas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.codigo}</td>
                    <td>{turma.disciplina?.nome}</td>
                    <td>{turma.professor ? turma.professor.nome : "Não atribuído"}</td>
                    <td>{turma.sala?.local}</td>
                    <td>
                      <StatusBadge active={turma.ativo} />
                    </td>
                    <td>
                      <Link
                        to={`/turmas/editar/${turma.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Editar
                      </Link>
                      {turma.ativo ? (
                        <button
                          onClick={() => handleDelete(turma.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Desativar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReativar(turma.id)}
                          className="btn btn-sm btn-success"
                        >
                          Reativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default ListaTurmas;