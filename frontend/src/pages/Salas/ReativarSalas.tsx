import React, { useEffect, useState } from 'react';
import { reativarSala, getSalas } from '../../services/salaService';
import { Sala } from '../../types';
import Layout from '../../components/Layout/Layout';

const ReativarSalas: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('local');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  const carregarSalas = async () => {
    try {
      setLoading(true);
      const data = await getSalas({
        search: search || undefined,
        orderBy1: orderBy,
        orderDir1: orderDir,
        ativo: false
      });
      setSalas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar salas inativas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSalas();
    // eslint-disable-next-line
  }, [search, orderBy, orderDir]);

  const handleReativar = async (id: number) => {
    try {
      await reativarSala(id);
      setSalas(salas.filter((s) => s.id !== id));
    } catch (err) {
      setError('Erro ao reativar sala.');
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1>Reativar Salas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarSalas(); }}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome ou local"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={orderBy} onChange={e => setOrderBy(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="local">Local</option>
            <option value="capacidade">Capacidade</option>
            <option value="id">ID</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={orderDir} onChange={e => setOrderDir(e.target.value as 'asc' | 'desc')}>
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
      </form>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">            <thead>
              <tr>
                <th>Nome</th>
                <th>Local</th>
                <th>Capacidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>              {salas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">Nenhuma sala inativa encontrada.</td>
                </tr>
              ) : (
                salas.map((sala) => (
                  <tr key={sala.id}>
                    <td>{sala.nome}</td>
                    <td>{sala.local}</td>
                    <td>{sala.capacidade}</td>
                    <td>
                      <button
                        onClick={() => handleReativar(sala.id)}
                        className="btn btn-sm btn-success"
                      >
                        Reativar
                      </button>
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

export default ReativarSalas;
