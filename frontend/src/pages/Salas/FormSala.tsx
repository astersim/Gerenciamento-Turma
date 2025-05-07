import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createSala,
  getSala,
  updateSala,
} from '../../services/salaService';
import Layout from '../../components/Layout/Layout';

const FormSala: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [local, setLocal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdicao = !!id;

  useEffect(() => {
    const carregarSala = async () => {
      if (!isEdicao) return;

      try {
        setLoading(true);
        const sala = await getSala(parseInt(id));
        setLocal(sala.local);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar sala.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarSala();
  }, [id, isEdicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!local.trim()) {
      setError('Local é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      if (isEdicao) {
        await updateSala(parseInt(id), { local });
      } else {
        await createSala({ local });
      }

      navigate('/salas');
    } catch (err) {
      setError(`Erro ao ${isEdicao ? 'atualizar' : 'criar'} sala.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>{isEdicao ? 'Editar' : 'Nova'} Sala</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="local" className="form-label">
            Local
          </label>
          <input
            type="text"
            className="form-control"
            id="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
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
            onClick={() => navigate('/salas')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default FormSala;