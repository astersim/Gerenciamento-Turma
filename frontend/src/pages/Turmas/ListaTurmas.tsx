import React, { useEffect, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Turma } from '../../types';
import { getTurmas, deleteTurma, reativarTurma } from '../../services/turmaService';
import StatusBadge from '../../components/ui/StatusBadge';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* Layout content */}
      {children}
    </div>
  );
};

const ListaTurmas: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(false);

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

  return (
    <Layout>
      <h1>Turmas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
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
                <th>ID</th>
                <th>Código</th>
                <th>Disciplina</th>
                <th>Sala</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Nenhuma turma encontrada.
                  </td>
                </tr>
              ) : (
                turmasFiltradas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.id}</td>
                    <td>{turma.codigo}</td>
                    <td>{turma.disciplina?.nome}</td>
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