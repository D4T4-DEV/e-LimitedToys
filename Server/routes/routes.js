import express from 'express';
import { login } from '../Controllers/UserController.js';
import { obtenerBanners } from '../Controllers/BannersController.js';
import { obtenerProductosDestacados, obtenerProductosLista } from '../Controllers/ProductsController.js';
const Router = express.Router();

// Acciones de conexion de la aplicacion con el backend

// Otras acciones
Router.get('/obtener-banners', obtenerBanners);

// Acciones del usuario
Router.post('/login', login);

// Acciones productos
Router.get('/obtener-productos-destacados', obtenerProductosDestacados);
Router.get('/obtener-productos-lista/:page', obtenerProductosLista);


export default Router;