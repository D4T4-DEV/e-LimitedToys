import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../Interfaces/UserInterface";
import { iniciarSesion } from "../Trunks/userTrunk";

interface AuthState {
    currentUser: User | null; // Almacenamiento de los datos de usuario
    status: "idle" | "loading" | "succeeded" | "failed"; // Estado de la operacion
    error: string | null; // Error en caso de fallos
}

// Estado inicial
const initialState: AuthState = {
    currentUser: null,
    status: "idle",
    error: null,
};

// Slice
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        cerrarSesion(state) {
            state.currentUser = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Iniciar sesion
            .addCase(iniciarSesion.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(iniciarSesion.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentUser = action.payload; // Almacena los datos del usuario autenticado
            })
            .addCase(iniciarSesion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});


export const { cerrarSesion } = authSlice.actions;
export default authSlice.reducer;