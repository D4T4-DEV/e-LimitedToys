import { createAsyncThunk } from "@reduxjs/toolkit";
import { Login } from "../../Interfaces/LoginInterface";
import axios from "axios";
import { EncriptarDatos } from "../../security/Encriptar_data";
import { User } from "../../Interfaces/UserInterface";

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
                return rejectWithValue(error.response?.data?.message || "Error en la petición");
            }
            return rejectWithValue("Error desconocido");
        }
    }
);

// Thunk para obtener y cargar la imagen de perfil del usuario
export const cargarImagenPerfil = createAsyncThunk(
    "auth/cargarImagenPerfil",
    async (user: User, { rejectWithValue }) => {
      if (!user || !user.url_prof_pic || !user.token) {
        return rejectWithValue("Faltan datos del usuario o del token");
      }
  
      try {
        const response = await axios.get(user.url_prof_pic, {
          headers: {
            Authorization: `${user.token}`, // Token dado al loguearse
            "Content-Type": "application/json",
          },
          responseType: "blob", // Respuesta como Blob
        });
  
        const url_img_blob = URL.createObjectURL(response.data); // Crear URL del Blob
        return url_img_blob;
      } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || "No se pudo cargar la imagen de perfil");
        }
        return rejectWithValue("Error desconocido");
      }
    }
  );