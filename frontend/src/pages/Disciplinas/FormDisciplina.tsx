import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createDisciplina,
  getDisciplina,
  updateDisciplina,
} from '../../services/disciplinaService';
import Layout from '../../components/Layout/Layout';


const FormDisciplina: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdicao = !!id;

  useEffect(() => {
    const carregarDisciplina = async () => {
      if (!isEdicao) return;

      try {
        setLoading(true);
        const disciplina = await getDisciplina(parseInt(id));
        setNome(disciplina.nome);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar disciplina.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDisciplina();
  }, [id, isEdicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setError('Nome é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      if (isEdicao) {
        await updateDisciplina(parseInt(id), { nome });
      } else {
        await createDisciplina({ nome });
      }

      navigate('/disciplinas');
    } catch (err) {
      setError(`Erro ao ${isEdicao ? 'atualizar' : 'criar'} disciplina.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>{isEdicao ? 'Editar' : 'Nova'} Disciplina</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/disciplinas')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default FormDisciplina;