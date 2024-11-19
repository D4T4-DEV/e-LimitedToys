import React from 'react';
import './LoadingModal.css';
import loadingGif from '../img/ezgif-5-c06c195611.gif';

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img
          src={loadingGif}
          alt="Cargando recursos"
          className="loading"
        />
        <p>Cargando, por favor espera...</p>
      </div>
    </div>
  );
};

export default LoadingModal;