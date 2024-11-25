import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from './Slides/bannerSlice';
import productReducer from './Slides/productSlice';
import userReducer from './Slides/userSlice';
import notificationsReducer from './Slides/notificationsSlice';
import checkoutsReducer from './Slides/checksDataSlice';
import variosReducer from './Slides/accionesVariasSlice';

export const store = configureStore({
    reducer: {
        banners: bannerReducer,
        products: productReducer,
        users: userReducer,
        notifications: notificationsReducer,
        checks: checkoutsReducer,
        varios: variosReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;