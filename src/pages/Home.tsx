import React, { useState, useEffect, useMemo } from 'react';
import './Home.css';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../redux/Trunks/productsTrunks';
import { fetchBanners } from '../redux/Trunks/bannerTrunks';

const Home: React.FC = () => {

  // Uso del redux
  const dispatch = useDispatch<AppDispatch>();
  const { images, status: bannersStatus, error: bannersError } = useSelector((state: RootState) => state.banners);
  const { featuredEntities, featuredIds, status: productsStatus, error: productsError } = useSelector((state: RootState) => state.products);
  
  //Aspecto para cambiar lo mostrado (img o productos)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  
  // Uso de useMemo para evitar el sobre calculo ya que estos siempre serian estaticos entre las diferentes semanas
  const productosDestacados = useMemo(() => {
    return featuredIds.map(id => featuredEntities[id]); // Obtenemos su valor dado el id
  }, [featuredIds, featuredEntities]);


  // Aspecto para obtener los banners 
  useEffect(() => {
    if (bannersStatus === 'idle') {
      dispatch(fetchBanners());
    }
  }, [dispatch, bannersStatus]);

  // Aspecto para obtener los productos destacados 
  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchFeaturedProducts());
    }
  }, [dispatch, productsStatus]);

  // Cambiar imágenes del carrusel automáticamente
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images]);
  
  // Función para ir a la imagen anterior o siguiente
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Cambiar productos destacados automáticamente
  useEffect(() => {
    if (productosDestacados.length > 0) {
      const interval = setInterval(() => {
        setFeaturedIndex((prevIndex) => (prevIndex + 1) % productosDestacados.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [productosDestacados]);

  // Función para ir al producto destacado anterior o siguiente
  const handlePrevProduct = () => {
    setFeaturedIndex((prevIndex) => (prevIndex - 1 + productosDestacados.length) % productosDestacados.length);
  };

  const handleNextProduct = () => {
    setFeaturedIndex((prevIndex) => (prevIndex + 1) % productosDestacados.length);
  };

  // Funcion para mostrar solo 3 productos destacados
  const visibleProducts = productosDestacados.length <= 3
    ? productosDestacados // Mostrar todos los productos si son menores de 3
    : productosDestacados
      .slice(featuredIndex, featuredIndex + 3)
      .concat(
        productosDestacados.slice(0, Math.max(0, 3 - (productosDestacados.length - featuredIndex)))
      )
      .slice(0, 3);

  return (
    <div className="home">
      {bannersStatus === 'loading' && <p>Cargando banners...</p>}
      {bannersStatus === 'failed' && <p>Error banners: {bannersError}</p>}
      {bannersStatus === 'succeeded' && (
        <>
          <div className="carousel">
            <button className="carousel-btn prev" onClick={handlePrev}>❮</button>
            <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((src, index) => (
                <img key={index} src={src} alt="Ofertas" className="carousel-image" />
              ))}
            </div>
            <button className="carousel-btn next" onClick={handleNext}>❯</button>
          </div>
        </>
      )}

      <div className="text-section">
        <h2>Productos Destacados</h2>
        {productsStatus === 'loading' && <p>Cargando productos...</p>}
        {productsStatus === 'failed' && <p>Error productos: {productsError}</p>}
        {productsStatus === 'succeeded' && (
          <div className="featured-carousel">
            <button className="carouself-btn prev" onClick={handlePrevProduct}>
              ❮
            </button>
            <div className="featured-slide">
              {visibleProducts.map((product) => (
                <div key={product.id_producto} className="featured-product">
                  {/* Solo muestra la primera imagen del producto */}
                  {product.imagenes_producto && product.imagenes_producto.length > 0 && (
                    <img
                      src={product.imagenes_producto[0]}
                      alt={product.nombre_producto}
                      className="featured-image"
                    />
                  )}
                  <div className="featured-caption">
                    <h4>{product.nombre_producto}</h4>
                    <p>${product.precio_producto}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="carouself-btn next" onClick={handleNextProduct}>
              ❯
            </button>
          </div>
        )}
      </div>

      <section id="contact" className="text-section">
        <h2>Contacto</h2>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
      </section>
    </div>
  );
};

export default Home;