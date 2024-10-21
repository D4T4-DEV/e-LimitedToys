import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div>© 2024 e-LimitedToys</div>
      <div className="links">
        <a href="#">Política de privacidad</a>
        <a href="#">Contacto</a>
        <a href="#">Preguntas frecuentes</a>
      </div>
    </footer>
  );
}

export default Footer;
