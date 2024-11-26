import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFilterProducts } from '../Trunks/filterThunks';

// Definir tipos para el estado
interface FiltrosState {
  Marcas: string[];
  precioMaximo: string;
  precioMinimo: string;
  statusFilter: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorFilter: string | null;
}

// // Tipo para los datos de actualización
// interface ActualizarDatosPayload {
//   Marcas?: string[];
//   precioMaximo?: string;
//   precioMinimo?: string;
// }

// Estado inicial
const initialState: FiltrosState = {
  Marcas: ["Bandai", "Banpresto", "Good Smile", "Funko", "Youtooz"],
  precioMaximo: "100.00",
  precioMinimo: "25.00",
  statusFilter: 'idle',
  errorFilter: null,
};
  
  // Crear el slice
  const filtrosSlice = createSlice({
    name: 'filtros',
    initialState,
    reducers: {
      setMarcas(state, action: PayloadAction<string[]>) {
        state.Marcas = action.payload;
      },
      setPrecioMaximo(state, action: PayloadAction<string>) {
        state.precioMaximo = action.payload;
      },
      setPrecioMinimo(state, action: PayloadAction<string>) {
        state.precioMinimo = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchFilterProducts.pending, (state) => {
          state.statusFilter = 'loading';
        })
        .addCase(fetchFilterProducts.fulfilled, (state, action) => {
          state.statusFilter = 'succeeded';
          if (action.payload.Marcas) state.Marcas = action.payload.Marcas;
          if (action.payload.precioMaximo) state.precioMaximo = action.payload.precioMaximo;
          if (action.payload.precioMinimo) state.precioMinimo = action.payload.precioMinimo;
        })
        .addCase(fetchFilterProducts.rejected, (state, action) => {
          state.statusFilter = 'failed';
          state.errorFilter = action.error.message || 'Error desconocido';
        });
    },
  });
  
  // Exportar acciones y reducer
  export const { setMarcas, setPrecioMaximo, setPrecioMinimo } = filtrosSlice.actions;
  export default filtrosSlice.reducer;