import { createSlice } from "@reduxjs/toolkit";

interface ErrorState {
    mensajesError: string | null; // Error en caso de fallos
}

const initialState: ErrorState = {
    mensajesError: null
};

const errorSlice = createSlice({
    name: "errorVarius",
    initialState,
    reducers: {
        errorVencimientoToken(state) {
            state.mensajesError = 'Tu sesión ha caducado, porfavor vuelve a iniciar sesión';
        },

        errorVerPaginaProtegida(state) {
            state.mensajesError = 'Para poder acceder aquí, necesitas una cuenta';
        },

        errorQuererComprar(state) {
            state.mensajesError = 'Para poder comprar, necesitas una cuenta, te invitamos a iniciar sesión o crear una cuenta ❤️';
        },

        limpiarErroresMensaje(state) {
            state.mensajesError = null;
        }
    }
});

export const { 
    errorVencimientoToken, 
    errorVerPaginaProtegida, 
    errorQuererComprar, 
    limpiarErroresMensaje 
} = errorSlice.actions;

export default errorSlice.reducer;