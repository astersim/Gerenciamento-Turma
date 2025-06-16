import React, { useEffect, useState } from 'react';
import { reativarDisciplina, getDisciplinas } from '../../services/disciplinaService';
import { Disciplina } from '../../types';
import Layout from '../../components/Layout/Layout';

const ReativarDisciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('nome');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  const carregarDisciplinas = async () => {
    try {
      setLoading(true);
      const data = await getDisciplinas({
        search: search || undefined,
        orderBy1: orderBy,
        orderDir1: orderDir,
        ativo: false
      });
      setDisciplinas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar disciplinas inativas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDisciplinas();
    // eslint-disable-next-line
  }, [search, orderBy, orderDir]);

  const handleReativar = async (id: number) => {
    try {
      await reativarDisciplina(id);
      setDisciplinas(disciplinas.filter((d) => d.id !== id));
    } catch (err) {
      setError('Erro ao reativar disciplina.');
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1>Reativar Disciplinas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarDisciplinas(); }}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome, código ou período"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={orderBy} onChange={e => setOrderBy(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="codigo">Código</option>
            <option value="periodo">Período</option>
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
                <th>Código</th>
                <th>Período</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>              {disciplinas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">Nenhuma disciplina inativa encontrada.</td>
                </tr>
              ) : (
                disciplinas.map((disciplina) => (
                  <tr key={disciplina.id}>
                    <td>{disciplina.nome}</td>
                    <td>{disciplina.codigo}</td>
                    <td>{disciplina.periodo}</td>
                    <td>
                      <button
                        onClick={() => handleReativar(disciplina.id)}
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

export default ReativarDisciplinas;
