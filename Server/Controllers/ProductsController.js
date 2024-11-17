import axios from 'axios';
import qs from 'qs';
// VARIABLES DEL SERVIDOR
const { BASE_URL_API } = process.env;

export const obtenerProductosDestacados = async (req, res) => {
    const origin = req.headers.origin;

    if (!BASE_URL_API) {
        return res.status(500).json({ error: 'API URL no configurada en el servidor' });
    }

    try {
        const response = await axios.get(
            `${BASE_URL_API}/productos/get-featured`,
            {
                headers: {
                    'Origin': origin,
                }
            });
        res.json(response.data);
    } catch (error) {
        const errorStatus = error.response?.status;
        const errorData = error.response?.data;
        res.status(errorStatus || 500).json({ error: errorData?.message || 'Error al contactarse a la API' });
    }
};

export const obtenerProductosLista = async (req, res) => {
    const { page } = req.params;
    console.log(req.params);
    const origin = req.headers.origin;

    if (!BASE_URL_API) {
        return res.status(500).json({ error: 'API URL no configurada en el servidor' });
    }

    try {
        const response = await axios.get(
            `${BASE_URL_API}/productos/get/${page}`,
            {
                headers: {
                    'Origin': origin,
                }
            });
        res.json(response.data);
    } catch (error) {
        const errorStatus = error.response?.status;
        const errorData = error.response?.data;
        res.status(errorStatus || 500).json({ error: errorData?.message || 'Error al contactarse a la API' });
    }
};