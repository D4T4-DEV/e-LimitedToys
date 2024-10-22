import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="carousel">
        <img src="src\img\promotional.png" alt="Ofertas" />
      </div>
      <div className="products-grid">
        <h2>Productos Destacados</h2>
        <div className="product-list">
          {/* Aquí irían los productos */}
        </div>
      </div>
      {/* Sección de contacto */}
      <section id="contact" className="contact-section">
        <h2>Contacto</h2>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
        {/* Aquí puedes agregar un formulario o más detalles */}
      </section>
    </div>
  );
};

export default Home;