import './Auth.css';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginSchema } from '../Interfaces/LoginInterface';
import { iniciarSesion } from '../redux/Trunks/userTrunk';
import LoadingModal from '../components/LoadignModal';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { limpiarError } from '../redux/Slides/userSlice';
import { limpiarErroresMensaje } from '../redux/Slides/notificationsSlice';
import { generateErrorTostify, generateInfoTostify } from '../components/TostifyNotifications';


type FormDataLogin = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, currentUser } = useSelector(
    (state: RootState) => state.users
  );

  const { mensajesNotificacion } = useSelector(
    (state: RootState) => state.notifications
  );

  const { register, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data: FormDataLogin) => {
    dispatch(iniciarSesion(data));
  };

  useEffect(() => {
    // Si esta logueado no lo deja acceder a esta pagina, 
    // lo redirigira a la pagina principal
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Mostrar notificación del error proveniente de la API o otro medio
    if (status === "failed" && error) {
      generateErrorTostify(error);
      dispatch(limpiarError());
    }
    if (mensajesNotificacion) {
      generateInfoTostify(mensajesNotificacion);
      dispatch(limpiarErroresMensaje());
    }
  }, [status, error, mensajesNotificacion, dispatch]);

  return (
    <div className="auth-container login">
      <h2>Iniciar sesión</h2>
      {status === "loading" &&
        <LoadingModal isOpen={status === "loading"} />
      }
      {currentUser && <p>Bienvenido, {currentUser.nick}</p>}
      <form onSubmit={handleSubmit(handleLogin)}>
        <input
          type="email"
          placeholder="Correo electrónico"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
        />
        {errors.password && <span className="error-message">{errors.password.message}</span>}

        <button type="submit" className="button-login">
          Iniciar sesión
        </button>
      </form>
      <h3>
        ¿No tienes cuenta?{' '}
        <a href="/signup" className="link-auth">
          Crea una aquí
        </a>
      </h3>
      {/* Contenedor para las notificaciones por toastify este muestra los errores nada mas */}
      <ToastContainer />
    </div>
  );
};

export default Login;