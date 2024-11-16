import express from 'express';
import { login } from '../Controllers/UserController.js';
const Router = express.Router();

// Acciones de conexion de la aplicacion con el backend

// Otras acciones

// Acciones del usuario
Router.post('/login', login);

export default Router;