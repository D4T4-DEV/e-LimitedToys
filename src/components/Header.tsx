import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoIcon from '../img/logo.png';
import defaultUserImgProfile from '../img/default-user.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { cargarImagenPerfil } from '../redux/Trunks/userTrunk';
import loadingGif from '../img/ezgif-5-c06c195611.gif';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, profileImage } = useSelector(
    (state: RootState) => state.users
  );

  const navigate = useNavigate();

  // Estado local para saber que imagen mostrar
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Función para redirigir al login
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Petición para obtener la imagen de perfil al cargar Redux
  useEffect(() => {
    if (currentUser) {
      dispatch(cargarImagenPerfil(currentUser));
    }
  }, [currentUser, dispatch]);

  // Efecto para verificar la imagen de perfil desde Redux
  useEffect(() => {
    if (profileImage) {
      setImageSrc(profileImage); // Si `profileImage` es valida lo usara
    } else {
      setImageSrc(defaultUserImgProfile); // Si no usara esto
    }
  }, [profileImage]);

  // Función para manejar errores en la carga de la imagen
  const handleImageError = () => {
    setImageSrc(defaultUserImgProfile); // Cambia a ícono predeterminado si ocurre un error
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
      <input
        className="search-bar"
        type="text"
        placeholder="🔍 Buscar productos..."
        aria-label="Buscar productos"
      />
      <div className="icons">
        <span>🛒</span>
        {currentUser ? (
          imageSrc ? (
            <img
              onClick={handleLoginClick}
              onError={handleImageError} // Maneja errores de carga
              style={{ cursor: 'pointer', width: '35px', height: '35px', borderRadius: '100%' }}
              src={imageSrc} // Usa la imagen obtenida desde Redux o la predeterminada
              alt="User"
              className="user-image"
            />
          ) : (
            <img
              src={loadingGif}
              alt="Cargando"
              className="loading"
              style={{ width: '10px', height: '10px' }}
            />
          )
        ) : (
          <span onClick={handleLoginClick} style={{ cursor: 'pointer' }}>👤</span>
        )}
      </div>
    </header>
  );
};

export default Header;
