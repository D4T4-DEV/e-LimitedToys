import { createSlice } from "@reduxjs/toolkit";
import { subirImagenPerfil } from "../Trunks/accionesVariasThunk";

// Estado inicial
interface VariosState {
    imagenPerfilPath: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


const initialState: VariosState = {
    status: "idle",
    error: null,
    imagenPerfilPath: null,
};

// Slice
const actionsVariosSlice = createSlice({
    name: "actionsVarios",
    initialState,
    reducers: {
        limpiarPathObtenido(state) {
            state.imagenPerfilPath = null;
            state.status = "idle";
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Subir una imagen de perfil
            .addCase(subirImagenPerfil.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(subirImagenPerfil.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.imagenPerfilPath = action.payload; // Ruta relativa de la imagen
            })
            .addCase(subirImagenPerfil.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const {
    limpiarPathObtenido,
} = actionsVariosSlice.actions;

export default actionsVariosSlice.reducer;