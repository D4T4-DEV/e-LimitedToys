import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmationModal from "./ConfirmationModal";
import './UserAdress.css'

// Esquema de validación con Zod
const addressSchema = z.object({
  calle: z.string({ message: "La calle es obligatoria" }),
  colonia: z.string({ message: "La colonia es obligatoria" }),
  ciudad: z.string({ message: "La ciudad es obligatoria" }),
  pais: z.string(),
  codigoPostal: z.string().regex(/^\d{5}$/, "El código postal debe tener 5 dígitos"),
  referencia: z.string().optional(),
});

// Tipos derivados del esquema Zod
type AddressFormValues = z.infer<typeof addressSchema>;

interface UserAddressProps {
  currentUser: AddressFormValues;
  onSave: (updatedUser: AddressFormValues) => void;
}

const UserAddress: React.FC<UserAddressProps> = ({ currentUser, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: currentUser,
  });

  const onSubmit: SubmitHandler<AddressFormValues> = (data) => {
    onSave(data);
    setIsEditing(false); // Salir del modo de edición
  };

  const handleSave = () => {
    setIsModalOpen(true);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmingCancel(true);
  };

  const confirmSave = () => {
    handleSubmit(onSubmit)();
    setIsModalOpen(false);
  };

  const confirmCancel = () => {
    reset(currentUser);
    setIsEditing(false);
    setIsConfirmingCancel(false);
  };

  const cancelModal = () => {
    setIsModalOpen(false);
    setIsConfirmingCancel(false);
  };

  return (
    <div className="address-details">
        {isEditing ? (
            <form className="address-form">
                <div className="address-field">
                    <label className="address-label">
                        <strong>Calle:</strong>
                        <input
                            {...register("calle")}
                            className="address-input"
                            placeholder="Introduce la calle"
                        />
                        {errors.calle && <p className="address-error">{errors.calle.message}</p>}
                    </label>
                </div>
                <div className="address-field">
                    <label className="address-label">
                        <strong>Colonia:</strong>
                        <input
                            {...register("colonia")}
                            className="address-input"
                            placeholder="Introduce la colonia"
                        />
                        {errors.colonia && <p className="address-error">{errors.colonia.message}</p>}
                    </label>
                </div>
                <div className="address-field">
                    <label className="address-label">
                        <strong>Ciudad:</strong>
                        <input
                            {...register("ciudad")}
                            className="address-input"
                            placeholder="Introduce la ciudad"
                        />
                        {errors.ciudad && <p className="address-error">{errors.ciudad.message}</p>}
                    </label>
                </div>
                <div className="address-field">
                    <label className="address-label">
                        <strong>País:</strong>
                        <input
                            {...register("pais")}
                            className="address-input"
                            placeholder="Introduce el país"
                        />
                        {errors.pais && <p className="address-error">{errors.pais.message}</p>}
                    </label>
                </div>
                <div className="address-field">
                    <label className="address-label">
                        <strong>Código postal:</strong>
                        <input
                            {...register("codigoPostal")}
                            className="address-input"
                            placeholder="Introduce el código postal"
                        />
                        {errors.codigoPostal && (
                            <p className="address-error">{errors.codigoPostal.message}</p>
                        )}
                    </label>
                </div>
                <div className="address-field">
                    <label className="address-label">
                        <strong>Referencias:</strong>
                        <input
                            {...register("referencia")}
                            className="address-input"
                            placeholder="Introduce una referencia"
                        />
                        {errors.referencia && (
                            <p className="address-error">{errors.referencia.message}</p>
                        )}
                    </label>
                </div>
                <div className="address-buttons">
                    <button
                        type="button"
                        className="address-button address-button-save"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        className="address-button address-button-cancel"
                        onClick={handleCancelConfirmation}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        ) : (
            <div className="address-display">
                <p><strong>Calle</strong>: {currentUser.calle}</p>
                <p><strong>Colonia</strong>: {currentUser.colonia}</p>
                <p><strong>Ciudad</strong>: {currentUser.ciudad}</p>
                <p><strong>País</strong>: {currentUser.pais}</p>
                <p><strong>Código postal</strong>: {currentUser.codigoPostal}</p>
                <p><strong>Referencias</strong>: {currentUser.referencia}</p>
                <button className="address-button-edit" onClick={() => setIsEditing(true)}>
                    Editar
                </button>
            </div>
          )}

      {/* Modal para confirmar guardar */}
      <ConfirmationModal
        isOpen={isModalOpen}
        message="¿Estás seguro de que deseas guardar los cambios?"
        onConfirm={confirmSave}
        onCancel={cancelModal}
      />

      {/* Modal para confirmar cancelar */}
      <ConfirmationModal
        isOpen={isConfirmingCancel}
        message="¿Estás seguro de que deseas cancelar los cambios?"
        onConfirm={confirmCancel}
        onCancel={cancelModal}
      />
    </div>
  );
};

export default UserAddress;