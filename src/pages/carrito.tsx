import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './carrito.css';
import { AppDispatch, RootState } from '../redux/store';
import { buyProductsInShoppingCart, eliminatedProductToShoppingCart, fetchShoppingCart } from '../redux/Trunks/shoppingCartThunk';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const Carrito: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.shoppingCart);
    const { currentUser } = useSelector((state: RootState) => state.users);


    useEffect(() => {
        dispatch(fetchShoppingCart({ user_token: currentUser?.token, user_id: currentUser?.id_usuario }));
    }, [dispatch]);

    if (cart.status === 'loading') {
        return <div className="cart-status"><h2 className="cart-status-message">Cargando carrito...</h2></div>;
    }

    if (cart.status === 'failed') {
        return (
            <div className="cart-empty">
                <h2 className="cart-empty-title">Tu carrito está vacío</h2>
                <p className="cart-empty-message">Explora nuestra tienda y encuentra algo que te encante.</p>
            </div>
        );
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
                toast('Eliminaste el producto', {
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
                // Retrasar la actualización del carrito
                setTimeout(() => {
                    dispatch(fetchShoppingCart({
                        user_token: currentUser?.token,
                        user_id: currentUser?.id_usuario
                    }));
                }, 1000);
                console.log('Ha eliminado un producto');
            }
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            toast.error('Ha ocurrido un error, intentalo mas tarde...', {
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

    const handleClickToBuy = async () => {
        try {
            const data = {
                user_id: currentUser?.id_usuario,
                user_token: currentUser?.token
            };

            const response = await dispatch(buyProductsInShoppingCart(data));

            if (response.meta.requestStatus === 'fulfilled') {

                toast('Procesando tú compra', {
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

                // Retrasar la actualización del carrito
                setTimeout(() => {
                    dispatch(fetchShoppingCart({
                        user_token: currentUser?.token,
                        user_id: currentUser?.id_usuario
                    }));
                }, 1000);
                alert('Ha Finalizado su compra, estaremos en contacto por su EMAIL, para informarle!');
                alert('Se ha terminado las acciónes del demo, muchas gracias :D');
            }
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
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
        <>
            <ToastContainer />
            <div className="shopping-cart">
                <h1 className="cart-title">Carrito de Compras</h1>
                <div className="cart-items">
                    {cart.ids.map((id) => {
                        const item = cart.entities[id];
                        return (
                            <div className="cart-item" key={id}>
                                <img src={item.imagen_producto} alt={item.nombre_producto} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h2 className="cart-item-name">{item.nombre_producto}</h2>
                                    <p className="cart-item-price"><strong>Precio:</strong> ${item.precio_producto}</p>
                                    <p className="cart-item-quantity"><strong>Cantidad:</strong> {item.cantidad_seleccionada}</p>
                                    <p className="cart-item-shipping"><strong>Coste de envío:</strong> ${item.precio_envio}</p>
                                    <button className="cart-button-remove" onClick={() => handleClickToEliminate(`${id}`)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="cart-summary">
                    <h2 className="cart-summary-title">Resumen</h2>
                    <p className="cart-summary-total"><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
                    <p className="cart-summary-shipping"><strong>Total de envío: ${totalShipping.toFixed(2)}</strong></p>
                    <button className="cart-button-checkout" onClick={handleClickToBuy}>
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </>
    );
};

export default Carrito;