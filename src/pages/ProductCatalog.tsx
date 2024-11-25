import React, { useEffect, useState } from 'react';
import './ProductCatalog.css';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/Trunks/productsTrunks';

const ProductCatalog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState<string>('');
  const [priceMin, setPriceMin] = useState<number>(25);
  const [priceMax, setPriceMax] = useState<number>(100);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Obtener el estado de Redux
  const { entities, ids, status, error, allProductsEntities, allProductsIds, allProductsStatus } = useSelector((state: RootState) => state.products);

  const openModal = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Aspecto para obtener los productos 
  useEffect(() => {
    if (allProductsStatus === 'idle') {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, allProductsStatus]);

  // Filtrar productos usando tanto `entities` como `allProductsEntities`
  const filteredProducts = [
    ...ids.map((id: string) => entities[id]),
    ...allProductsIds.map((id: string) => allProductsEntities[id])
  ].filter((product: any) => {
    const matchesCategory = category ? product.marca === category : true;
    const matchesPrice = product.precio_producto >= priceMin && product.precio_producto <= priceMax;
    const matchesAvailability = onlyAvailable ? product.existencia > 0 : true;
    return matchesCategory && matchesPrice && matchesAvailability;
  });

  return (
    <div className="catalog-container">
      <aside className="filters-panel">
        <h3>Filtros</h3>
        <div className="filter-group">
          <label>Categoría:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas</option>
            <option value="Bandai">Bandai</option>
            <option value="Banpresto">Banpresto</option>
            <option value="Good Smile">Good Smile</option>
            <option value="Funko">Funko</option>
            <option value="Youtooz">Youtooz</option>
          </select>
        </div>
        <div className="filter-group">
        <label>Rango de precios:</label>
          <div className="price-range">
            <input
              type="number"
              min="25"
              max="100"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              placeholder="Mín"
            />
            <span> - </span>
            <input
              type="number"
              min="25"
              max="100"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              placeholder="Máx"
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
              src="src\img\ezgif-1-b97dfccf49.gif"
              alt="Cargando productos"
              className="loading"
            />
          </div>
        ) : error ? (
          <p>{error}</p>
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
              <h3>Descripción de la Franquicia</h3>
              <p>{selectedProduct.franchiseDescription}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
