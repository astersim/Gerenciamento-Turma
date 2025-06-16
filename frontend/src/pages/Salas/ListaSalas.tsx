import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sala } from '../../types';
import { getSalas, deleteSala } from '../../services/salaService';
import StatusBadge from '../../components/ui/StatusBadge';
import Layout from '../../components/Layout/Layout';

const ListaSalas: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [orderBy1, setOrderBy1] = useState<string>('local');
  const [orderDir1, setOrderDir1] = useState<'asc' | 'desc'>('asc');
  const [orderBy2, setOrderBy2] = useState<string>('');
  const [orderDir2, setOrderDir2] = useState<'asc' | 'desc'>('asc');

  const carregarSalas = async () => {
    try {
      setLoading(true);
      const data = await getSalas({
        search: search || undefined,
        orderBy1: orderBy1 || undefined,
        orderDir1,
        orderBy2: orderBy2 || undefined,
        orderDir2,
        ativo: mostrarInativas ? undefined : true,
      });
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
    // eslint-disable-next-line
  }, [search, orderBy1, orderDir1, orderBy2, orderDir2, mostrarInativas]);

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

  const salasFiltradas = mostrarInativas
    ? salas
    : salas.filter((sala) => sala.ativo);

  return (
    <Layout>
      <h1>Salas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarSalas(); }}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome ou local"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>        <div className="col-md-2">
          <select className="form-select" value={orderBy1} onChange={e => setOrderBy1(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="local">Local</option>
            <option value="capacidade">Capacidade</option>
          </select>
        </div>
        <div className="col-md-1">
          <select className="form-select" value={orderDir1} onChange={e => setOrderDir1(e.target.value as 'asc' | 'desc')}>
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
        <div className="col-md-2">          <select className="form-select" value={orderBy2} onChange={e => setOrderBy2(e.target.value)}>
            <option value="">(2º ordenação)</option>
            <option value="nome">Nome</option>
            <option value="local">Local</option>
            <option value="capacidade">Capacidade</option>
          </select>
        </div>
        <div className="col-md-1">
          <select className="form-select" value={orderDir2} onChange={e => setOrderDir2(e.target.value as 'asc' | 'desc')}>
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-outline-primary w-100">Buscar</button>
        </div>
      </form>

      <div className="d-flex justify-content-between mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="mostrarInativos"
            checked={mostrarInativas}
            onChange={(e) => setMostrarInativas(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mostrarInativos">
            Mostrar salas inativas
          </label>
        </div>
        <div>
          <Link to="/salas/novo" className="btn btn-primary me-2">
            Nova Sala
          </Link>
          <Link to="/salas/reativar" className="btn btn-outline-success">
            Reativar Salas
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">            <thead>
              <tr>
                <th>Local</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>              {salasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Nenhuma sala encontrada.
                  </td>
                </tr>
              ) : (
                salasFiltradas.map((sala) => (
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
                      ) : null}
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