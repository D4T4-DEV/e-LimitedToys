import React from 'react';
import './LoadingModal.css';
import loadingGif from '../img/ezgif-5-c06c195611.gif';

interface LoadingModalProps {
  isOpen: boolean;
  mensaje?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, mensaje = 'Cargando, por favor espera...' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-loading">
      <div className="modal-content-loading">
        <img
          src={loadingGif}
          alt="Cargando recursos"
          className="loading-modal"
        />
        <p style={{marginTop: '2px'}}>{mensaje}</p>
      </div>
    </div>
  );
};

export default LoadingModal;