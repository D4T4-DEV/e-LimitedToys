import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { EncriptarDatos } from "../../security/Encriptar_data";
// URL de la API
const { VITE_URL_API } = import.meta.env;

// Async thunk para checar si existe el email
export const checkoutEmail = createAsyncThunk('checkoutData/checkoutEmail', async (params: string) => {
    const datosEncriptados = await EncriptarDatos({ email: params });
    const encodedBase64 = encodeURIComponent(datosEncriptados);
    const response = await axios.get(`${VITE_URL_API}/usuarios/check-exist/${encodedBase64}`);
    return response.data.data?.exist;
});