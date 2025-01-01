import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './carrito.css';
import { AppDispatch, RootState } from '../redux/store';
import { buyProductsInShoppingCart, eliminatedProductToShoppingCart, fetchShoppingCart, modifyProductToShoppingCart } from '../redux/Trunks/shoppingCartThunk';
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

    // const totalItems = cart.ids.reduce((total, id) => total + cart.entities[id].cantidad_seleccionada, 0);
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
                toast('Quitaste del carrito el producto', {
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

    const handleQuantityChange = async (productId: string, change: number, item: any) => {
        try {
            const newQuantity = item.cantidad_seleccionada + change;

            // Verificar si la nueva cantidad es válida
            if (newQuantity > 0) {
                // Modificar el producto en el carrito
                const response = await dispatch(
                    modifyProductToShoppingCart({
                        user_id: currentUser?.id_usuario,
                        user_token: currentUser?.token,
                        product_id: productId,
                        existencias: change,
                    })
                );

                // Confirmar que la acción fue exitosa
                if (response.meta.requestStatus === 'fulfilled') {
                    // Mostrar notificación según el cambio
                    if (change > 0) {
                        toast('Agregaste un producto', {
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
                    } else {
                        toast('Decrementaste un producto', {
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
                    }

                    setTimeout(() => {
                        dispatch(fetchShoppingCart({
                            user_token: currentUser?.token,
                            user_id: currentUser?.id_usuario,
                        }));
                    }, 1000);
                } else {
                    throw new Error('No se pudo modificar el producto en el carrito.');
                }
            }
        } catch (error) {
            console.error('Error al modificar la cantidad del producto:', error);
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
                <div className="cart-summary">
                    <h2 className="cart-summary-title">Resumen</h2>
                    <p className="cart-summary-total"><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
                    <p className="cart-summary-shipping"><strong>Total de envío: ${totalShipping.toFixed(2)}</strong></p>
                    <button className="cart-button-checkout" onClick={handleClickToBuy}>
                        Finalizar Compra
                    </button>
                </div>
                <div className="cart-items">
                    {cart.ids.map((id) => {
                        const item = cart.entities[id];
                        return (
                            <div className="cart-item" key={id}>
                                <button
                                    className="cart-item-eliminated-button"
                                    onClick={() => handleClickToEliminate(`${id}`)}
                                >
                                    ×
                                </button>
                                <img src={item.imagen_producto} alt={item.nombre_producto} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h2 className="cart-item-name">{item.nombre_producto}</h2>
                                    <p className="cart-item-price"><strong>Precio:</strong> ${item.precio_producto}</p>
                                    <p className="cart-item-quantity">
                                        <strong>Cantidad:</strong>
                                        <button
                                            className={`cart-button-decrement ${item.cantidad_seleccionada === 1 ? "cart-button-remove" : ""}`}
                                            onClick={() =>
                                                item.cantidad_seleccionada === 1
                                                    ? handleClickToEliminate(`${id}`)
                                                    : handleQuantityChange(`${id}`, -1, item)
                                            }
                                        >
                                            {item.cantidad_seleccionada === 1 ? (
                                                <span role="img" aria-label="trash">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="13px"
                                                        width="13px"
                                                        viewBox="0 -960 960 960"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                                    </svg>
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </button>
                                        {item.cantidad_seleccionada}
                                        <button
                                            className="cart-button-increment"
                                            onClick={() => handleQuantityChange(`${id}`, 1, item)}>
                                            +
                                        </button>
                                    </p>
                                    <p className="cart-item-shipping"><strong>Coste de envío:</strong> ${item.precio_envio}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Carrito;