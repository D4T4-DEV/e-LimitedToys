import React, { useState, useEffect } from 'react';
import './Home.css';

const images = [
  'src/img/newcollection.png',
  'src/img/promotional.png',
  'src/img/freeship.png',
];

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para cambiar la imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Función para ir a la imagen anterior o siguiente
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="home">
      <div className="carousel">
        <button className="carousel-btn prev" onClick={handlePrev}>❮</button>
        <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((src, index) => (
            <img key={index} src={src} alt="Ofertas" className="carousel-image" />
          ))}
        </div>
        <button className="carousel-btn next" onClick={handleNext}>❯</button>
      </div>
      <div className="products-grid">
        <h2>Productos Destacados</h2>
        <div className="product-list">
          {/* Aquí irían los productos */}
        </div>
      </div>
      <section id="contact" className="contact-section">
        <h2>Contacto</h2>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
        {/* Aquí puedes agregar un formulario o más detalles */}
      </section>
    </div>
  );
};

export default Home;
