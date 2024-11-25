import React, { useState, useEffect } from 'react';
import './Auth.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ToastContainer } from 'react-toastify';
import { generateWarningTostify } from '../components/TostifyNotifications';
import { UserSignUpSchema } from '../Interfaces/SignUpInterface';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { checkoutEmail } from '../redux/Trunks/checkoutDataTrunk';
import { cleanAllCheckouts } from '../redux/Slides/checksDataSlice';
import LoadingModal from '../components/LoadignModal';
import { subirImagenPerfil } from '../redux/Trunks/accionesVariasThunk';
import { registrarUsuario } from '../redux/Trunks/userTrunk';
import { useNavigate } from 'react-router-dom';

type FormDataSignUp = z.infer<typeof UserSignUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Paso actual del formulario.
  const [exiting, setExiting] = useState(false); // Controla las transiciones entre pasos.
  const [isOpenLoading, setIsOpenLoading] = useState(false); // Modal de carga.
  const [mensajeModal, setMensajeModal] = useState<string | undefined>(undefined); // Mensaje del modal.
  const [errorMessages, setErrorMessages] = useState<string | null>(null); // Mensajes de error.
  const [image, setImage] = useState<File | null>(null); // Imagen de perfil seleccionada.
  const [preview, setPreview] = useState<string | null>(null); // Vista previa de la imagen.

  const dispatch = useDispatch<AppDispatch>(); // Medio que se utiliza en el desapachador

  // Valores de inicio del formulario
  const [formData, setFormData] = useState<FormDataSignUp>({
    nombres: '',
    apellidos: '',
    email: '',
    nick: '',
    password: '',
    confirmPassword: '',
    calle: '',
    colonia: '',
    ciudad: '',
    pais: '',
    codigoPostal: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: formData,
  });

  // Manejo de errores de validación
  useEffect(() => {
    if (errors.confirmPassword) {
      setErrorMessages(errors.confirmPassword.message || 'Error en la confirmación de contraseña.');
    } else if (errors.codigoPostal) {
      setErrorMessages(errors.codigoPostal.message || 'Error en el código postal.');
    } else {
      setErrorMessages(null);
    }
  }, [errors]);

  useEffect(() => {
    if (errorMessages) {
      generateWarningTostify(errorMessages);
    }
  }, [errorMessages]);

  // Cambio y renderizado de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Genera vista previa
    }
  };

  // Retrocede a los valores anteriores del formulario
  const handlePreviousStep = () => {
    dispatch(cleanAllCheckouts());
    setExiting(true);

    setTimeout(() => {
      reset(formData, { keepErrors: false });
      setExiting(false);
      setStep(step - 1);
    }, 500);
  };

  // Avanza a los siguientes valores del formulario
  const handleNextStep = async (data: FormDataSignUp) => {
    setFormData((prev) => ({ ...prev, ...data }));

    // Si esta en el primer paso aqui, verificamos que no este registrado
    if (step === 1) {
      setIsOpenLoading(true);
      setMensajeModal('Checando si existe el correo...');
      const resultAction = await dispatch(checkoutEmail(data.email));

      if (checkoutEmail.fulfilled.match(resultAction)) {
        setIsOpenLoading(false);

        const isEmailRegistered = resultAction.payload;

        if (isEmailRegistered) {
          generateWarningTostify('El correo ya está registrado.');
          return;
        }

      } else if (checkoutEmail.rejected.match(resultAction)) {
        setIsOpenLoading(false);
        const errorMessage = resultAction.error.message || 'Error al verificar el correo electrónico.';
        generateWarningTostify(errorMessage);
        return;
      }
    }

    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setStep(step + 1);
    }, 500);

  };

  // Acciones que se ejecutaran al darle al boton de registrarse
  const handleSignUp = async (data: FormDataSignUp) => {
    try {
      // Filtramos para quitar el campo confirmar contraseña
      const { confirmPassword, ...filteredData } = {
        ...formData,
        ...data,
      };

      // Tomamos los datos filtrados y normalizados por el esquema
      const normalizedData = { ...filteredData };

      // Abrimos el modal de carga
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

          normalizedData.prof_pic = uploadCorrect;
        } else if (subirImagenPerfil.rejected.match(resultAction)) {
          const errorMessage = resultAction?.payload as string || 'Error al subir la imagen.';
          throw new Error(errorMessage);
        }
      }

      // Cambiamos el texto del modal
      setMensajeModal('Registrando...');
      const resultAction = await dispatch(registrarUsuario(normalizedData));

      if (registrarUsuario.fulfilled.match(resultAction)) {
        const isRegistered = resultAction.payload;

        if (isRegistered) {
          throw new Error('No pudimos registrarte, inténtalo más tarde');
        }

        // Redirigir al login
        navigate('/login');
      } else if (registrarUsuario.rejected.match(resultAction)) {
        const errorMessage = resultAction.error.message || 'Error al registrarte.';
        throw new Error(errorMessage);
      }

    } catch (error) {
      // Manejo centralizado de errores
      generateWarningTostify(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      // Restaurar el estado
      setIsOpenLoading(false);
      setMensajeModal(undefined);
      setExiting(false);
    }
  };

  return (
    <div className="auth-container">
      <LoadingModal isOpen={isOpenLoading} mensaje={mensajeModal} />
      <div className="step-indicator">
        <div className={`step-circle ${step === 1 ? 'active' : ''}`} />
        <div className={`step-circle ${step === 2 ? 'active' : ''}`} />
        <div className={`step-circle ${step === 3 ? 'active' : ''}`} />
      </div>
      <h2>Crear una cuenta</h2>
      <div className="form-container">
        {/* Paso uno del formulario */}
        {step === 1 && (
          <form
            onSubmit={handleSubmit(handleNextStep)}
            className={`form-step ${exiting ? 'exiting' : 'active'}`}
          >
            <input type="text" placeholder="Nombre" defaultValue={formData.nombres} {...register('nombres')} />
            <input type="text" placeholder="Apellido" defaultValue={formData.apellidos} {...register('apellidos')} />
            <input type="email" placeholder="Correo electrónico" defaultValue={formData.email} {...register('email')} />
            <input type="text" placeholder="Nombre de usuario" defaultValue={formData.nick} {...register('nick')} />
            <input type="password" placeholder="Contraseña" {...register('password')} />
            <input type="password" placeholder="Confirmar contraseña" {...register('confirmPassword')} />
            <button type="submit" className="button-signup">Siguiente</button>
          </form>
        )}
        {/* Paso dos del formulario */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(handleNextStep)}
            className={`form-step ${exiting ? 'exiting' : 'active'}`}
          >
            <p>Aspectos opcionales</p>
            <input type="text" placeholder="Calle" defaultValue={formData.calle} {...register('calle')} />
            <input type="text" placeholder="Colonia" defaultValue={formData.colonia} {...register('colonia')} />
            <input type="text" placeholder="Ciudad" defaultValue={formData.ciudad} {...register('ciudad')} />
            <input type="text" placeholder="País" defaultValue={formData.pais} {...register('pais')} />
            <input type="number" placeholder="Código postal" defaultValue={formData.codigoPostal || ''} {...register('codigoPostal')} />
            <div className="buttons">
              <button type="button" className="button-back" onClick={handlePreviousStep}>Anterior</button>
              <button type="submit" className="button-signup">Siguiente</button>

            </div>
          </form>
        )}
        {/* Paso tres y ultimo del formulario */}
        {step === 3 && (
          <form
            onSubmit={handleSubmit(handleSignUp)}
            className={`form-step ${exiting ? 'exiting' : 'active'}`}
          >
            <p>Aspectos opcionales</p>
            <input type="file" accept="image/jpeg, image/png, image/webp, image/gif" onChange={handleImageChange} size={10 * 1024 * 1024}/>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '200px' }}>
              <h3>Vista Previa:</h3>
              {preview && (
                <img src={preview} alt="Vista previa" style={{ maxWidth: '125px', maxHeight: '125px', borderRadius: '50%' }} />
              )}
            </div>
            <div className="buttons">
              <button type="button" className="button-back" onClick={handlePreviousStep}>Anterior</button>
              <button type="submit" className="button-signup">Registrarse</button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} newestOnTop closeOnClick hideProgressBar={false} pauseOnHover draggable theme="dark" limit={10} />
    </div>
  );
};

export default SignUp;