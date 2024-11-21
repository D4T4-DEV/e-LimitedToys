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
            state.mensajesError = 'Te redicionarmos por seguridad, vuelve iniciar sesión';
        },
        limpiarErroresMensaje(state) {
            state.mensajesError = null;
        }
    }
});

export const { errorVencimientoToken, limpiarErroresMensaje } = errorSlice.actions;
export default errorSlice.reducer;