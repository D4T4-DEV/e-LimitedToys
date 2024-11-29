import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const { VITE_URL_API } = import.meta.env;

interface ShoppingCart {
    user_id?: string;
    product_id?: string;
    user_token?: string;
    existencias?: string;
}

// Thunk para agregar un producto al carrito
export const addProductToShoppingCart = createAsyncThunk(
    'shoppingCart/addProductToShoppingCart',
    async (data: ShoppingCart, { rejectWithValue }) => {
        try {
            // Contenido del encabezado
            const headers = {
                Authorization: data.user_token,
                "Content-Type": "application/json",
            };

            // Contenido de la petición en "body"
            const body = {
                datos: {
                    id_usuario: `${data.user_id}`,
                    id_producto: `${data.product_id}`,
                    existencias: `${data.existencias}`,
                },
            };

            // Petición 
            const response = await axios.post(
                `${VITE_URL_API}/carrito/add`,
                body,
                { headers }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Error en la petición en agregar al carrito");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);

// Thunk para agregar un producto al carrito
export const eliminatedProductToShoppingCart = createAsyncThunk(
    'shoppingCart/eliminatedProductToShoppingCart',
    async (data: ShoppingCart, { rejectWithValue }) => {
        try {
            // Contenido del encabezado
            const headers = {
                Authorization: data.user_token,
                "Content-Type": "application/json",
            };

            // Petición
            const response = await axios.delete(
                `${VITE_URL_API}/carrito/delete/${data.user_id}/${data.product_id}`,
                { headers }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Error en la petición en borrar producto del carrito");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);

// Thunk para obtener los datos del carrito
export const fetchShoppingCart = createAsyncThunk(
    'shoppingCart/fetchShoppingCart',
    async (data: ShoppingCart, { rejectWithValue }) => {
        try {
            // Contenido del encabezado
            const headers = {
                Authorization: data.user_token,
                "Content-Type": "application/json",
            };

            // Petición
            const response = await axios.get(
                `${VITE_URL_API}/carrito/get/${data.user_id}`,
                { headers }
            );

            return response.data?.data?.datosCarritoProcesado;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Error en la petición de obtener datos del carrito");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);

// Thunk para obtener los datos del carrito
export const buyProductsInShoppingCart = createAsyncThunk(
    'shoppingCart/buyProductsInShoppingCart',
    async (data: ShoppingCart, { rejectWithValue }) => {
        try {
            // Contenido del encabezado
            const headers = {
                Authorization: data.user_token,
                "Content-Type": "application/json",
            };

            // Contenido de la petición en "body"
            const body = {
                datos: {
                    id_usuario: `${data.user_id}`,
                },
            };

            // Petición 
            const response = await axios.post(
                `${VITE_URL_API}/proceso-de-compra/buy/`,
                body,
                { headers }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Error en la petición de comprar productos en el carrito");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);