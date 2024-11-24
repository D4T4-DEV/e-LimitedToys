import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { cerrarSesion } from "../redux/Slides/userSlice";
import { errorVencimientoToken } from "../redux/Slides/erroresSlice";

const useMonitorCookie = (cookieName: string, redirectPath: string = "/login") => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        const interval = setInterval(() => {
            const cookie = Cookies.get(cookieName);

            // Si la cookie no existe y hay datos de una autenticación
            if (!cookie && currentUser) {
                dispatch(errorVencimientoToken()); // Establece el mensaje de error
                dispatch(cerrarSesion()); // Limpia el estado de sesión
                navigate(redirectPath); // Redirige al usuario
                clearInterval(interval); // Detiene el monitoreo
            }
        }, 1000); // Se ejecuta cada segundo (verificación)

        return () => clearInterval(interval); // Limpieza al desmontar
    }, [cookieName, currentUser, dispatch, navigate, redirectPath]);
};

export default useMonitorCookie;
