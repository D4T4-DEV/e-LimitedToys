import { useState } from 'react';
import './MyProfile.css';

const MyProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Perfil');

    return (
        <>
            <div className='myprofile-container'>
                <div className="prof-side-container">
                    <div className="imgProf">
                        <img
                            src="url-a-la-imagen-del-usuario"
                            alt="Foto de perfil"
                            className="profile-img"
                        />
                        <span className="edit-photo-btn">Editar Foto</span>
                    </div>
                    <div className={`info-tab ${activeTab === 'Perfil' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Perfil')}>Perfil</div>
                    <div className={`info-tab ${activeTab === 'Direccion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Direccion')}>Direccion</div>
                </div>
                <div className="prof-container">
                    {activeTab === 'Perfil' && <p>Información del perfil del usuario</p>}
                    {activeTab === 'Direccion' && <p>Información de la dirección del usuario</p>}
                </div>
            </div>
        </>
    )
}

export default MyProfile;