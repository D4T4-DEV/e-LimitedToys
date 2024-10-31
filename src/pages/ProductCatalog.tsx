import React, { useState } from 'react';
import './ProductCatalog.css';

const sampleProducts = [
  { id: 1, name: 'Figura de Acción Edición Limitada', category: 'Figuras de Acción', price: 45, available: true },
  { id: 2, name: 'Coche de Colección Vintage', category: 'Vehículos de Colección', price: 95, available: false },
  { id: 3, name: 'Muñeca Clásica 1970', category: 'Muñecas de Colección', price: 70, available: true },
  { id: 4, name: 'Set LEGO Star Wars', category: 'Construcción', price: 40, available: false },
  { id: 5, name: 'Cartas Pokémon Primera Edición', category: 'Coleccionables', price: 30, available: true },
  { id: 6, name: 'Figura Funko Pop Rara', category: 'Figuras de Acción', price: 75, available: true },
  { id: 7, name: 'Juego de Mesa Vintage', category: 'Juegos de Mesa', price: 35, available: true },
  { id: 8, name: 'Nave de Star Wars Edición Especial', category: 'Vehículos de Colección', price: 100, available: false },
  { id: 9, name: 'Figura Anime Edición Limitada', category: 'Figuras de Acción', price: 85, available: true },
  { id: 10, name: 'Pista de Carrera Hot Wheels', category: 'Juegos de Mesa', price: 50, available: true },
  { id: 11, name: 'Muñeca Barbie de Colección', category: 'Muñecas de Colección', price: 25, available: true },
  { id: 12, name: 'Figura Transformers Clásico', category: 'Figuras de Acción', price: 68, available: false },
  { id: 13, name: 'Colección de Cartas Yugioh', category: 'Coleccionables', price: 48, available: true },
  { id: 14, name: 'Coche de Carrera Colección', category: 'Vehículos de Colección', price: 92, available: true },
  { id: 15, name: 'Figura de Marvel Edición Exclusiva', category: 'Figuras de Acción', price: 76, available: true },
  { id: 16, name: 'Edición Monopoly Star Wars', category: 'Juegos de Mesa', price: 100, available: false },
  { id: 17, name: 'Muñeco He-Man 1980', category: 'Figuras de Acción', price: 38, available: true },
  { id: 18, name: 'Réplica Batimóvil', category: 'Vehículos de Colección', price: 84, available: true },
  { id: 19, name: 'Juego de Mesa Clue Edición Retro', category: 'Juegos de Mesa', price: 25, available: true },
  { id: 20, name: 'Miniatura de Colección Harry Potter', category: 'Figuras de Acción', price: 65, available: false },
  { id: 21, name: 'Figura de Acción Batman Clásico', category: 'Figuras de Acción', price: 28, available: true },
  { id: 22, name: 'Colección Mini Coches Ferrari', category: 'Vehículos de Colección', price: 55, available: false },
  { id: 23, name: 'Figura Iron Man Edición Limitada', category: 'Figuras de Acción', price: 82, available: true },
  { id: 24, name: 'Juego de Mesa Edición Rareza', category: 'Juegos de Mesa', price: 47, available: false },
  { id: 25, name: 'Figura Transformers Autobot', category: 'Figuras de Acción', price: 75, available: true },
  { id: 26, name: 'Colección Miniaturas Marvel', category: 'Coleccionables', price: 35, available: true },
  { id: 27, name: 'Edición Especial Risk 50 Aniversario', category: 'Juegos de Mesa', price: 100, available: true },
  { id: 28, name: 'Figura Dragon Ball Z Goku', category: 'Figuras de Acción', price: 30, available: false },
  { id: 29, name: 'Cartas Coleccionables NBA', category: 'Coleccionables', price: 45, available: true },
  { id: 30, name: 'Figura de Acción Retro Power Rangers', category: 'Figuras de Acción', price: 77, available: true },
  // Productos de ejemplo para verificar la visualización de los productos
];

const ProductCatalog: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(100);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Función (que no es parte de la API) para filtrar los productos de ejemplo
  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = category ? product.category === category : true;
    const matchesPrice = product.price <= priceRange;
    const matchesAvailability = onlyAvailable ? product.available : true;
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
            <option value="Figuras de Acción">Figuras de Acción</option>
            <option value="Vehículos de Colección">Vehículos de Colección</option>
            <option value="Muñecas de Colección">Muñecas de Colección</option>
            <option value="Construcción">Construcción</option>
            <option value="Coleccionables">Coleccionables</option>
            <option value="Juegos de Mesa">Juegos de Mesa</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Rango de precio: ${priceRange}</label>
          <input
            type="range"
            min="25"
            max="100"
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
      <main className="products-grid-container">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <h4>{product.name}</h4>
                <p>Categoría: {product.category}</p>
                <p>${product.price}</p>
                <p>{product.available ? 'Disponible' : 'No disponible'}</p>
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
