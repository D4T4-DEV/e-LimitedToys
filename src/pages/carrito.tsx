import './carrito.css';

const Carrito: React.FC = () => {
    return (
        <>
            <div className="container-cart">
                <h1>Carrito de Compras</h1>
                <div className="cart-items">
                    <div className="cart-item">
                        <img src="/path-to-item-image.jpg" alt="Nombre del Producto" className="item-image" />
                        <div className="item-details">
                            <h2>Nombre del producto</h2>
                            <p><strong>Precio:</strong> $333.00</p>
                            <p><strong>Cantidad:</strong> 1</p>
                            <button className="remove-btn">Eliminar</button>
                        </div>
                    </div>
                    <div className="cart-item">
                        <img src="/path-to-item-image.jpg" alt="Nombre del Producto" className="item-image" />
                        <div className="item-details">
                            <h2>Nombre del producto</h2>
                            <p><strong>Precio:</strong> $333.00</p>
                            <p><strong>Cantidad:</strong> 1</p>
                            <button className="remove-btn">Eliminar</button>
                        </div>
                    </div>
                    <div className="cart-item">
                        <img src="/path-to-item-image.jpg" alt="Nombre del Producto" className="item-image" />
                        <div className="item-details">
                            <h2>Nombre del producto</h2>
                            <p><strong>Precio:</strong> $333.00</p>
                            <p><strong>Cantidad:</strong> 1</p>
                            <button className="remove-btn">Eliminar</button>
                        </div>
                    </div>
                </div>
                <div className="cart-summary">
                    <h2>Resumen</h2>
                    <p className='preciot'><strong>Total: $999.00</strong></p>
                    <p className='preciote'><strong>Total de envío: $200.00</strong></p>
                    <button className="checkout-btn">Finalizar Compra</button>
                </div>
            </div>
        </>
    );
};

export default Carrito;
