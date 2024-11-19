import './Auth.css';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginSchema } from '../Interfaces/LoginInterface';
import { iniciarSesion } from '../redux/Trunks/userTrunk';
import LoadingModal from '../components/LoadignModal';

type FormDataLogin = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, currentUser } = useSelector(
    (state: RootState) => state.users
  );

  const { register, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data: FormDataLogin) => {
    dispatch(iniciarSesion(data));
  };

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>
      {status === "loading" &&
        <LoadingModal isOpen={status === "loading"} />
      }
      {status === "failed" && <p className="error-message">Error: {error}</p>}
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
      <h3>¿No tienes cuenta? Crea una aquí</h3>
    </div>
  );
};

export default Login;
