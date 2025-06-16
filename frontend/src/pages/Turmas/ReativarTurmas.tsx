import React, { useEffect, useState } from 'react';
import { reativarTurma, getTurmas } from '../../services/turmaService';
import { Turma } from '../../types';
import Layout from '../../components/Layout/Layout';

const ReativarTurmas: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('codigo');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      const data = await getTurmas({
        search: search || undefined,
        orderBy1: orderBy,
        orderDir1: orderDir,
        ativo: false
      });
      setTurmas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar turmas inativas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
    // eslint-disable-next-line
  }, [search, orderBy, orderDir]);

  const handleReativar = async (id: number) => {
    try {
      await reativarTurma(id);
      setTurmas(turmas.filter((t) => t.id !== id));
    } catch (err) {
      setError('Erro ao reativar turma.');
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1>Reativar Turmas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarTurmas(); }}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome, código ou disciplina"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={orderBy} onChange={e => setOrderBy(e.target.value)}>
            <option value="codigo">Código</option>
            <option value="nome">Nome</option>
            <option value="diaSemana">Dia da Semana</option>
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
                <th>Código</th>
                <th>Nome</th>
                <th>Dia da Semana</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>              {turmas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">Nenhuma turma inativa encontrada.</td>
                </tr>
              ) : (
                turmas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.codigo}</td>
                    <td>{turma.nome}</td>
                    <td>{turma.diaSemana}</td>
                    <td>
                      <button
                        onClick={() => handleReativar(turma.id)}
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

export default ReativarTurmas;
