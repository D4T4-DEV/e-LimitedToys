import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';



const Home: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchBanners = async (): Promise<void> => {
    try {
      const response = await axios.get('/api/obtener-banners');
      const banners = response.data.data?.bannersImgs || [];
  
      // Extraer los valores de img_url
      const imgUrls = banners.map((banner: { img_url: string }) => banner.img_url);

      // Pasamos al useState el valor de las imagenes que acabamos de obtener
      setImages(imgUrls);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        console.log("Datos adicionales del error:", errorData || 'Error en la petición');
        console.error("Error:", errorData);
      } else {
        console.error("Error no de axios", error);
      }
    }
  };

  // Funcion para obtener las imagenes provenientes de la API
  useEffect(() => {
    fetchBanners();
  }, []);

  // Función para cambiar la imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

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
      <div className="text-section">
        <h2>Productos Destacados</h2>
        <div className="product-list">
          {/* Aquí irían los productos */}
        </div>
      </div>
      <section id="contact" className="text-section">
        <h2>Contacto</h2>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
        {/* Aquí puedes agregar un formulario o más detalles */}
      </section>
    </div>
  );
};

export default Home;
