import { useEffect, useState } from 'react';
import './MyProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { editAdressUser, editNickName, obtenerDatosDelPerfil } from '../redux/Trunks/userTrunk';
import UserAddress from '../components/UserAdress';
import UserProfile from '../components/UserDataGeneral';
import ChangeProfileIMG from '../components/ChangeImageProfile';

const MyProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, profileImage } = useSelector(
        (state: RootState) => state.users
    );

    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = useState('Perfil');

    const [userAdress, setUserAdress] = useState({
        calle: "",
        colonia: "",
        ciudad: "",
        pais: "",
        codigoPostal: '',
        referencia: "",
    });

    const [userDataGeneral, setUserDataGeneral] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        nickname: "",
    });

    // Cargar datos del perfil solo una vez
    useEffect(() => {
        if (currentUser && !isProfileLoaded) {
            dispatch(obtenerDatosDelPerfil(currentUser));
            setIsProfileLoaded(true); // Marcar como cargado
        }
    }, [currentUser, dispatch, isProfileLoaded]);

    useEffect(() => {
        if (currentUser) {
            setUserAdress({
                calle: currentUser.calle || "No especificado",
                colonia: currentUser.colonia || "No especificado",
                ciudad: currentUser.ciudad || "No especificado",
                pais: currentUser.pais || "No especificado",
                codigoPostal: currentUser.codigoPostal || "No especificado",
                referencia: currentUser.referencias || "No especificado",
            });

            setUserDataGeneral({
                nombres: currentUser.nombres || "No especificado",
                apellidos: currentUser.apellidos || "No especificado",
                email: currentUser.email || "No especificado",
                nickname: currentUser.nick || "No especificado",
            });
        }
    }, [currentUser]);

    useEffect(() => {
        setImageSrc(profileImage || undefined);
    }, [profileImage]);

    const handleSaveAdress = async (updatedUserAdress: any) => {
        if (!currentUser) return;

        try {
            const resultAction = await dispatch(editAdressUser({
                id_usuario: currentUser.id_usuario,
                token: currentUser.token,
                calle: updatedUserAdress.calle,
                referencia: updatedUserAdress.referencia,
                pais: updatedUserAdress.pais,
                ciudad: updatedUserAdress.ciudad,
                colonia: updatedUserAdress.colonia,
                codigoPostal: updatedUserAdress.codigoPostal,
            }));

            // Verificar si la acción fue exitosa
            if (editAdressUser.fulfilled.match(resultAction)) {
                setUserAdress({
                    calle: updatedUserAdress.calle,
                    referencia: updatedUserAdress.referencia,
                    pais: updatedUserAdress.pais,
                    ciudad: updatedUserAdress.ciudad,
                    colonia: updatedUserAdress.colonia,
                    codigoPostal: updatedUserAdress.codigoPostal,
                });
            } else {
                console.error("Error al actualizar la dirección:", resultAction.payload);
            }
        } catch (error) {
            console.error("Error desconocido al actualizar la dirección:", error);
        }
    };

    const handleSaveDataGeneral = async (updateNick: string) => {
        if (!currentUser) return;

        try {
            const resultAction = await dispatch(editNickName({
                id_usuario: currentUser.id_usuario,
                nick: updateNick,
                token: currentUser.token,
            }));

            // Verificar si la acción fue exitosa
            if (editNickName.fulfilled.match(resultAction)) {

                setUserDataGeneral((prev) => ({
                    ...prev,
                    nickname: updateNick, // Actualizar el estado local
                }));
            } else {
                console.error("Error al actualizar el nickname:", resultAction.payload);
            }
        } catch (error) {
            console.error("Error desconocido al actualizar el nickname:", error);
        }
    };

    return (
        <div className="myprofile-container">
            {/* Barra lateral */}
            <div className="prof-side-container">
                {/* Imagen de perfil */}
                <div className="imgProf">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt="Perfil"
                            className="profile-image-container"
                        />
                    ) : (
                        <div className="default-avatar">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="125"
                                height="125"
                                fill="#6b7280"
                                className="user-icon"
                                viewBox="0 0 16 16"
                            >
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path
                                    fillRule="evenodd"
                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                />
                            </svg>
                        </div>
                    )}
                </div>
                
                {/* Tabs */}
                <div className="tabs">
                    {['EditarFoto', 'Perfil', 'Direccion'].map((tab) => (
                        <button
                            key={tab}
                            className={`info-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'EditarFoto' ? 'Editar Foto' : tab}
                        </button>
                    ))}
                </div>
            </div>
                
            {/* Contenido principal */}
            <div className="prof-container">
                {activeTab === 'EditarFoto' && (
                    <ChangeProfileIMG 
                        prof_pic={currentUser?.prof_pic} 
                        token={currentUser?.token} 
                        id={currentUser?.id_usuario} 
                    />
                )}
                {activeTab === 'Perfil' && (
                    <UserProfile 
                        currentUser={userDataGeneral} 
                        onSaveNickname={handleSaveDataGeneral} 
                    />
                )}
                {activeTab === 'Direccion' && (
                    <UserAddress 
                        currentUser={userAdress} 
                        onSave={handleSaveAdress} 
                    />
                )}
            </div>
        </div>
    );
};

export default MyProfile;