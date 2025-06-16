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
  const [codigo, setCodigo] = useState('');
  const [periodo, setPeriodo] = useState('');
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
        setCodigo(disciplina.codigo);
        setPeriodo(disciplina.periodo);
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
    if (!codigo.trim()) {
      setError('Código é obrigatório.');
      return;
    }
    if (!periodo.trim()) {
      setError('Período é obrigatório.');
      return;
    }
    if (!/^[A-Za-z0-9]{1,10}$/.test(codigo)) {
      setError('Código deve conter apenas letras e números e até 10 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const disciplinaData = {
        nome,
        codigo,
        periodo
      };
      if (isEdicao) {
        await updateDisciplina(parseInt(id), disciplinaData);
      } else {
        await createDisciplina(disciplinaData);
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
        <div className="mb-3">
          <label htmlFor="codigo" className="form-label">
            Código
          </label>
          <input
            type="text"
            className="form-control"
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={loading}
            required
            maxLength={10}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="periodo" className="form-label">
            Período
          </label>
          <input
            type="text"
            className="form-control"
            id="periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
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