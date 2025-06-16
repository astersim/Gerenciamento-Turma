import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Disciplina } from '../../types';
import { getDisciplinas, deleteDisciplina } from '../../services/disciplinaService';
import StatusBadge from '../../components/ui/StatusBadge';
import Layout from '../../components/Layout/Layout';

const ListaDisciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [orderBy1, setOrderBy1] = useState<string>('nome');
  const [orderDir1, setOrderDir1] = useState<'asc' | 'desc'>('asc');
  const [orderBy2, setOrderBy2] = useState<string>('');
  const [orderDir2, setOrderDir2] = useState<'asc' | 'desc'>('asc');

  const carregarDisciplinas = async () => {
    try {
      setLoading(true);
      const data = await getDisciplinas({
        search: search || undefined,
        orderBy1: orderBy1 || undefined,
        orderDir1,
        orderBy2: orderBy2 || undefined,
        orderDir2,
        ativo: mostrarInativas ? undefined : true,
      });
      setDisciplinas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar disciplinas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDisciplinas();
    // eslint-disable-next-line
  }, [search, orderBy1, orderDir1, orderBy2, orderDir2, mostrarInativas]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja desativar esta disciplina?')) {
      try {
        await deleteDisciplina(id);
        // Atualiza o estado local para refletir a mudança
        setDisciplinas(
          disciplinas.map((disciplina) =>
            disciplina.id === id ? { ...disciplina, ativo: false } : disciplina
          )
        );
      } catch (err) {
        setError('Erro ao desativar disciplina.');
        console.error(err);
      }
    }
  };

  const disciplinasFiltradas = mostrarInativas
    ? disciplinas
    : disciplinas.filter((disciplina) => disciplina.ativo);

  return (
    <Layout>
      <h1>Disciplinas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarDisciplinas(); }}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome, código ou período"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>        <div className="col-md-2">
          <select className="form-select" value={orderBy1} onChange={e => setOrderBy1(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="codigo">Código</option>
            <option value="periodo">Período</option>
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
            <option value="codigo">Código</option>
            <option value="periodo">Período</option>
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
            id="mostrarInativas"
            checked={mostrarInativas}
            onChange={(e) => setMostrarInativas(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mostrarInativas">
            Mostrar disciplinas inativas
          </label>
        </div>
        <div>
          <Link to="/disciplinas/novo" className="btn btn-primary me-2">
            Nova Disciplina
          </Link>
          <Link to="/disciplinas/reativar" className="btn btn-outline-success">
            Reativar Disciplinas
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">            <thead>
              <tr>
                <th>Nome</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>              {disciplinasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Nenhuma disciplina encontrada.
                  </td>
                </tr>
              ) : (
                disciplinasFiltradas.map((disciplina) => (
                  <tr key={disciplina.id}>
                    <td>{disciplina.nome}</td>
                    <td>
                      <StatusBadge active={disciplina.ativo} />
                    </td>
                    <td>
                      <Link
                        to={`/disciplinas/editar/${disciplina.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Editar
                      </Link>
                      {disciplina.ativo ? (
                        <button
                          onClick={() => handleDelete(disciplina.id)}
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

export default ListaDisciplinas;