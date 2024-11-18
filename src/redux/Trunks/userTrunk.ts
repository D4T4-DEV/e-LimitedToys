import { createAsyncThunk } from "@reduxjs/toolkit";
import { Login } from "../../Interfaces/LoginInterface";
import axios from "axios";
import { EncriptarDatos } from "../../security/Encriptar_data";

// URL de la API
const { VITE_URL_API } = import.meta.env;

// Thunk para iniciar sesion
export const iniciarSesion = createAsyncThunk(
    "auth/iniciarSesion",
    async (dataRecibida: Login, { rejectWithValue }) => {
        try {
            const datosEncriptados = await EncriptarDatos(dataRecibida);
            const response = await axios.post(`${VITE_URL_API}/usuarios/login/`, {
                datos_encriptados: datosEncriptados,
            });
            return response.data?.data; // Devuelve los datos necesarios al estar logeado
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || "Error en la petición");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);
