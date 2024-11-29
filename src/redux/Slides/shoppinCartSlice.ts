import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { cartListSchema } from '../../Interfaces/ShoppingCartInterface';
import { eliminatedProductToShoppingCart, fetchShoppingCart } from '../Trunks/shoppingCartThunk';

interface ShoppingCartState {
    entities: Record<string, any>;
    ids: number[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ShoppingCartState = {
    entities: {},
    ids: [],
    status: 'idle',
    error: null,
};

const shoppingCartSlice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.entities = {};
            state.ids = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Obtención de los productos del carrito de un usuario
            .addCase(fetchShoppingCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchShoppingCart.fulfilled, (state, action: PayloadAction<any[]>) => {
                const normalizedData = normalize(action.payload, cartListSchema);
                state.entities = normalizedData.entities.cartItems || {};
                state.ids = normalizedData.result;
                state.status = 'succeeded';
            })
            .addCase(fetchShoppingCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Eliminación de un producto en el carrito
            .addCase(eliminatedProductToShoppingCart.fulfilled, (state, action: PayloadAction<string>) => {
                const id = action.payload;
                delete state.entities[id];
                state.ids = state.ids.filter((productId) => `${productId}` !== id);
            });
    },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;