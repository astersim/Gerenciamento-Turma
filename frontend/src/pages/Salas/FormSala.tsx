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
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');
  const [capacidade, setCapacidade] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdicao = !!id;

  useEffect(() => {
    const carregarSala = async () => {
      if (!isEdicao) return;

      try {
        setLoading(true);
        const sala = await getSala(parseInt(id));
        setNome(sala.nome);
        setLocal(sala.local);
        setCapacidade(sala.capacidade);
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
    
    if (!nome.trim()) {
      setError('Nome é obrigatório.');
      return;
    }
    if (!local.trim()) {
      setError('Local é obrigatório.');
      return;
    }
    if (capacidade === '' || isNaN(Number(capacidade)) || Number(capacidade) <= 0) {
      setError('Capacidade deve ser um número positivo.');
      return;
    }

    try {
      setLoading(true);
      const salaData = {
        nome,
        local,
        capacidade: Number(capacidade)
      };
      if (isEdicao) {
        await updateSala(parseInt(id), salaData);
      } else {
        await createSala(salaData);
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
        <div className="mb-3">
          <label htmlFor="capacidade" className="form-label">
            Capacidade
          </label>
          <input
            type="number"
            className="form-control"
            id="capacidade"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={loading}
            required
            min={1}
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