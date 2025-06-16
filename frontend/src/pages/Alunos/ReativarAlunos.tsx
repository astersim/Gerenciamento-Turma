import React, { useEffect, useState } from 'react';
import { Aluno } from '../../types';
import { getAlunosInativos, reativarAluno, reativarAlunos } from '../../services/alunoService';
import Layout from '../../components/Layout/Layout';

const ReativarAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlunos, setSelectedAlunos] = useState<number[]>([]);
  const [search, setSearch] = useState<string>('');
  const [orderBy1, setOrderBy1] = useState<string>('nome');
  const [orderDir1, setOrderDir1] = useState<'asc' | 'desc'>('asc');
  const carregarAlunosInativos = async () => {
    try {
      setLoading(true);
      const data = await getAlunosInativos();
      setAlunos(data);
      setError(null);
    } catch (err) {
      // Se o endpoint não existir ainda, mostrar lista vazia
      setAlunos([]);
      setError(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunosInativos();
  }, []);

  const handleSelectAluno = (alunoId: number) => {
    setSelectedAlunos(prev => 
      prev.includes(alunoId) 
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
  };
  const handleSelectAll = () => {
    if (selectedAlunos.length === alunosInativos.length) {
      setSelectedAlunos([]);
    } else {
      setSelectedAlunos(alunosInativos.map(aluno => aluno.id));
    }
  };  const handleReativarIndividual = async (alunoId: number) => {
    try {
      await reativarAluno(alunoId);
      alert('Aluno reativado com sucesso!');
      carregarAlunosInativos();
    } catch (err) {
      setError('Erro ao reativar aluno.');
      console.error(err);
    }
  };
  const handleReativar = async () => {
    if (selectedAlunos.length === 0) {
      alert('Selecione pelo menos um aluno para reativar.');
      return;
    }

    try {
      await reativarAlunos(selectedAlunos);
      alert(`${selectedAlunos.length} aluno(s) reativado(s) com sucesso!`);
      setSelectedAlunos([]);
      carregarAlunosInativos();
    } catch (err) {
      setError('Erro ao reativar alunos.');
      console.error(err);
    }
  };

  // Aplicar filtros e ordenação
  let alunosInativos = alunos.filter(aluno => {
    const matchSearch = aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.sobrenome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.email.toLowerCase().includes(search.toLowerCase()) ||
      aluno.cpf.includes(search);
    return matchSearch;
  });

  // Ordenação
  alunosInativos.sort((a, b) => {
    const getValue = (obj: Aluno, field: string) => {
      switch (field) {
        case 'nome': return obj.nome;
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
    
    return comparison;
  });
  return (
    <Layout>
      <h1>Reativar Alunos</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <p className="text-muted">
          Selecione os alunos que deseja reativar. Alunos reativados voltarão a aparecer na listagem principal.
        </p>
      </div>

      <form className="row g-2 mb-3" onSubmit={e => { e.preventDefault(); carregarAlunosInativos(); }}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome ou CPF"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={orderBy1} onChange={e => setOrderBy1(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="email">Email</option>
            <option value="cpf">CPF</option>
            <option value="id">ID</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={orderDir1} onChange={e => setOrderDir1(e.target.value as 'asc' | 'desc')}>
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
      </form>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (        <>
          {alunosInativos.length > 0 && (
            <div className="mb-3">
              <button
                className="btn btn-success me-2"
                onClick={handleReativar}
                disabled={selectedAlunos.length === 0}
              >
                Reativar Selecionados ({selectedAlunos.length})
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleSelectAll}
              >
                {selectedAlunos.length === alunosInativos.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </button>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={alunosInativos.length > 0 && selectedAlunos.length === alunosInativos.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>                {alunosInativos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      {search ? 'Nenhum aluno inativo encontrado com os critérios de busca.' : 'Nenhum aluno inativo encontrado.'}
                    </td>
                  </tr>
                ) : (
                  alunosInativos.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedAlunos.includes(aluno.id)}
                          onChange={() => handleSelectAluno(aluno.id)}
                        />
                      </td>
                      <td>{aluno.nome} {aluno.sobrenome}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.cpf}</td><td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleReativarIndividual(aluno.id)}
                        >
                          Reativar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ReativarAlunos;
