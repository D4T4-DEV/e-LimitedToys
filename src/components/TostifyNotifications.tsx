import { ReactNode } from "react";
import { toast, Bounce } from "react-toastify";
import { CloseButtonTostify } from "./buttonForTostify";


export const generateWarningTostify = (msg: string | undefined): ReactNode => {

    if (!msg) {
        return null;
    }

    toast.warning(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        closeButton: <CloseButtonTostify />,
        toastId: msg, // Usamos el mensaje como ID (evitara duplicados)
    });
    return null;
}

export const generateErrorTostify = (msg: string | undefined): ReactNode => {

    if (!msg) {
        return null;
    }

    toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        closeButton: <CloseButtonTostify />,
        toastId: msg, // Usamos el mensaje como ID (evitara duplicados)
    });
    return null;
}

export const generateInfoTostify = (msg: string | undefined): ReactNode => {

    if (!msg) {
        return null;
    }

    toast.info(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        closeButton: <CloseButtonTostify />,
        toastId: msg, // Usamos el mensaje como ID (evitara duplicados)
    });
    return null;
}