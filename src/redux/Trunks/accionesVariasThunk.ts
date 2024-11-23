import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// URL de la API
const { VITE_URL_API } = import.meta.env;

// Thunk para carga una imagen usada en el perfil
export const subirImagenPerfil = createAsyncThunk(
    "actionsVarios/subirImagenPerfil",
    async (imagenASubir: File, { rejectWithValue }) => {

        const data = new FormData();
        data.append('typePath', '2');
        data.append('otherPath', 'User/Profile-img/');
        data.append('imagen', imagenASubir);
        try {
            const response = await axios.post(`${VITE_URL_API}/subir-img/new`, data);
            return response.data?.path_relative;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "No se pudo subir la imagen de perfil");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);