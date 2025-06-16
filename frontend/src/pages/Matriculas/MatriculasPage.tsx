import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import ListaMatriculas from './ListaMatriculas';
import FormMatricula from './FormMatricula';

const MatriculasPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleNew = () => {
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setRefreshList(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="container-fluid">
        <h1>Gerenciar Matrículas</h1>
        
        {showForm ? (
          <FormMatricula 
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <ListaMatriculas 
            onNew={handleNew}
            refreshTrigger={refreshList}
          />
        )}
      </div>
    </Layout>
  );
};

export default MatriculasPage;
