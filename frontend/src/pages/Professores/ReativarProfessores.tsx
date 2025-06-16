import React, { useEffect, useState } from 'react';
import { reativarProfessor, getProfessores } from '../../services/professorService';
import { Professor } from '../../types';
import Layout from '../../components/Layout/Layout';

const ReativarProfessores: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('nome');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  const carregarProfessores = async () => {
    try {
      setLoading(true);
      const data = await getProfessores({
        search: search || undefined,
        orderBy1: orderBy,
        orderDir1: orderDir,
        status: false
      });
      setProfessores(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar professores inativos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProfessores();
    // eslint-disable-next-line
  }, [search, orderBy, orderDir]);

  const handleReativar = async (id: number) => {
    try {
      await reativarProfessor(id);
      setProfessores(professores.filter((p) => p.id !== id));
    } catch (err) {
      setError('Erro ao reativar professor.');
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1>Reativar Professores</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarProfessores(); }}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome ou CPF"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={orderBy} onChange={e => setOrderBy(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="cpf">CPF</option>
            <option value="titulacao">Titulação</option>
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
                <th>CPF</th>
                <th>Titulação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>              {professores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">Nenhum professor inativo encontrado.</td>
                </tr>
              ) : (
                professores.map((professor) => (
                  <tr key={professor.id}>
                    <td>{professor.nome}</td>
                    <td>{professor.cpf}</td>
                    <td>{professor.titulacao}</td>
                    <td>
                      <button
                        onClick={() => handleReativar(professor.id)}
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

export default ReativarProfessores;
