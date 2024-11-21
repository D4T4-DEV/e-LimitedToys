import React from 'react';


// Boton de cerrar la notificación tostify
interface CleanCloseButtonProps {
    closeToast?: () => void; // Funcion para cerrar el toast
}

export const CloseButtonTostify: React.FC<CleanCloseButtonProps> = ({ closeToast }) => (
    <button
        onClick={closeToast}
        style={{
            all: "unset", // Quita todos los estilos predeterminados
            cursor: "pointer",
            color: 'grey'
        }}
    >
        &#10006; {/* genera la "X" */}
    </button>
);