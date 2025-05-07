import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Disciplina } from '../../types';
import { getDisciplinas, deleteDisciplina, reativarDisciplina } from '../../services/disciplinaService';
import StatusBadge from '../../components/ui/StatusBadge';
import Layout from '../../components/Layout/Layout';
import SearchBar from '../../components/ui/SearchBar';

const ListaDisciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarInativas, setMostrarInativas] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarDisciplinas = async () => {
    try {
      setLoading(true);
      const data = await getDisciplinas();
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
  }, []);

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

  const handleReativar = async (id: number) => {
    try {
      await reativarDisciplina(id);
      // Atualiza o estado local para refletir a mudança
      setDisciplinas(
        disciplinas.map((disciplina) =>
          disciplina.id === id ? { ...disciplina, ativo: true } : disciplina
        )
      );
    } catch (err) {
      setError('Erro ao reativar disciplina.');
      console.error(err);
    }
  };

  const disciplinasFiltradas = mostrarInativas
    ? disciplinas
    : disciplinas.filter((disciplina) => disciplina.ativo);

  const disciplinasPesquisadas = disciplinasFiltradas
    .filter((disciplina) =>
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Layout>
      <h1>Disciplinas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar disciplina..."
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
            Mostrar disciplinas inativas
          </label>
        </div>
        <Link to="/disciplinas/novo" className="btn btn-primary">
          Nova Disciplina
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
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {disciplinasPesquisadas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Nenhuma disciplina encontrada.
                  </td>
                </tr>
              ) : (
                disciplinasPesquisadas.map((disciplina) => (
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
                      ) : (
                        <button
                          onClick={() => handleReativar(disciplina.id)}
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

export default ListaDisciplinas;