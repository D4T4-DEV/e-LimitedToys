import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmationModal from "./ConfirmationModal";

// Esquema de validación para el nickname
const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(3, "El nickname debe tener al menos 3 caracteres")
    .max(20, "El nickname no puede superar los 20 caracteres"),
});

type NicknameFormValues = z.infer<typeof nicknameSchema>;

interface UserProfileProps {
  currentUser: {
    nombres: string;
    apellidos: string;
    email: string;
    nickname: string;
  };
  onSaveNickname: (newNickname: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  onSaveNickname,
}) => {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: { nickname: currentUser.nickname },
  });

  const handleEditClick = () => {
    setIsEditingNickname(true);
  };

  const handleCancelClick = () => {
    reset({ nickname: currentUser.nickname }); // Restablecer al valor inicial
    setIsEditingNickname(false);
  };

  const onSubmit: SubmitHandler<NicknameFormValues> = (data) => {
    setNewNickname(data.nickname); // Guardar el nickname en espera de confirmación
    setIsModalOpen(true); // Mostrar modal
  };

  const handleConfirm = () => {
    onSaveNickname(newNickname); // Guardar el nuevo nickname
    setIsEditingNickname(false); // Salir del modo de edición
    setIsModalOpen(false); // Cerrar modal
  };

  const handleModalCancel = () => {
    setNewNickname('');
    setIsModalOpen(false); // Cerrar modal sin guardar
    setIsEditingNickname(false); // Salir del modo de edición
  };

  return (
    <div>
      <p>
        <strong>Nombre completo</strong>:
      </p>
      <p>
        {currentUser.nombres} {currentUser.apellidos}
      </p>

      <div>
        <p>
          <strong>Nickname</strong>:
        </p>
        {!isEditingNickname ? (
          <p>
            {currentUser.nickname}
            <button onClick={handleEditClick} style={{ marginLeft: "10px" }}>
              Editar
            </button>
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "inline" }}>
            <input
              type="text"
              {...register("nickname")}
              placeholder="Introduce un nuevo nickname"
            />
            <button type="submit">Guardar</button>
            <button
              type="button"
              onClick={handleCancelClick}
              style={{ marginLeft: "5px" }}
            >
              Cancelar
            </button>
            {errors.nickname && (
              <p className="error" style={{ color: "red" }}>
                {errors.nickname.message}
              </p>
            )}
          </form>
        )}
      </div>

      <p>
        <strong>Correo electrónico registrado</strong>:
      </p>
      <p>{currentUser.email}</p>

      {/* Modal de confirmación */}
      <ConfirmationModal
        message={`¿Confirmas que deseas cambiar tu nickname a "${newNickname}"?`}
        onConfirm={handleConfirm}
        onCancel={handleModalCancel}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default UserProfile;