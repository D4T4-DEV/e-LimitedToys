import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from './Slides/bannerSlice';
import productReducer from './Slides/productSlice';
import userReducer from './Slides/userSlice';
import errorReducer from './Slides/erroresSlice';
import checkoutsReducer from './Slides/checksDataSlice';

export const store = configureStore({
    reducer: {
        banners: bannerReducer,
        products: productReducer,
        users: userReducer,
        errores: errorReducer,
        checks: checkoutsReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;