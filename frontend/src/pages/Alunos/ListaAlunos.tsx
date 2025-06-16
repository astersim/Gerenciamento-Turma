import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Aluno } from '../../types';
import { getAlunos, deleteAluno } from '../../services/alunoService';
import StatusBadge from '../../components/ui/StatusBadge';

const ListaAlunos: React.FC<{ onEdit: (aluno: Aluno) => void; onNew: () => void }> = ({ onEdit, onNew }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [search, setSearch] = useState<string>('');
  const [mostrarInativos, setMostrarInativos] = useState<boolean>(false);
  const [orderBy1, setOrderBy1] = useState<string>('nome');
  const [orderDir1, setOrderDir1] = useState<'asc' | 'desc'>('asc');
  const [orderBy2, setOrderBy2] = useState<string>('');
  const [orderDir2, setOrderDir2] = useState<'asc' | 'desc'>('asc');  const fetchAlunos = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar apenas alunos ativos (ativo: true) por padrão
      const params = { ativo: !mostrarInativos };
      setAlunos(await getAlunos(params));
      setError(null);
    } catch {
      setError('Erro ao buscar alunos.');
    }
    setLoading(false);
  }, [mostrarInativos]);  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Deseja realmente excluir este aluno?')) {
      try {
        await deleteAluno(id);
        fetchAlunos();
      } catch {
        setError('Erro ao excluir aluno.');
      }
    }
  };  const alunosFiltrados = alunos.filter(aluno => {
    const matchSearch = aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.sobrenome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.email.toLowerCase().includes(search.toLowerCase()) ||
      aluno.cpf.includes(search);
    
    return matchSearch;
  });

  // Aplicar ordenação
  alunosFiltrados.sort((a, b) => {
    const getValue = (obj: Aluno, field: string) => {
      switch (field) {
        case 'nome': return obj.nome;
        case 'sobrenome': return obj.sobrenome;
        case 'email': return obj.email;
        case 'cpf': return obj.cpf;
        case 'id': return obj.id;
        default: return '';
      }
    };

    const val1 = getValue(a, orderBy1);
    const val2 = getValue(b, orderBy1);
    
    let comparison = 0;
    if (val1 < val2) comparison = -1;
    if (val1 > val2) comparison = 1;
    
    if (orderDir1 === 'desc') comparison *= -1;
    
    // Segunda ordenação se a primeira for igual
    if (comparison === 0 && orderBy2) {
      const val1_2 = getValue(a, orderBy2);
      const val2_2 = getValue(b, orderBy2);
      
      if (val1_2 < val2_2) comparison = -1;
      if (val1_2 > val2_2) comparison = 1;
      
      if (orderDir2 === 'desc') comparison *= -1;
    }
    
    return comparison;
  });

  if (loading) return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  return (
    <>
      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); fetchAlunos(); }}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome, sobrenome, email ou CPF"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>        <div className="col-md-2">
          <select className="form-select" value={orderBy1} onChange={e => setOrderBy1(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="sobrenome">Sobrenome</option>
            <option value="email">Email</option>
            <option value="cpf">CPF</option>
          </select>
        </div>
        <div className="col-md-1">
          <select className="form-select" value={orderDir1} onChange={e => setOrderDir1(e.target.value as 'asc' | 'desc')}>
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
        <div className="col-md-2">          <select className="form-select" value={orderBy2} onChange={e => setOrderBy2(e.target.value)}>
            <option value="">(2º ordenação)</option>
            <option value="nome">Nome</option>
            <option value="sobrenome">Sobrenome</option>
            <option value="email">Email</option>
            <option value="cpf">CPF</option>
          </select>
        </div>
        <div className="col-md-1">
          <select className="form-select" value={orderDir2} onChange={e => setOrderDir2(e.target.value as 'asc' | 'desc')}>
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-outline-primary w-100">Buscar</button>        </div>
      </form>
      
      <div className="d-flex justify-content-between mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="mostrarInativos"
            checked={mostrarInativos}
            onChange={e => setMostrarInativos(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mostrarInativos">
            Mostrar alunos inativos
          </label>
        </div>        <div>
          <button className="btn btn-primary me-2" onClick={onNew}>
            Novo Aluno
          </button>
          <Link to="/alunos/reativar" className="btn btn-outline-success">
            Reativar Alunos
          </Link>
        </div>
      </div><div className="table-responsive">
        <table className="table table-striped">          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>            {alunosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  {search ? 'Nenhum aluno encontrado com os critérios de busca.' : 'Nenhum aluno cadastrado.'}
                </td>
              </tr>
            ) : (
              alunosFiltrados.map(aluno => (
                <tr key={aluno.id}>
                  <td>{aluno.nome} {aluno.sobrenome}</td>
                  <td>{aluno.email}</td>                  <td>
                    <StatusBadge active={aluno.ativo} />
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => onEdit(aluno)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(aluno.id)}
                    >
                      Desativar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListaAlunos;
