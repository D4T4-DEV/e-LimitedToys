import { createSlice } from "@reduxjs/toolkit";

interface ErrorState {
    mensajesNotificacion: string | null; // Error en caso de fallos
}

const initialState: ErrorState = {
    mensajesNotificacion: null
};

const notificationsSliceSlice = createSlice({
    name: "errorVarius",
    initialState,
    reducers: {
        errorVencimientoToken(state) {
            state.mensajesNotificacion = 'Tu sesión ha caducado, porfavor vuelve a iniciar sesión';
        },

        errorVerPaginaProtegida(state) {
            state.mensajesNotificacion = 'Para poder acceder aquí, necesitas una cuenta';
        },

        errorQuererComprar(state) {
            state.mensajesNotificacion = 'Para poder comprar, necesitas una cuenta, te invitamos a iniciar sesión o crear una cuenta ❤️';
        },

        msgCerrarSesion(state) {
            state.mensajesNotificacion = 'Se ha cerrado sesión';
        },

        limpiarErroresMensaje(state) {
            state.mensajesNotificacion = null;
        }
    }
});

export const {
    errorVencimientoToken,
    errorVerPaginaProtegida,
    errorQuererComprar,
    msgCerrarSesion,
    limpiarErroresMensaje
} = notificationsSliceSlice.actions;

export default notificationsSliceSlice.reducer;