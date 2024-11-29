import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './carrito.css';
import { AppDispatch, RootState } from '../redux/store';
import { buyProductsInShoppingCart, eliminatedProductToShoppingCart, fetchShoppingCart } from '../redux/Trunks/shoppingCartThunk';

const Carrito: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.shoppingCart);
    const { currentUser } = useSelector((state: RootState) => state.users);


    useEffect(() => {
        dispatch(fetchShoppingCart({ user_token: currentUser?.token, user_id: currentUser?.id_usuario }));
    }, [dispatch]);

    if (cart.status === 'loading') {
        return <div className="container-cart"><h2>Cargando carrito...</h2></div>;
    }

    if (cart.status === 'failed') {
        return <div className="container-cart"><h2>Error: {cart.error}</h2></div>;
    }

    const totalItems = cart.ids.reduce((total, id) => total + cart.entities[id].cantidad_seleccionada, 0);
    const totalPrice = cart.ids.reduce((total, id) => total + parseFloat(cart.entities[id].total_a_pagar), 0);
    const totalShipping = cart.ids.reduce((total, id) => total + parseFloat(cart.entities[id].precio_envio), 0);

    const handleClickToEliminate = async (id_producto: string) => {
        try {
            const data = {
                user_id: currentUser?.id_usuario,
                product_id: id_producto,
                user_token: currentUser?.token,
            };

            const response = await dispatch(eliminatedProductToShoppingCart(data));

            if (response.meta.requestStatus === 'fulfilled') {
                dispatch(fetchShoppingCart({ user_token: currentUser?.token, user_id: currentUser?.id_usuario }));
            }
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
        }
    };

    const handleClickToBuy = async () => {
        try {
            const data = {
                user_id: currentUser?.id_usuario,
                user_token: currentUser?.token
            };

            const response = await dispatch(buyProductsInShoppingCart(data));

            if (response.meta.requestStatus === 'fulfilled') {
                dispatch(fetchShoppingCart({ user_token: currentUser?.token, user_id: currentUser?.id_usuario }));
            }
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
        }
    };

    return (
        <div className="container-cart">
            <h1>Carrito de Compras</h1>
            <div className="cart-items">
                {cart.ids.map((id) => {
                    const item = cart.entities[id];
                    return (
                        <div className="cart-item" key={id}>
                            <img src={item.imagen_producto} alt={item.nombre_producto} className="item-image" />
                            <div className="item-details">
                                <h2>{item.nombre_producto}</h2>
                                <p><strong>Precio:</strong> ${item.precio_producto}</p>
                                <p><strong>Cantidad:</strong> {item.cantidad_seleccionada}</p>
                                <p><strong>Coste de envio:</strong> {item.precio_envio}</p>
                                <button className="remove-btn" onClick={() => handleClickToEliminate(`${id}`)}>Eliminar</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="cart-summary">
                <h2>Resumen</h2>
                <p className="preciot"><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
                <p className="preciote"><strong>Total de envío: ${totalShipping.toFixed(2)}</strong></p>
                <button className="checkout-btn" onClick={handleClickToBuy} >Finalizar Compra</button>
            </div>
        </div>
    );
};

export default Carrito;