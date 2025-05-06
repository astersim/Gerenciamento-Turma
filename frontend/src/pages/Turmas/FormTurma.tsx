import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createTurma,
  getTurma,
  updateTurma,
} from '../../services/turmaService';
import { getDisciplinas } from '../../services/disciplinaService';
import { getSalas } from '../../services/salaService';
import { Disciplina, Sala } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

const FormTurma: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [disciplinaId, setDisciplinaId] = useState<number | ''>('');
  const [salaId, setSalaId] = useState<number | ''>('');
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdicao = !!id;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carrega todas as disciplinas e salas ativas
        const [disciplinasData, salasData] = await Promise.all([
          getDisciplinas(),
          getSalas()
        ]);
        
        setDisciplinas(disciplinasData.filter(d => d.ativo));
        setSalas(salasData.filter(s => s.ativo));
        
        if (isEdicao) {
          // Se for edição, carrega os dados da turma
          const turma = await getTurma(parseInt(id));
          setCodigo(turma.codigo);
          setDisciplinaId(turma.disciplinaId);
          setSalaId(turma.salaId);
        }
        
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, isEdicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      setError('Código é obrigatório.');
      return;
    }
    
    if (disciplinaId === '') {
      setError('Disciplina é obrigatória.');
      return;
    }
    
    if (salaId === '') {
      setError('Sala é obrigatória.');
      return;
    }

    try {
      setLoading(true);
      
      const turmaData = {
        codigo,
        disciplinaId: Number(disciplinaId),
        salaId: Number(salaId)
      };
      
      if (isEdicao) {
        await updateTurma(parseInt(id), turmaData);
      } else {
        await createTurma(turmaData);
      }

      navigate('/turmas');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(`Erro ao ${isEdicao ? 'atualizar' : 'criar'} turma.`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>{isEdicao ? 'Editar' : 'Nova'} Turma</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
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
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="disciplina" className="form-label">
            Disciplina
          </label>
          <select
            className="form-select"
            id="disciplina"
            value={disciplinaId}
            onChange={(e) => setDisciplinaId(e.target.value ? Number(e.target.value) : '')}
            disabled={loading}
            required
          >
            <option value="">Selecione uma disciplina</option>
            {disciplinas.map(disciplina => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label htmlFor="sala" className="form-label">
            Sala
          </label>
          <select
            className="form-select"
            id="sala"
            value={salaId}
            onChange={(e) => setSalaId(e.target.value ? Number(e.target.value) : '')}
            disabled={loading}
            required
          >
            <option value="">Selecione uma sala</option>
            {salas.map(sala => (
              <option key={sala.id} value={sala.id}>
                {sala.local}
              </option>
            ))}
          </select>
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
            onClick={() => navigate('/turmas')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default FormTurma;