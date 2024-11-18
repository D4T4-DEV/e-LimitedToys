// Archivo para definir esquemas utilizados por redux

import { schema } from "normalizr";

// Esquema utilizado para productos
export const productSchema = new schema.Entity('products', {}, { idAttribute: 'id_producto' });
export const productsListSchema = [productSchema];