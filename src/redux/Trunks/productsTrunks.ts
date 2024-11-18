import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../../Interfaces/ProductInterface";
import { normalize } from "normalizr";
import { productsListSchema } from "../Schemas/schemas";
// URL de la API
const { VITE_URL_API } = import.meta.env;

// Async thunk para obtener los productos destacados de la semana
export const fetchFeaturedProducts = createAsyncThunk(
    'products/fetchFeaturedProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${VITE_URL_API}/productos/get-featured`);

            // Accede a los productos destacados
            const productosDestacados: Product[] = response.data.data?.DataProductos || [];

            // Normalizar datos
            return normalize(productosDestacados, productsListSchema);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Error en la petición");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);

// Async thunk para obtener todos los productos que tienen stock
export const fetchAllProducts = createAsyncThunk(
    'products/fetchAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${VITE_URL_API}/productos/get`);

            // Accede a los productos
            const productos: Product[] = response.data.data?.DataProductos || [];

            // Normalizar datos
            const normalizedData = normalize(productos, productsListSchema);
            return normalizedData;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Error en la petición");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);
