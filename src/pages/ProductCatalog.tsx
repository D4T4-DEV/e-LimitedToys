import React, { useEffect, useState } from 'react';
import './ProductCatalog.css';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/Trunks/productsTrunks';

const ProductCatalog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Obtener el estado de Redux
  const { entities, ids, status, error, allProductsEntities, allProductsIds, allProductsStatus } = useSelector((state: RootState) => state.products);

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
    const matchesPrice = product.precio_producto <= priceRange;
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
          <label>Rango de precio: ${priceRange}</label>
          <input
            type="range"
            min="25"
            max="10000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
        </div>
        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Solo disponibles
          </label>
        </div>
      </aside>

      {/* Contenedor de los productos  */}
      <main className="products-grid-container">
        {status === 'loading' || allProductsStatus === 'loading' ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p>{error}</p>
        ) :
          filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id_producto} className="product-card">
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
    </div>
  );
};

export default ProductCatalog;
