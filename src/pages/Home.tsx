import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <div className="carousel">
        <img src="https://dummyimage.com/1920x500/fff/aaa" alt="Ofertas" />
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

      <Footer />
    </div>
  );
}

export default Home;
