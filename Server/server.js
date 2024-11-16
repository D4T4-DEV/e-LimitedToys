import express from 'express';
import path from 'path';
import dotenv from 'dotenv/config.js';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';

// Crear `__dirname` en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos de Vite (carpeta "dist")
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
