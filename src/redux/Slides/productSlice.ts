import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../../Interfaces/ProductInterface';
import { fetchAllProducts, fetchFeaturedProducts } from '../Trunks/productsTrunks';

// Estado inicial de los productos
interface ProductState {
    entities: { [id: string]: Product };  // Productos y sus datos (incluye destacados y todos)
    ids: string[];  // ids de productos (incluye destacados y todos)
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;

    // Productos destacados
    featuredEntities: { [id: string]: Product }; // Separacion a productos destacados
    featuredIds: string[];

    // Todos los productos en stock
    allProductsEntities: { [id: string]: Product }; // Separacion a todos los productos (representa los existentes el stock)
    allProductsIds: string[];
    allProductsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    allProductsError: string | null;
}

const initialState: ProductState = {
    entities: {},
    ids: [],
    status: 'idle',
    error: null,

    // Productos destacados
    featuredEntities: {},
    featuredIds: [],

    // Productos existentes en el inventario (antes llamados en paginacion)
    allProductsEntities: {},
    allProductsIds: [],
    allProductsStatus: 'idle',
    allProductsError: null,
};

// Slice
const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Productos destacados
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';

                // Guardar los productos destacados en el medio asignado antes "featuredEntities y featuredIds"
                state.featuredEntities = action.payload.entities?.products ?? {};
                state.featuredIds = action.payload.result ?? [];
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Error al obtener los productos destacados';
            })

            // Todos los productos en stock (anteriormente por paginado)
            .addCase(fetchAllProducts.pending, (state) => {
                state.allProductsStatus = 'loading';
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.allProductsStatus = 'succeeded';
            
                // Obtener las entidades de productos (anteriormente traidos por una paginacion)
                const newEntities = action.payload.entities?.products ?? {};
                const existingEntities = state.allProductsEntities;
            
                // Filtrar productos ya existentes para evitar duplicarlos
                const filteredNewEntities = Object.keys(newEntities).reduce((acc, id) => {
                    if (!existingEntities[id]) {
                        acc[id] = newEntities[id];
                    }
                    return acc;
                }, {} as { [id: string]: Product });
            
                // Actualizar el estado con los productos (anteriormente traidos por una paginacion)
                state.allProductsEntities = { ...existingEntities, ...filteredNewEntities };
            
                // Combinar los ids
                const newIds = action.payload.result ?? [];
                state.allProductsIds = [...new Set([...state.allProductsIds, ...newIds])];
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.allProductsStatus = 'failed';
                state.allProductsError = action.error.message || 'Error al obtener productos paginados';
            });
    },
});

export default productsSlice.reducer;