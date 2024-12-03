import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import './ProfileIcon.css';
import logoIcon from '../img/logo.png';
import ProfileIcon from './ProfileIcon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { cargarImagenPerfil } from '../redux/Trunks/userTrunk';
import { cerrarSesion } from '../redux/Slides/userSlice';
import { msgCerrarSesion, msgQuererVerCarrito } from '../redux/Slides/notificationsSlice';
import { setSearchTerm } from '../redux/Slides/filterSlice';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {

  const [inputValue, setInputValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, profileImage } = useSelector(
    (state: RootState) => state.users
  );

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleProfileClick = () => {
    navigate('/mi-perfil');
    setDropdownOpen(false);
  };

  const handleShoppingCartClick = () => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      navigate('/carrito');
    } else {
      dispatch(msgQuererVerCarrito());
      navigate('/login');
    }
  };

  // Evento de cambio de datos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Evento enter en el input de busqueda
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(setSearchTerm(inputValue.toLowerCase())); // Pasa el termino buscado a la función que existe en redux
      navigate('/catalog'); // redirección
    }
  };

  // Función para redirigir al login
  const handleLogoutClick = () => {
    dispatch(cerrarSesion());
    dispatch(msgCerrarSesion());
    navigate('/login');
    setDropdownOpen(false);
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
      setImageSrc(null); // Si no usara esto
    }
  }, [profileImage]);

  // Esto para poder definir si esta mostrando o no un producto buscado para limpiar el campo y el redux
  useEffect(() => {
    // Verificamos la ruta corresponda al catalog
    if (location.pathname != '/catalog') {
      setInputValue('');
      dispatch(setSearchTerm(''))
    }
  }, [location]);

  return (
    <header className="header">
      <div className="header_logo">
        <Link to="/">
          <img src={logoIcon} alt="Logo" className="logo-image" />
        </Link>
      </div>
      <nav className="header_nav">
        <ul className="header_nav-list">
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
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        value={inputValue}
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
        {/*esto viene del componente ProfileIcon*/}
        {currentUser ? (
          <div className="dropdown">
            <ProfileIcon imageSrc={imageSrc} onClick={toggleDropdown} />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleProfileClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  height="14px" 
                  viewBox="0 -960 960 960" 
                  width="14px" 
                  fill="currentColor">
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                  </svg>
                  Ver Perfil</button>
                <button onClick={handleLogoutClick}>
                <svg xmlns="http://www.w3.org/2000/svg" 
                height="14px" 
                viewBox="0 -960 960 960" 
                width="14px" 
                fill="currentColor">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                  </svg>
                  Cerrar Sesión</button>
              </div>
            )}
          </div>
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
