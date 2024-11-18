import { createSlice } from '@reduxjs/toolkit';
import { fetchBanners } from '../Trunks/bannerTrunks';

// Estado inicial
interface BannersState {
  images: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BannersState = {
  images: [],
  status: 'idle',
  error: null,
};

// Slice
const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al obtener los banners >:(';
      });
  },
});

export default bannersSlice.reducer;