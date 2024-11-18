import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from './Slides/bannerSlice';
import productReducer from './Slides/productSlice';

export const store = configureStore({
    reducer: {
        banners: bannerReducer,
        products: productReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;