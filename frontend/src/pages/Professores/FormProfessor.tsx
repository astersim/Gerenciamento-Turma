import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createProfessor,
  getProfessor,
  updateProfessor,
} from '../../services/professorService';
import Layout from '../../components/Layout/Layout';

const FormProfessor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdicao = !!id;
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        if (isEdicao) {
          // Se for edição, carrega os dados do professor
          const professor = await getProfessor(parseInt(id));
          setNome(professor.nome);
          setCpf(professor.cpf);
          setTitulacao(professor.titulacao);
        }
        
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isEdicao) {
      carregarDados();
    }
  }, [id, isEdicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setError('Nome é obrigatório.');
      return;
    }
    if (!cpf.trim()) {
      setError('CPF é obrigatório.');
      return;
    }
    if (!/^[0-9]{11}$/.test(cpf.replace(/\D/g, ''))) {
      setError('CPF deve conter 11 dígitos numéricos.');
      return;
    }
    if (!titulacao.trim()) {
      setError('Titulação é obrigatória.');
      return;
    }
    if (!validarCPF(cpf)) {
      setError('CPF inválido.');
      return;
    }

    try {
      setLoading(true);
        const professorData = {
        nome,
        cpf,
        titulacao
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
    }  };

  function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

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
          <label htmlFor="cpf" className="form-label">
            CPF
          </label>
          <input
            type="text"
            className="form-control"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
            disabled={loading}
            required
            maxLength={11}
            pattern="[0-9]{11}"
            inputMode="numeric"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="titulacao" className="form-label">
            Titulação
          </label>
          <input
            type="text"
            className="form-control"
            id="titulacao"
            value={titulacao}
            onChange={(e) => setTitulacao(e.target.value)}
            disabled={loading}
            required
          />        </div>

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