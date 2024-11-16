import express from 'express';
import { login } from '../Controllers/UserController.js';
import {obtenerBanners} from '../Controllers/BannersController.js';
const Router = express.Router();

// Acciones de conexion de la aplicacion con el backend

// Otras acciones
Router.get('/obtener-banners', obtenerBanners);

// Acciones del usuario
Router.post('/login', login);

export default Router;