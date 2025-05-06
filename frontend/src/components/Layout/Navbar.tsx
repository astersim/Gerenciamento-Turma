import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Gerenciamento de Turmas
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/disciplinas">
                Disciplinas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/professores">
                Professores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/salas">
                Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/turmas">
                Turmas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;