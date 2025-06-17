import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Turma } from '../../types';
import { getTurmas, deleteTurma } from '../../services/turmaService';
import Layout from '../../components/Layout/Layout';

const ListaTurmas: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(false);  const [search, setSearch] = useState<string>('');
  const [orderBy1, setOrderBy1] = useState<string>('codigo');
  const [orderDir1, setOrderDir1] = useState<'asc' | 'desc'>('asc');
  const [orderBy2, setOrderBy2] = useState<string>('');
  const [orderDir2, setOrderDir2] = useState<'asc' | 'desc'>('asc');
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      const data = await getTurmas({
        search: search || undefined,
        orderBy1: orderBy1 || undefined,
        orderDir1,
        orderBy2: orderBy2 || undefined,
        orderDir2,
        ativo: mostrarInativas ? undefined : true,
      });
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
    // eslint-disable-next-line
  }, [search, orderBy1, orderDir1, orderBy2, orderDir2, mostrarInativas]);  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja desativar esta turma?')) {
      try {
        setLoadingAction(id);
        console.log('Desativando turma:', id);
        await deleteTurma(id);
        console.log('Turma desativada com sucesso');
        setTurmas(
          turmas.map((turma) =>
            turma.id === id ? { ...turma, ativo: false } : turma
          )
        );
        alert('Turma desativada com sucesso!');
      } catch (err) {
        console.error('Erro ao desativar turma:', err);
        setError('Erro ao desativar turma.');
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const turmasFiltradas = mostrarInativas
    ? turmas
    : turmas.filter((turma) => turma.ativo);

  return (
    <Layout>
      <h1>Turmas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarTurmas(); }}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome, código, disciplina ou sala"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>        <div className="col-md-2">
          <select className="form-select" value={orderBy1} onChange={e => setOrderBy1(e.target.value)}>
            <option value="codigo">Código</option>
            <option value="nome">Nome</option>
            <option value="diaSemana">Dia da Semana</option>
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
            <option value="codigo">Código</option>
            <option value="nome">Nome</option>
            <option value="diaSemana">Dia da Semana</option>
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
          <label className="form-check-label" htmlFor="mostrarInativos">
            Mostrar turmas inativas
          </label>
        </div>
        <div>
          <Link to="/turmas/novo" className="btn btn-primary me-2">
            Nova Turma
          </Link>
          <Link to="/turmas/reativar" className="btn btn-outline-success">
            Reativar Turmas
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">          <table className="table table-striped">            <thead>
              <tr>
                <th>Código</th>
                <th>Disciplina</th>
                <th>Professor</th>
                <th>Sala</th>
                <th>Horário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>              {turmasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Nenhuma turma encontrada.
                  </td>
                </tr>
              ) : (
                turmasFiltradas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.codigo}</td>
                    <td>{turma.disciplina?.nome}</td>
                    <td>{turma.professor?.nome}</td>
                    <td>{turma.sala?.local}</td>
                    <td>{turma.diaSemana} {turma.horarioInicio}-{turma.horarioTermino}</td>                    <td>
                      <Link
                        to={`/turmas/editar/${turma.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/turmas/${turma.id}/alunos`}
                        className="btn btn-sm btn-info me-2"
                      >
                        Alunos
                      </Link>
                      {turma.ativo ? (                        <button
                          onClick={() => handleDelete(turma.id)}
                          className="btn btn-sm btn-danger"
                          disabled={loadingAction === turma.id}
                        >
                          {loadingAction === turma.id ? 'Desativando...' : 'Desativar'}
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

export default ListaTurmas;