import React, { useEffect, useState } from 'react';
import './ProductCatalog.css';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/Trunks/productsTrunks';
import { fetchFilterProducts } from '../redux/Trunks/filterThunks';
import { Product } from '../Interfaces/ProductInterface';
import { msgQuererComprar } from '../redux/Slides/notificationsSlice';
import { useNavigate } from 'react-router-dom';
import { addProductToShoppingCart } from '../redux/Trunks/shoppingCartThunk';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import loadingGif from '../img/ezgif-5-c06c195611.gif';

const ProductCatalog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState<string>(''); // Define la categoria (marca)
  const [priceMin, setPriceMin] = useState<string | number>(25); // Define el precio minimo
  const [priceMax, setPriceMax] = useState<string | number>(100); // Define el precio maximo 
  const [onlyAvailable, /*setOnlyAvailable*/] = useState<boolean>(false); // Define si solo si esta disponible o no
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Medio usado para mostrar el detalle del producto

  // Obtener el estado de Redux
  const { entities, ids, status, allProductsEntities, allProductsIds, allProductsStatus } = useSelector((state: RootState) => state.products);
  const { statusFilter, Marcas, precioMinimo, precioMaximo, searchTerm } = useSelector((state: RootState) => state.filter);
  const { currentUser } = useSelector((state: RootState) => state.users);

  const navigate = useNavigate();

  const openModal = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Vigilancia del valor minimo (previene valores negativos)
  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = Number(value);
    if (value === "" || numericValue < 0) {
      setPriceMin("");
    } else {
      const validValue = Math.min(Math.max(0, numericValue), Number(precioMaximo));
      setPriceMin(validValue);
    }
  };

  // Vigilancia del valor maximo (previene valores negativos)
  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = Number(value);
    if (value === "" || numericValue < 0) {
      setPriceMax("");
    } else {
      const validValue = Math.min(Math.max(0, numericValue), Number(precioMaximo));
      setPriceMax(validValue);
    }
  };

  // Funcion para evitar valores no deseados
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Evitar caracteres no deseados (estos siendo los euler y negativo)
    if (e.key === "e" || e.key === "-") {
      e.preventDefault();
    }
  };

  // Aspecto para obtener los productos 
  useEffect(() => {
    if (allProductsStatus === 'idle') {
      dispatch(fetchAllProducts());
    }
    if (allProductsStatus === 'failed') {
      // Temporizador a 10s
      const timer = setTimeout(() => {
        dispatch(fetchAllProducts()); // Reintentamos
      }, 10000);

      // Limpia el temporizador
      return () => clearTimeout(timer);
    }


  }, [dispatch, allProductsStatus]);

  // Aspecto para obtener los filtros 
  useEffect(() => {
    if (statusFilter === 'idle') {
      dispatch(fetchFilterProducts());
    }

    if (statusFilter === 'failed') {
      // Temporizador a 10s
      const timer = setTimeout(() => {
        dispatch(fetchFilterProducts()); // Reintentamos
      }, 10000);

      // Limpia el temporizador
      return () => clearTimeout(timer);
    }
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (statusFilter === 'succeeded') {
      setPriceMax(Number(precioMaximo) || 100);
      setPriceMin(Number(precioMinimo) || 0);
    }
  }, [statusFilter]);

  // Filtrar productos usando tanto `entities` como `allProductsEntities`
  const filteredProducts = [
    ...ids.map((id: string) => entities[id]),
    ...allProductsIds.map((id: string) => allProductsEntities[id])
  ].filter((product: any) => {
    const matchesSearch = product.nombre_producto.toLowerCase().includes(searchTerm) || product.descripcion?.toLowerCase().includes(searchTerm);
    const matchesCategory = category ? product.marca === category : true;
    const matchesPrice = product.precio_producto >= priceMin && product.precio_producto <= priceMax;
    const matchesAvailability = onlyAvailable ? product.existencia > 0 : true;
    return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
  });

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

      // Ejecutar el despachador
      const response = await dispatch(addProductToShoppingCart(data));

      // Manejo del resultados
      // console.log("Producto agregado al carrito:", response);
      if (response.payload === 'Cantidad excede las existencias disponibles en el inventario') {
        console.warn('No se agregado porque ya no tenemos tantos en stock');
        toast('Haz seleccionado el máximo de este producto', {
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
        return;
      }
      // Si todo va bien tomará esta acción
      toast('Agregaste este producto al carrito', {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: true,
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

  return (
    <div className="catalog-container">
      <aside className="filters-panel">
        <h3>Filtros</h3>
        <div className="filter-group">
          <label>Categoría:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas</option>
            {Marcas.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Rango de precios:</label>
          <div className="price-range">
            <input
              type="number"
              min='0'
              max={precioMaximo}
              value={priceMin === "" ? "" : priceMin}
              onChange={handlePriceMinChange}
              onKeyDown={handleKeyDown}
              placeholder="Mín"
              inputMode="decimal"
            />
            <span> - </span>
            <input
              type="number"
              min="0"
              max={precioMaximo}
              value={priceMax === "" ? "" : priceMax}
              onChange={handlePriceMaxChange}
              onKeyDown={handleKeyDown}
              placeholder="Máx"
              inputMode="decimal"
            />
          </div>
        </div>
      </aside>

      {/* Contenedor de los productos  */}
      <main className="products-grid-container">
        {status === 'loading' || allProductsStatus === 'loading' ? (
          <div
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <img
              src={loadingGif}
              alt="Cargando productos"
              className="loading"
            />
          </div>
        ) : allProductsStatus === 'failed' ? (
          <p style={{ textAlign: 'center' }}>Ha ocurrido un error, lo volveremos a intentar 🙌</p>
        ) :
          filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id_producto} className="product-card" onClick={() => openModal(product)}>
                  <img src={product.imagenes_producto} alt={product.nombre_producto} className="product-image" />
                  <h4>{product.nombre_producto}</h4>
                  <p>Marca: {product.marca}</p>
                  <p className='price'>${product.precio_producto}</p>
                  <p>{product.existencia! > 0 ? 'Disponible' : 'Agotado'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">No se encontraron productos.</div>
          )}
      </main>
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

export default ProductCatalog;
