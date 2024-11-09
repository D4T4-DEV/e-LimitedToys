import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoIcon from '../img/logo.png';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();

  // Función para redirigir al login
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header_logo">
        <img src={logoIcon} alt="Logo" className="logo-image" />
      </div>
      <nav className="header_nav">
        <ul className="header_nav-list">
          <li className="header_nav-item">
            <Link to="/" className="header_nav-link">Inicio</Link>
          </li>
          <li className="header_nav-item">
            <Link to="/catalog" className="header_nav-link">Catálogo</Link>
          </li>
          <li className="header_nav-item">
            <Link to="/contact" className="header_nav-link">Contacto</Link>
          </li>
        </ul>
      </nav>
      <input className="search-bar" type="text" placeholder="🔍 Buscar productos..." />
      <div className="icons">
        <span>🛒</span>
        <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>👤</span>
      </div>
    </header>
  );
};

export default Header;
