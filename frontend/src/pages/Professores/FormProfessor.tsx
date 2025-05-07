import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createProfessor,
  getProfessor,
  updateProfessor,
} from '../../services/professorService';
import { getDisciplinas } from '../../services/disciplinaService';
import { Disciplina } from '../../types';
import Layout from '../../components/Layout/Layout';

const FormProfessor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<number[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdicao = !!id;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carrega todas as disciplinas ativas
        const disciplinasData = await getDisciplinas();
        const disciplinasAtivas = disciplinasData.filter(disc => disc.ativo);
        setDisciplinas(disciplinasAtivas);
        
        if (isEdicao) {
          // Se for edição, carrega os dados do professor
          const professor = await getProfessor(parseInt(id));
          setNome(professor.nome);
          // Extrai os IDs das disciplinas do professor
          setDisciplinasSelecionadas(
            professor.disciplinas.map((pd) => pd.disciplinaId)
          );
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
    
    if (!nome.trim()) {
      setError('Nome é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      
      const professorData = {
        nome,
        disciplinaIds: disciplinasSelecionadas
      };
      
      if (isEdicao) {
        await updateProfessor(parseInt(id), professorData);
      } else {
        await createProfessor(professorData);
      }

      navigate('/professores');
    } catch (err) {
      setError(`Erro ao ${isEdicao ? 'atualizar' : 'criar'} professor.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisciplinaChange = (disciplinaId: number, checked: boolean) => {
    if (checked) {
      setDisciplinasSelecionadas([...disciplinasSelecionadas, disciplinaId]);
    } else {
      setDisciplinasSelecionadas(
        disciplinasSelecionadas.filter((id) => id !== disciplinaId)
      );
    }
  };

  return (
    <Layout>
      <h1>{isEdicao ? 'Editar' : 'Novo'} Professor</h1>
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
          <label className="form-label">Disciplinas</label>
          <div className="border p-3 rounded">
            {disciplinas.length === 0 ? (
              <p>Nenhuma disciplina disponível.</p>
            ) : (
              disciplinas.map((disciplina) => (
                <div key={disciplina.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`disciplina-${disciplina.id}`}
                    checked={disciplinasSelecionadas.includes(disciplina.id)}
                    onChange={(e) => handleDisciplinaChange(disciplina.id, e.target.checked)}
                    disabled={loading}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`disciplina-${disciplina.id}`}
                  >
                    {disciplina.nome}
                  </label>
                </div>
              ))
            )}
          </div>
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
            onClick={() => navigate('/professores')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default FormProfessor;