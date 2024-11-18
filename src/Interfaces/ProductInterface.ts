// Interfaz del producto
export interface Product {
    id_producto: string;
    nombre_producto?: string;
    marca?: string;
    descripcion?: string;
    categoria?: string;
    imagenes_producto?: string;
    precio_producto?: number;
    precio_envio?: number;
    existencia?: number;
}