import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTurma, getTurma, updateTurma } from '../../services/turmaService';
import { getDisciplinas } from '../../services/disciplinaService';
import { getSalas } from '../../services/salaService';
import { getProfessores } from '../../services/professorService';
import { Disciplina, Sala, Professor } from '../../types';
import Layout from '../../components/Layout/Layout';

const FormTurma: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [disciplinaId, setDisciplinaId] = useState<number | ''>('');
  const [salaId, setSalaId] = useState<number | ''>('');
  const [professorId, setProfessorId] = useState<number | ''>('');
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdicao = !!id;

  // Filtra professores que podem lecionar a disciplina selecionada
  const professoresDisponiveis = professores.filter(professor =>
    professor.disciplinas.some(pd => pd.disciplinaId === Number(disciplinaId))
  );

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carrega todas as disciplinas, salas e professores ativos
        const [disciplinasData, salasData, professoresData] = await Promise.all([
          getDisciplinas(),
          getSalas(),
          getProfessores()
        ]);
        
        setDisciplinas(disciplinasData.filter(d => d.ativo));
        setSalas(salasData.filter(s => s.ativo));
        setProfessores(professoresData.filter(p => p.ativo));
        
        if (isEdicao) {
          const turma = await getTurma(parseInt(id));
          setCodigo(turma.codigo);
          setDisciplinaId(turma.disciplinaId);
          setSalaId(turma.salaId);
          setProfessorId(turma.professorId ?? '');
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
        salaId: Number(salaId),
        professorId: professorId ? Number(professorId) : null 
      };
      
      if (isEdicao) {
        await updateTurma(parseInt(id), turmaData);
      } else {
        await createTurma(turmaData);
      }

      navigate('/turmas');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(`Erro ao ${isEdicao ? 'atualizar' : 'criar'} turma.`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset professor when discipline changes
  useEffect(() => {
    setProfessorId('');
  }, [disciplinaId]);

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

        <div className="mb-3">
          <label htmlFor="professor" className="form-label">
            Professor (Opcional)
          </label>
          <select
            className="form-select"
            id="professor"
            value={professorId}
            onChange={(e) => setProfessorId(e.target.value ? Number(e.target.value) : '')}
            disabled={loading || !disciplinaId}
          >
            <option value="">
              {!disciplinaId 
                ? 'Selecione uma disciplina primeiro' 
                : professoresDisponiveis.length === 0 
                  ? 'Nenhum professor disponível' 
                  : 'Selecione um professor'}
            </option>
            {disciplinaId && professoresDisponiveis.map(professor => (
              <option key={professor.id} value={professor.id}>
                {professor.nome}
              </option>
            ))}
          </select>
          {disciplinaId && professoresDisponiveis.length === 0 && (
            <small className="text-muted">
              Não há professores cadastrados para esta disciplina. A turma pode ser criada sem um professor.
            </small>
          )}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
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