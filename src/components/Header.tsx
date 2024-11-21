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
    if (currentUser && Object.keys(currentUser).length > 0) {
      navigate('/mi-perfil');
    } else {
      navigate('/login');
    }
  };

  const handleShoppingCartClick = () => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      navigate('/mi-carrito');
    } else {
      navigate('/login');
    }
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
        aria-label="Buscar productos"
      />
      <div className="icons">
        <span className="icon" onClick={handleShoppingCartClick}>
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
        {currentUser ? (
          <span className="icon" onClick={handleLoginClick}>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Perfil"
                className="profile-image"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
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
            )}
          </span>
        ) : (
          <span className="icon" onClick={handleLoginClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
            </svg>
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
