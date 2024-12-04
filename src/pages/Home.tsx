import React, { useState, useEffect, useMemo } from 'react';
import './Home.css';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../redux/Trunks/productsTrunks';
import { fetchBanners } from '../redux/Trunks/bannerTrunks';
import { addProductToShoppingCart } from '../redux/Trunks/shoppingCartThunk';
import { Product } from '../Interfaces/ProductInterface';
import { useNavigate } from 'react-router-dom';
import { msgQuererComprar } from '../redux/Slides/notificationsSlice';
import { toast, Bounce, ToastContainer } from 'react-toastify';

const Home: React.FC = () => {

  // Uso del redux
  const dispatch = useDispatch<AppDispatch>();
  const { images, status: bannersStatus, error: bannersError } = useSelector((state: RootState) => state.banners);
  const { featuredEntities, featuredIds, status: productsStatus, error: productsError } = useSelector((state: RootState) => state.products);
  const { currentUser } = useSelector((state: RootState) => state.users);

  const navigate = useNavigate();

  //Aspecto para cambiar lo mostrado (img o productos)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const openModal = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Uso de useMemo para evitar el sobre calculo ya que estos siempre serian estaticos entre las diferentes semanas
  const productosDestacados = useMemo(() => {
    return featuredIds.map(id => featuredEntities[id]); // Obtenemos su valor dado el id
  }, [featuredIds, featuredEntities]);


  // Aspecto para obtener los banners 
  useEffect(() => {
    if (bannersStatus === 'idle') {
      dispatch(fetchBanners());
    }
    if (bannersStatus === 'failed') {
      // Temporizador a 10s
      const timer = setTimeout(() => {
        dispatch(fetchBanners()); // Reintentamos
      }, 10000);

      // Limpia el temporizador
      return () => clearTimeout(timer);
    }
  }, [dispatch, bannersStatus]);

  // Aspecto para obtener los productos destacados 
  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchFeaturedProducts());
    }

    if (productsStatus === 'failed') {
      // Temporizador a 10s
      const timer = setTimeout(() => {
        dispatch(fetchFeaturedProducts()); // Reintentamos
      }, 10000);

      // Limpia el temporizador
      return () => clearTimeout(timer);
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

  // Evento para comprar
  const handleClickToShopping = async (product: Product) => {

    if (!currentUser || Object.keys(currentUser).length === 0) {
      // Dispatch de un mensaje informativo
      dispatch(msgQuererComprar());

      // Redirige al usuario a la página de inicio de sesión
      navigate('/login');
      return; // Sale de esta funcion
    }

    try {
      // Datos que a enviar
      const data = {
        user_id: currentUser?.id_usuario,
        product_id: product.id_producto,
        user_token: currentUser?.token,
        existencias: '1',
      };

      // Ejecutar el despachador para agregar el producto al carrito
      const response = await dispatch(addProductToShoppingCart(data));

      // Manejo de los resultados del despachador
      if (response.payload === 'Cantidad excede las existencias disponibles en el inventario') {
        console.warn('No se agregado porque ya no tenemos tantos en stock');
        toast('Haz seleccionado el máximo de este producto', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }
      // Si todo va bien tomará esta acción
      toast('Agregaste este producto al carrito', {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error('Ha ocurrido un error, intentalo más tarde...', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
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
      {bannersStatus === 'loading' && <p style={{color: 'black', textAlign:'center'}}>Cargando banners...</p>}
      {bannersStatus === 'failed' && <p style={{color: 'black', textAlign:'center'}}>Ha ocurrido un error, lo volveremos a intentar 🙌</p>}
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
        {productsStatus === 'loading' && <p>Cargando productos destacados...</p>}
        {productsStatus === 'failed' && <p>Ha ocurrido un error, lo volveremos a intentar 🙌</p>}
        {productsStatus === 'succeeded' && (
          <div className="featured-carousel">
            <button className="carouself-btn prev" onClick={handlePrevProduct}>
              ❮
            </button>
            <div className="featured-slide">
              {visibleProducts.map((product) => (
                // product-card not-available
                <div key={product.id_producto} className={product.existencia === 0 ? 'featured-product not-available' : "featured-product"} onClick={() => openModal(product)}>
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
                    <p className='price'>${product.precio_producto}</p>
                    {/* <button className="add-btn" onClick={() => handleClickToShopping(product)}>Agregar a la bolsa</button> */}
                    {product.existencia === 0 ? <p className='not-stock'>Agotado</p> : <p className='stock'>Disponible</p>}
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

      <div className="text-section">
        <h2>Conoce a las Empresas</h2>
        <p>Descubre algunas de todas las marcas que puedes encontrar aquí con las colección más sorprendentes y de alta calidad.</p>
        <div className="brands-grid">
          {[
            {
              name: "Funko",
              description: "Funko lidera en figuras Pop! de vinilo, capturando personajes icónicos de películas, videojuegos y series con un diseño único que encanta tanto a aficionados casuales como a coleccionistas exigentes.",
            },
            {
              name: "Bandai",
              description: "Bandai destaca por figuras y modelos icónicos como Gundam y Dragon Ball, ofreciendo calidad excepcional en productos que conectan generaciones de fans y celebran la cultura pop japonesa.",
            },
            {
              name: "Youtooz",
              description: "Youtooz crea figuras exclusivas en colaboración con creadores digitales, reflejando estilos únicos y lanzando ediciones limitadas que son altamente valoradas por coleccionistas de la cultura digital moderna.",
            }

          ].map((brand, index) => (
            <div key={index} className="brand-card">
              <h2>{brand.name}</h2>
              <p>{brand.description}</p>
            </div>
          ))}
        </div>
      </div>

      <section id="contact" className="text-section">
        <h2>Contacto</h2>
        <p>Si tienes alguna pregunta, por favor contáctanos <a href="/contact" className="contact-link">aquí</a>.</p>
      </section>
      {/* Modal para mostrar los detalles del producto */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-header">
              <img
                src={selectedProduct.imagenes_producto}
                alt={selectedProduct.nombre_producto}
                className="modal-product-image"
              />
            </div>
            <div className="modal-body">
              <h1>{selectedProduct.nombre_producto}</h1>
              <p>{selectedProduct.descripcion}</p>
              <h3>${selectedProduct.precio_producto}</h3>
              <button className="add-btn" onClick={() => handleClickToShopping(selectedProduct)}>Agregar a la bolsa</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;