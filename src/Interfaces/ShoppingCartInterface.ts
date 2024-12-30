import { schema } from 'normalizr';

export const cartItemSchema = new schema.Entity('cartItems', {}, { idAttribute: 'id_producto' });
export const cartListSchema = [cartItemSchema];