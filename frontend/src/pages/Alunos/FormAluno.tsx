import React, { useState } from 'react';
import { Aluno } from '../../types';
import { createAluno, updateAluno } from '../../services/alunoService';

interface Props {
  alunoEdit?: Aluno | null;
  onSave: () => void;
  onCancel: () => void;
}

const initialState: Omit<Aluno, 'id'> = {
  nome: '',
  sobrenome: '',
  email: '',
  cpf: '',
  ativo: true,
};

const FormAluno: React.FC<Props> = ({ alunoEdit, onSave, onCancel }) => {
  const [form, setForm] = useState<Omit<Aluno, 'id'>>(alunoEdit || initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateCPF = (cpf: string) => /^\d{11}$/.test(cpf);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.nome || !form.sobrenome || !form.email || !form.cpf) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    
    if (!validateCPF(form.cpf)) {
      setError('CPF deve conter 11 dígitos numéricos.');
      return;
    }
    
    setLoading(true);
    try {
      if (alunoEdit) {
        await updateAluno(alunoEdit.id, form);
      } else {
        await createAluno(form);
      }
      onSave();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao salvar aluno.');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          {alunoEdit ? 'Editar Aluno' : 'Novo Aluno'}
        </h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="sobrenome" className="form-label">Sobrenome</label>
              <input
                type="text"
                className="form-control"
                id="sobrenome"
                name="sobrenome"
                value={form.sobrenome}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input
                type="text"
                className="form-control"
                id="cpf"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                maxLength={11}
                placeholder="Apenas números"
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {alunoEdit ? 'Atualizando...' : 'Cadastrando...'}
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  {alunoEdit ? 'Atualizar' : 'Cadastrar'}
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAluno;
