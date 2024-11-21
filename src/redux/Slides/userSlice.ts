import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../Interfaces/UserInterface";
import { cargarImagenPerfil, iniciarSesion } from "../Trunks/userTrunk";
import Cookies from "js-cookie";
import { decryptSessionIndicator, encryptSessionIndicator } from "../../security/Encr_decp";


interface AuthState {
    currentUser: User | null; // Almacenamiento de los datos de usuario
    profileImage: string | null; // URL de la imagen de perfil
    status: "idle" | "loading" | "succeeded" | "failed"; // Estado de la operacion
    error: string | null; // Error en caso de fallos
}

// Recuperar datos iniciales desde cookies
const storedUser = Cookies.get("isLoggedIn");

let initialUser: User | null = null;

if (storedUser) {
    try {
        const decrypted = await decryptSessionIndicator(storedUser);
        initialUser = JSON.parse(decrypted);
    } catch (error) {
        console.error("Failed to decrypt stored user:", error);
    }
}

// Estado inicial
const initialState: AuthState = {
    currentUser: initialUser,
    profileImage: null,
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
            state.profileImage = null;
            state.status = "idle";
            state.error = null;
            Cookies.remove("isLoggedIn");
            Cookies.remove("sessionKey");
        },
        limpiarError(state) {
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
                const expires = new Date(new Date().getTime() + 60 * 60 * 1000); // define el tiempo en una hora
                state.status = "succeeded";
                state.currentUser = action.payload; // Almacena los datos del usuario autenticado

                encryptSessionIndicator(JSON.stringify(action.payload)).then((encryptedSession) => {
                    Cookies.set("isLoggedIn", encryptedSession, {
                        expires: expires,
                        secure: true, // Solo en HTTPS
                        sameSite: "Strict", // Prevenir CSRF
                    });
                });
            })
            .addCase(iniciarSesion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // Obtener y cargar imagen de perfil
            .addCase(cargarImagenPerfil.fulfilled, (state, action) => {
                state.profileImage = action.payload as string; // Guardar la URL de la imagen
            })
            .addCase(cargarImagenPerfil.rejected, (state, action) => {
                state.error = action.payload as string;
                state.profileImage = null; // Limpiar imagen en caso de error esto activaria la imagen predeterminada
            });
    },
});


export const { cerrarSesion, limpiarError } = authSlice.actions;
export default authSlice.reducer;