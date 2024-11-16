import React, { useState } from 'react';
import './ProductCatalog.css';

const sampleProducts = [
  { id: 1, name: 'Dragon Ball Flash 4" Vegeta', category: 'Bandai', price: 45, available: true, image: 'src/img/products/product1.png' },
  { id: 2, name: 'Shoto Todoroki My Hero Academia', category: 'Banpresto', price: 95, available: false, image: 'src/img/products/product2.png' },
  { id: 3, name: 'Naruto Shippuden Naruto Uzumaki Nendoroid', category: 'Good Smile', price: 70, available: true, image: 'src/img/products/product3.png' },
  { id: 4, name: 'Monkey D. Luffy One Piece', category: 'Banpresto', price: 40, available: false, image: 'src/img/products/product4.png' },
  { id: 5, name: 'Demon Slayer Vibration Stars Sanemi Shinazugawa', category: 'Bandai', price: 30, available: true, image: 'src/img/products/product5.png' },
  { id: 6, name: 'Funko Pop Spider-Man (Swinging)', category: 'Funko', price: 75, available: true, image: 'src/img/products/product6.png' },
  { id: 7, name: 'Bob Esponja Shoulder Rider', category: 'Youtooz', price: 35, available: true, image: 'src/img/products/product7.png' },
  { id: 8, name: 'Funko Pop Darth Vader 610', category: 'Funko', price: 100, available: false, image: 'src/img/products/product8.png' },
  { id: 9, name: 'Hatsune Miku: Holographic', category: 'Good Smile', price: 85, available: true, image: 'src/img/products/product9.png' },
  { id: 10, name: 'Sunflower Plush', category: 'Youtooz', price: 50, available: true, image: 'src/img/products/product10.png' },
  { id: 11, name: 'Naruto Shipudden Vibration Stars-Hyuga Hinata', category: 'Banpresto', price: 25, available: true, image: 'src/img/products/product11.png' },
  { id: 12, name: 'MG 1/100 Sengoku Astary Gundam', category: 'Bandai', price: 68, available: false, image: 'src/img/products/product12.png' },
  { id: 13, name: 'figma D.Va', category: 'Good Smile', price: 48, available: true, image: 'src/img/products/product13.png' },
  { id: 14, name: 'de One Piece Zoro', category: 'Banpresto', price: 92, available: true, image: 'src/img/products/product14.png' },
  { id: 15, name: 'de Deadpool with Wolverine Photo', category: 'Funko', price: 76, available: true, image: 'src/img/products/product15.png' },
  { id: 16, name: 'Star Wars Baby Yoda', category: 'Funko', price: 100, available: false, image: 'src/img/products/product16.png' },
  { id: 17, name: 'Tokyo Ghoul', category: 'Good Smile', price: 38, available: true, image: 'src/img/products/product17.png' },
  { id: 18, name: 'Saint Seiya', category: 'Bandai', price: 84, available: true, image: 'src/img/products/product18.png' },
  { id: 19, name: 'Youtooz Avatar: The Last Airbender', category: 'Youtooz', price: 25, available: true, image: 'src/img/products/product19.png' },
  { id: 20, name: 'Funko Pop Harry Potter', category: 'Funko', price: 65, available: false, image: 'src/img/products/product20.png' },
  { id: 21, name: 'de Tokyo Revengers', category: 'Banpresto', price: 28, available: true, image: 'src/img/products/product21.png' },
  { id: 22, name: 'Dragon Ball Super', category: 'Bandai', price: 55, available: false, image: 'src/img/products/product22.png' },
  { id: 23, name: 'Iron Man', category: 'Funko', price: 82, available: true, image: 'src/img/products/product23.png' },
  { id: 24, name: 'Nendoroid Kirby', category: 'Good Smile', price: 47, available: false, image: 'src/img/products/product24.png' },
  { id: 25, name: 'Transformers', category: 'Youtooz', price: 75, available: true, image: 'src/img/products/product25.png' },
  { id: 26, name: 'My Hero Academia Deku', category: 'Banpresto', price: 35, available: true, image: 'src/img/products/product26.png' },
  { id: 27, name: 'Evangelion Unit-01', category: 'Good Smile', price: 100, available: true, image: 'src/img/products/product27.png' },
  { id: 28, name: 'Dragon Ball Z Goku', category: 'Bandai', price: 30, available: false, image: 'src/img/products/product28.png' },
  { id: 29, name: 'Pickle Rick with Laser', category: 'Funko', price: 45, available: true, image: 'src/img/products/product29.png' },
  { id: 30, name: 'de Acción Retro Power Rangers', category: 'Bandai', price: 77, available: true, image: 'src/img/products/product30.png' },
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
                <img src={product.image} alt={product.name} className="product-image" />
                <h4>{product.name}</h4>
                <p>Categoría: {product.category}</p>
                <p className='price'>${product.price}</p>
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
