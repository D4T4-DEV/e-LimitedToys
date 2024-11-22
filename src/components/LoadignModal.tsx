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
    <div className="modal-overlay">
      <div className="modal-content">
        <img
          src={loadingGif}
          alt="Cargando recursos"
          className="loading"
        />
        <p>{mensaje}</p>
      </div>
    </div>
  );
};

export default LoadingModal;