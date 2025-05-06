import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* Layout content */}
      {children}
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4">Sistema de Gerenciamento de Turmas</h1>
          <p className="lead">Selecione uma opção para começar</p>
        </div>
        
        <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
          <div className="col">
            <div className="card h-100">
              <div className="card-body text-center">
                <h2 className="card-title">Disciplinas</h2>
                <p className="card-text">
                  Gerencie as disciplinas oferecidas na instituição.
                </p>
                <Link to="/disciplinas" className="btn btn-primary">
                  Acessar Disciplinas
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col">
            <div className="card h-100">
              <div className="card-body text-center">
                <h2 className="card-title">Professores</h2>
                <p className="card-text">
                  Gerencie o cadastro de professores e suas disciplinas.
                </p>
                <Link to="/professores" className="btn btn-primary">
                  Acessar Professores
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col">
            <div className="card h-100">
              <div className="card-body text-center">
                <h2 className="card-title">Salas</h2>
                <p className="card-text">
                  Gerencie as salas disponíveis para as turmas.
                </p>
                <Link to="/salas" className="btn btn-primary">
                  Acessar Salas
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col">
            <div className="card h-100">
              <div className="card-body text-center">
                <h2 className="card-title">Turmas</h2>
                <p className="card-text">
                  Gerencie as turmas, associando disciplinas e salas.
                </p>
                <Link to="/turmas" className="btn btn-primary">
                  Acessar Turmas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;