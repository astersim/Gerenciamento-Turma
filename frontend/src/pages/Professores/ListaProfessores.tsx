import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Professor } from '../../types';
import { getProfessores, deleteProfessor, reativarProfessor } from '../../services/professorService';
import StatusBadge from '../../components/ui/StatusBadge';
import Layout from '../../components/Layout/Layout';
import SearchBar from '../../components/ui/SearchBar';

const ListaProfessores: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativos, setMostrarInativos] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarProfessores = async () => {
    try {
      setLoading(true);
      const data = await getProfessores();
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
  }, []);

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

  const handleReativar = async (id: number) => {
    try {
      await reativarProfessor(id);
      setProfessores(
        professores.map((professor) =>
          professor.id === id ? { ...professor, ativo: true } : professor
        )
      );
    } catch (err) {
      setError('Erro ao reativar professor.');
      console.error(err);
    }
  };

  const professoresFiltrados = mostrarInativos
    ? professores
    : professores.filter((professor) => professor.ativo);

  const professoresPesquisados = professoresFiltrados
    .filter((professor) =>
      professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.disciplinas.some(pd => 
        pd.disciplina?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Layout>
      <h1>Professores</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome ou disciplina..."
        />
      </div>

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
        <Link to="/professores/novo" className="btn btn-primary">
          Novo Professor
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Disciplinas</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professoresPesquisados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    Nenhum professor encontrado.
                  </td>
                </tr>
              ) : (
                professoresPesquisados.map((professor) => (
                  <tr key={professor.id}>
                    <td>{professor.nome}</td>
                    <td>
                      {professor.disciplinas.length > 0
                        ? professor.disciplinas.map((pd) => pd.disciplina?.nome).join(', ')
                        : 'Nenhuma disciplina'}
                    </td>
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
                      ) : (
                        <button
                          onClick={() => handleReativar(professor.id)}
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

export default ListaProfessores;