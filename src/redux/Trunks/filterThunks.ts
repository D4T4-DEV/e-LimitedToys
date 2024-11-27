import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const { VITE_URL_API } = import.meta.env;

// Thunk para simular una actualización de datos
export const fetchFilterProducts = createAsyncThunk(
    'filter/fetchFilterProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${VITE_URL_API}/productos/get-marcas-preciosminmax`);
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Error en la petición");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);