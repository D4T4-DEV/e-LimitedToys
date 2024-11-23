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

type FormDataSignUp = z.infer<typeof UserSignUpSchema>;

const SignUp: React.FC = () => {
  const [step, setStep] = useState(1);
  const [exiting, setExiting] = useState(false);
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [mensajeModal, setMensajeModal] = useState<string | undefined>(undefined);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

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

  const handleNextStep = async (data: FormDataSignUp) => {
    setFormData((prev) => ({ ...prev, ...data }));
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

      setExiting(true);
      setTimeout(() => {
        setExiting(false);
        setStep(2);
      }, 500);
    } else if (checkoutEmail.rejected.match(resultAction)) {
      setIsOpenLoading(false);
      const errorMessage = resultAction.error.message || 'Error al verificar el correo electrónico.';
      generateWarningTostify(errorMessage);
    }
  };

  const handleSignUp = (data: FormDataSignUp) => {
    const normalizedData = {
      ...formData,
      ...data,
    };
    console.log('Datos completos del registro:', normalizedData);

    setIsOpenLoading(true);
    setMensajeModal('Registrando...');

    setExiting(true);
    setTimeout(() => {
      setIsOpenLoading(false);
      setMensajeModal(undefined);
      setExiting(false);
      console.log('Registro exitoso.');
    }, 500);
  };

  const handlePreviousStep = () => {
    dispatch(cleanAllCheckouts());
    setExiting(true);

    setTimeout(() => {
      reset(formData, { keepErrors: false });
      setExiting(false);
      setStep(1);
    }, 500);
  };

  return (
    <div className="auth-container">
      <LoadingModal isOpen={isOpenLoading} mensaje={mensajeModal} />
      <div className="step-indicator">
        <div className={`step-circle ${step === 1 ? 'active' : ''}`} />
        <div className={`step-circle ${step === 2 ? 'active' : ''}`} />
      </div>
      <h2>Crear una cuenta</h2>
      <div className="form-container">
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

        {step === 2 && (
          <form
            onSubmit={handleSubmit(handleSignUp)}
            className={`form-step ${exiting ? 'exiting' : 'active'}`}
          >
            <input type="text" placeholder="Calle" defaultValue={formData.calle} {...register('calle')} />
            <input type="text" placeholder="Colonia" defaultValue={formData.colonia} {...register('colonia')} />
            <input type="text" placeholder="Ciudad" defaultValue={formData.ciudad} {...register('ciudad')} />
            <input type="text" placeholder="País" defaultValue={formData.pais} {...register('pais')} />
            <input type="number" placeholder="Código postal" defaultValue={formData.codigoPostal || ''} {...register('codigoPostal')} />
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
