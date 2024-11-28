import React, { useState, useRef } from "react";
import './ChangeImageProfile.css';
import ConfirmationModal from "./ConfirmationModal";
import { subirImagenPerfil } from "../redux/Trunks/accionesVariasThunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import LoadingModal from "./LoadignModal";
import { cargarImagenPerfil, deleteImgProfile, editImgProfile } from "../redux/Trunks/userTrunk";
import Cookies from "js-cookie";
import { encryptSessionIndicator } from "../security/Encr_decp";

interface UserProfileProps {
    prof_pic?: string;
    token?: string;
    id?: string;
};

const ChangeProfileIMG: React.FC<UserProfileProps> = ({ prof_pic, token, id }) => {
    const [image, setImage] = useState<File | null>(null); // Imagen de perfil seleccionada.
    const [imagePath, setImagePath] = useState<string | undefined>(prof_pic); // Ruta de la imagen antigua.
    const [preview, setPreview] = useState<string | null>(null); // Vista previa de la imagen.
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal está abierto.
    const [modalAction, setModalAction] = useState<"delete" | "change" | null>(null); // Define la acción a confirmar.
    const [mensajeModal, setMensajeModal] = useState<string | undefined>(undefined); // Mensaje del modal.
    const [isOpenLoading, setIsOpenLoading] = useState(false); // Modal de carga.

    const { currentUser } = useSelector(
        (state: RootState) => state.users
    );

    let imgPathNew = '';

    const dispatch = useDispatch<AppDispatch>(); // Medio que se utiliza en el desapachador

    const fileInputRef = useRef<HTMLInputElement | null>(null); // Referencia al input de tipo file.

    // Cambio y renderizado de la imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Genera vista previa
        }
    };

    // Maneja la confirmación de las acciones del modal.
    const handleConfirm = async () => {
        if (modalAction === "delete") {
            if (preview) {
                // Borrar solo la vista previa y resetear el input
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Limpia el input
                }
                setImage(null);
                setPreview(null);
                closeModal();
                return; // Salimos antes de ejecutar el borrado en el servidor
            }
            
            if (imagePath) {
                setIsOpenLoading(true);
                setMensajeModal('Borrando la imagen...');
                const resultAction = await dispatch(deleteImgProfile({ id_usuario: id, token: token }));
                // Manejor de la respuesta de la subida
                if (deleteImgProfile.fulfilled.match(resultAction)) {
                    const uploadCorrect = resultAction.payload;

                    if (!uploadCorrect) {
                        throw new Error('Tuvimos problemas para subir la imagen, inténtalo más tarde');
                    }
                    setImagePath(undefined); // Borra la imagen
                    const updatedUserCookie = {
                        id_usuario: currentUser?.id_usuario,
                        nick: currentUser?.nick,
                        token: currentUser?.token,
                        url_prof_pic: imgPathNew,
                    };

                    // Encriptar los datos
                    const encryptedSession = await encryptSessionIndicator(JSON.stringify(updatedUserCookie));

                    // Guardar la cookie encriptada
                    Cookies.set("isLoggedIn", encryptedSession, {
                        expires: new Date(new Date().getTime() + 60 * 60 * 1000), // Expira en 1 hora
                        secure: true, // Solo en conexiones HTTPS
                        sameSite: "Strict", // Prevenir ataques CSRF
                    });
                } else if (deleteImgProfile.rejected.match(resultAction)) {
                    const errorMessage = resultAction?.payload as string || 'Error al subir la imagen.';
                    throw new Error(errorMessage);
                }
                setIsOpenLoading(false);
                // Dispatch del thunk para cargar la imagen de perfil
                dispatch(cargarImagenPerfil({ url_prof_pic: imgPathNew, token: token }));
            }

        } else if (modalAction === "change") {
            setIsOpenLoading(true);
            // Si hay imagen, la subimos
            if (image) {
                setMensajeModal('Subiendo la imagen...');
                const resultAction = await dispatch(subirImagenPerfil(image));

                // Manejor de la respuesta de la subida
                if (subirImagenPerfil.fulfilled.match(resultAction)) {
                    const uploadCorrect = resultAction.payload;

                    if (!uploadCorrect) {
                        throw new Error('Tuvimos problemas para subir la imagen, inténtalo más tarde');
                    }

                    imgPathNew = uploadCorrect;
                } else if (subirImagenPerfil.rejected.match(resultAction)) {
                    const errorMessage = resultAction?.payload as string || 'Error al subir la imagen.';
                    throw new Error(errorMessage);
                }
            }
            setMensajeModal('Cambiando la imagen...');
            const resultAction = await dispatch(editImgProfile({ token: token, id_usuario: id, prof_pic: imgPathNew }));
            // Manejor de la respuesta del cambio
            if (editImgProfile.fulfilled.match(resultAction)) {
                const uploadCorrect = resultAction.payload;

                if (!uploadCorrect) {
                    throw new Error('Tuvimos problemas para cambiar la imagen, inténtalo más tarde');
                }

                const updatedUserCookie = {
                    id_usuario: currentUser?.id_usuario,
                    nick: currentUser?.nick,
                    token: currentUser?.token,
                    url_prof_pic: imgPathNew,
                };

                // Encriptar los datos
                const encryptedSession = await encryptSessionIndicator(JSON.stringify(updatedUserCookie));

                // Guardar la cookie encriptada
                Cookies.set("isLoggedIn", encryptedSession, {
                    expires: new Date(new Date().getTime() + 60 * 60 * 1000), // Expira en 1 hora
                    secure: true, // Solo en conexiones HTTPS
                    sameSite: "Strict", // Prevenir ataques CSRF
                });

            } else if (subirImagenPerfil.rejected.match(resultAction)) {
                const errorMessage = resultAction?.payload as string || 'Error al cambiar la imagen.';
                throw new Error(errorMessage);
            }
            dispatch(cargarImagenPerfil({ url_prof_pic: imgPathNew, token: token }));
            setIsOpenLoading(false);
        }
        closeModal();
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Resetea el valor del input de tipo file
        }
    };

    const openModal = (action: "delete" | "change") => {
        setModalAction(action);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
    };

    return (
        <>
            <form>
                <p>Cambiar/ Borrar / Subir imagen de perfil</p>
                <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp, image/gif"
                    onChange={handleImageChange}
                    ref={fileInputRef} // Asigna la referencia al input
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '200px' }}>
                    {preview && (
                        <div>
                            <h3>Vista Previa:</h3>
                            <img src={preview} alt="Vista previa" style={{ maxWidth: '125px', maxHeight: '125px', borderRadius: '50%' }} />
                            <div className="btn-container">
                                <button
                                    type="button"
                                    className="button-signup"
                                    onClick={() => openModal("change")}
                                >
                                    Cambiar la imagen
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <button
                        type="button"
                        className="button-signup"
                        onClick={() => openModal("delete")}
                        disabled={!imagePath && !preview} // Desactiva si no hay ruta ni vista previa
                    >
                        {imagePath && !preview? 'Borrar imagen antigua' : 'Borrar imagen seleccionada'}
                    </button>
                </div>
            </form>

            {/* Modal de confirmación */}
            <ConfirmationModal
                message={modalAction === "delete" ? "¿Seguro que deseas borrar esta imagen?" : "¿Confirmas el cambio de imagen?"}
                onConfirm={handleConfirm}
                onCancel={closeModal}
                isOpen={isModalOpen}
            />

            <LoadingModal isOpen={isOpenLoading} mensaje={mensajeModal} />

        </>
    );
};

export default ChangeProfileIMG;