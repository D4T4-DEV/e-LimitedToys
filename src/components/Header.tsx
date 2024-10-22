import React from 'react';
import './Header.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "e-LimitedToys" }) => {
  return (
    <header className="header">
      <div className="header_logo">
        <h1>{title}</h1>
      </div>
      <nav className="header_nav">
        <ul className="header_nav-list">
          <li className="header_nav-item"><a href="/" className="header_nav-link">Inicio</a></li>
          <li className="header_nav-item"><a href="/about" className="header_nav-link">Productos</a></li>
          <li className="header_nav-item"><a href="/contact" className="header_nav-link">Contacto</a></li>
        </ul>
      </nav>
      <input className="search-bar" type="text" placeholder="🔍 Buscar productos..." />
      <div className="icons">
        <span>🛒</span>
        <span>👤</span>
      </div>
    </header>
  );
};

export default Header;
