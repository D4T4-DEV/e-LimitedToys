import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// URL de la API
const { VITE_URL_API } = import.meta.env;

// Async thunk para obtener los banners
export const fetchBanners = createAsyncThunk('banners/fetchBanners', async () => {
    const response = await axios.get(`${VITE_URL_API}/banner/get`);
    return response.data.data?.bannersImgs.map((banner: { img_url: string }) => banner.img_url) || [];
});