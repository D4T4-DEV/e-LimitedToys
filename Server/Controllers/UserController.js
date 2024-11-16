import axios from 'axios';
import qs from 'qs';
// VARIABLES DEL SERVIDOR
const { BASE_URL_API } = process.env;

export const login = async (req, res) => {
    const { datos_encriptados } = req.body;
    const origin = req.headers.origin;
    
    if (!BASE_URL_API) {
        return res.status(500).json({ error: 'API URL no configurada en el servidor' });
    }
    
    try {
        const response = await axios.post(
            `${BASE_URL_API}/usuarios/login/`,
            qs.stringify({ datos_encriptados }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
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