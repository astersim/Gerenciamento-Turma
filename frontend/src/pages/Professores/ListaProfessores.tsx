import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Professor } from '../../types';
import { getProfessores, deleteProfessor } from '../../services/professorService';
import StatusBadge from '../../components/ui/StatusBadge';
import Layout from '../../components/Layout/Layout';

const ListaProfessores: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativos, setMostrarInativos] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [orderBy1, setOrderBy1] = useState<string>('nome');
  const [orderDir1, setOrderDir1] = useState<'asc' | 'desc'>('asc');
  const [orderBy2, setOrderBy2] = useState<string>('');
  const [orderDir2, setOrderDir2] = useState<'asc' | 'desc'>('asc');

  const carregarProfessores = async () => {
    try {
      setLoading(true);
      const data = await getProfessores({
        search: search || undefined,
        orderBy1: orderBy1 || undefined,
        orderDir1,
        orderBy2: orderBy2 || undefined,
        orderDir2,
        status: mostrarInativos ? undefined : true,
      });
      setProfessores(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar professores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProfessores();
    // eslint-disable-next-line
  }, [search, orderBy1, orderDir1, orderBy2, orderDir2, mostrarInativos]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja desativar este professor?')) {
      try {
        await deleteProfessor(id);
        setProfessores(
          professores.map((professor) =>
            professor.id === id ? { ...professor, ativo: false } : professor
          )
        );
      } catch (err) {
        setError('Erro ao desativar professor.');
        console.error(err);
      }
    }
  };
  const professoresFiltrados = mostrarInativos
    ? professores
    : professores.filter((professor) => professor.ativo);

  return (
    <Layout>
      <h1>Professores</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarProfessores(); }}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome, CPF ou titulação"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={orderBy1} onChange={e => setOrderBy1(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="cpf">CPF</option>
            <option value="titulacao">Titulação</option>
          </select>
        </div>
        <div className="col-md-1">
          <select className="form-select" value={orderDir1} onChange={e => setOrderDir1(e.target.value as 'asc' | 'desc')}>
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={orderBy2} onChange={e => setOrderBy2(e.target.value)}>
            <option value="">(2º ordenação)</option>
            <option value="nome">Nome</option>
            <option value="cpf">CPF</option>
            <option value="titulacao">Titulação</option>
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
            checked={mostrarInativos}
            onChange={(e) => setMostrarInativos(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mostrarInativos">
            Mostrar professores inativos
          </label>
        </div>
        <div>
          <Link to="/professores/novo" className="btn btn-primary me-2">
            Novo Professor
          </Link>
          <Link to="/professores/reativar" className="btn btn-outline-success">
            Reativar Professores
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
            <tbody>              {professoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Nenhum professor encontrado.
                  </td>
                </tr>
              ) : (
                professoresFiltrados.map((professor) => (
                  <tr key={professor.id}>
                    <td>{professor.nome}</td>
                    <td>
                      <StatusBadge active={professor.ativo} />
                    </td>
                    <td>
                      <Link
                        to={`/professores/editar/${professor.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Editar
                      </Link>
                      {professor.ativo ? (
                        <button
                          onClick={() => handleDelete(professor.id)}
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

export default ListaProfessores;