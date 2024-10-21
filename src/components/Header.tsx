import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">e-LimitedToys</div>
      <nav className="nav-links">
        <a href="/" className="nav-link">Inicio</a>
        <a href="/" className="nav-link">Productos</a>
        <a href="#contact" className="nav-link">Contacto</a>
      </nav>
      <input className="search-bar" type="text" placeholder="Buscar..." />
      <div className="icons">
        <span>🛒</span>
        <span>👤</span>
      </div>
    </header>
  );
}

export default Header;
