import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sala } from '../../types';
import { getSalas, deleteSala, reativarSala } from '../../services/salaService';
import StatusBadge from '../../components/ui/StatusBadge';
import Layout from '../../components/Layout/Layout';
import SearchBar from '../../components/ui/SearchBar';

const ListaSalas: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarSalas = async () => {
    try {
      setLoading(true);
      const data = await getSalas();
      setSalas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar salas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja desativar esta sala?')) {
      try {
        await deleteSala(id);
        setSalas(
          salas.map((sala) =>
            sala.id === id ? { ...sala, ativo: false } : sala
          )
        );
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Erro ao desativar sala.');
        }
        console.error(err);
      }
    }
  };

  const handleReativar = async (id: number) => {
    try {
      await reativarSala(id);
      setSalas(
        salas.map((sala) =>
          sala.id === id ? { ...sala, ativo: true } : sala
        )
      );
    } catch (err) {
      setError('Erro ao reativar sala.');
      console.error(err);
    }
  };

  const salasFiltradas = mostrarInativas
    ? salas
    : salas.filter((sala) => sala.ativo);

  const salasPesquisadas = salasFiltradas
    .filter((sala) =>
      sala.local.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.local.localeCompare(b.local));

  return (
    <Layout>
      <h1>Salas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar sala..."
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
            Mostrar salas inativas
          </label>
        </div>
        <Link to="/salas/novo" className="btn btn-primary">
          Nova Sala
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Local</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {salasPesquisadas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Nenhuma sala encontrada.
                  </td>
                </tr>
              ) : (
                salasPesquisadas.map((sala) => (
                  <tr key={sala.id}>
                    <td>{sala.local}</td>
                    <td>
                      <StatusBadge active={sala.ativo} />
                    </td>
                    <td>
                      <Link
                        to={`/salas/editar/${sala.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Editar
                      </Link>
                      {sala.ativo ? (
                        <button
                          onClick={() => handleDelete(sala.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Desativar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReativar(sala.id)}
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

export default ListaSalas;