import React, { useState, useRef } from "react";
import './ChangeImageProfile.css';
import ConfirmationModal from "./ConfirmationModal";
import { subirImagenPerfil } from "../redux/Trunks/accionesVariasThunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import LoadingModal from "./LoadignModal";
import { deleteImgProfile, editImgProfile } from "../redux/Trunks/userTrunk";

interface UserProfileProps {
    prof_pic?: string;
    token?: string;
    id?: string;
};

const ChangeProfileIMG: React.FC<UserProfileProps> = ({ prof_pic, token, id }) => {
    const [image, setImage] = useState<File | null>(null); // Imagen de perfil seleccionada.
    const [imagePath, /*setImagePath*/] = useState<string | undefined>(prof_pic); // Ruta de la imagen antigua.
    const [preview, setPreview] = useState<string | null>(null); // Vista previa de la imagen.
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal está abierto.
    const [modalAction, setModalAction] = useState<"delete" | "change" | null>(null); // Define la acción a confirmar.
    const [mensajeModal, setMensajeModal] = useState<string | undefined>(undefined); // Mensaje del modal.
    const [isOpenLoading, setIsOpenLoading] = useState(false); // Modal de carga.

    let imgPathNew = '';
    console.log(imagePath);


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
            setImage(null);
            setPreview(null);
            // setImagePath(undefined); // Borra la imagen
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Resetea el valor del input de tipo file
            }
            if (imagePath) {
                setIsOpenLoading(true);
                setMensajeModal('Borrando la imagen...');
                const resultAction = await dispatch(deleteImgProfile({id_usuario: id, token: token}));
                // Manejor de la respuesta de la subida
                if (deleteImgProfile.fulfilled.match(resultAction)) {
                    const uploadCorrect = resultAction.payload;
                    console.log(uploadCorrect);

                    if (!uploadCorrect) {
                        throw new Error('Tuvimos problemas para subir la imagen, inténtalo más tarde');
                    }

                } else if (deleteImgProfile.rejected.match(resultAction)) {
                    const errorMessage = resultAction?.payload as string || 'Error al subir la imagen.';
                    throw new Error(errorMessage);
                }
                setIsOpenLoading(false);
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

            } else if (subirImagenPerfil.rejected.match(resultAction)) {
                const errorMessage = resultAction?.payload as string || 'Error al cambiar la imagen.';
                throw new Error(errorMessage);
            }
            setIsOpenLoading(false);
        }
        closeModal();
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
                    <h3>Vista Previa:</h3>
                    {preview && (
                        <div>
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
                        {imagePath ? 'Borrar imagen antigua' : 'Borrar imagen seleccionada'}
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