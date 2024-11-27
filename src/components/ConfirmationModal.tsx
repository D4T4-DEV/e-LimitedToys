import React from "react";
import './ConfirmationModal.css'

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    message,
    onConfirm,
    onCancel,
    isOpen,
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay-confirmation">
                <div className="modal-content-confirmation">
                    <p>{message}</p>

                    <div className="btns-content">
                        <button
                            onClick={onConfirm}
                            className="btn-yes"
                        >
                            Sí
                        </button>
                        <button
                            onClick={onCancel}
                            className="btn-no"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmationModal;
