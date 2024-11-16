import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';


const images = [
  'src/img/newcollection.png',
  'src/img/promotional.png',
  'src/img/freeship.png',
];

const featuredProducts = [
  { id: 1, name: 'Figura Funko Pop Marvel', price: 75, image: 'src/img/featured/featured1.png' },
  { id: 2, name: 'Youtooz Spongebob', price: 35, image: 'src/img/featured/featured2.png' },
  { id: 3, name: 'Figura de Deadpool with Wolverine Photo', price: 76, image: 'src/img/featured/featured3.png' },
  { id: 4, name: 'Figura Dragon Ball Super', price: 55, image: 'src/img/featured/featured4.png' },
  { id: 5, name: 'Figura Pickle Rick with Laser', price: 45, image: 'src/img/featured/featured5.png' },
  { id: 6, name: 'Figura de Acción Retro Power Rangers', price: 77, image: 'src/img/featured/featured6.png' },
];

const Home: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Cambiar imágenes del carrusel automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cambiar productos destacados automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevProduct = () => {
    setFeaturedIndex((prevIndex) => (prevIndex - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleNextProduct = () => {
    setFeaturedIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
  };

  const visibleProducts = featuredProducts
    .slice(featuredIndex, featuredIndex + 3)
    .concat(
      featuredProducts.slice(0, Math.max(0, 3 - (featuredProducts.length - featuredIndex)))
    );

  return (
    <div className="home">
      <div className="carousel">
        <button
          className="carousel-btn prev"
          onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
        >
          ❮
        </button>
        <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((src, index) => (
            <img key={index} src={src} alt="Ofertas" className="carousel-image" />
          ))}
        </div>
        <button
          className="carousel-btn next"
          onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
        >
          ❯
        </button>
      </div>
      <div className="text-section">
        <h2>Productos Destacados</h2>
        <div className="featured-carousel">
          <button className="carouself-btn prev" onClick={handlePrevProduct}>
            ❮
          </button>
          <div className="featured-slide">
            {visibleProducts.map((product) => (
              <div key={product.id} className="featured-product">
                <img src={product.image} alt={product.name} className="featured-image" />
                <div className="featured-caption">
                  <h4>{product.name}</h4>
                  <p>${product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carouself-btn next" onClick={handleNextProduct}>
            ❯
          </button>
        </div>
      </div>
      <section id="contact" className="text-section">
        <h2>Contacto</h2>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
      </section>
    </div>
  );
};

export default Home;
