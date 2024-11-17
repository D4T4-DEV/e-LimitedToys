import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logoIcon from "../img/logo.png";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();

  // Función para redirigir al login
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header_logo">
        <img src={logoIcon} alt="Logo" className="logo-image" />
      </div>
      <nav className="header_nav">
        <ul className="header_nav-list">
          <li className="header_nav-item">
            <Link to="/" className="header_nav-link">
              Inicio
            </Link>
          </li>
          <li className="header_nav-item">
            <Link to="/catalog" className="header_nav-link">
              Catálogo
            </Link>
          </li>
          <li className="header_nav-item">
            <Link to="/contact" className="header_nav-link">
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
      <input
        className="search-bar"
        type="text"
        placeholder="🔍 Buscar productos..."
      />
      <div className="icons">
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bag"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
          </svg>
        </span>
        <span className="icon" onClick={handleLoginClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="user"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </span>
      </div>
    </header>
  );
};

export default Header;
