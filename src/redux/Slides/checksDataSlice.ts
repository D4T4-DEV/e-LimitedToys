import { createSlice } from "@reduxjs/toolkit";
import { checkoutEmail } from "../Trunks/checkoutDataTrunk";

// Estado incial
interface CheckDataState {
    checkout: boolean | undefined;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CheckDataState = {
    checkout: false,
    status: 'idle',
    error: null
}

// Slice 
const checkDataSlice = createSlice({
    name: 'checkoutData',
    initialState,
    reducers: {
        cleanAllCheckouts(state){
            state.checkout = undefined;
            state.error = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
        // Verificación de la existencia de un email
        .addCase(checkoutEmail.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkoutEmail.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.checkout = action.payload;
        })
        .addCase(checkoutEmail.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Error al verificar el email >:(';
        });
    },
});

export const {
    cleanAllCheckouts,
} = checkDataSlice.actions;

export default checkDataSlice.reducer;