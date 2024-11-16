import './Auth.css';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import qs from 'qs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EncriptarDatos } from '../security/Encriptar_data';
import { RespuestaApi } from '../Interfaces/Response_API';
import { loginSchema } from '../Interfaces/LoginInterface';

const { VITE_BASE_URL_API } = import.meta.env;

type FormDataLogin = z.infer<typeof loginSchema>;

const Login: React.FC = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: FormDataLogin) => {
    // Lógica para el inicio de sesión
    console.log('Usuario inició sesión:', data);
    await IniciarSesion(data);
  };

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit(handleLogin)}>
        <input
          type="email"
          placeholder="Correo electrónico"
          autoComplete='email'
          {...register("email")}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}

        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
        />
        {errors.password && <span className="error-message">{errors.password.message}</span>}
        <button type="submit" className='button-login'>Iniciar sesión</button>
      </form>
      <h3>¿No tienes cuenta? Crea una aquí</h3>
    </div>
  );
};

// MEDIO PARA HACER LA PETICIÓN A LA API

const IniciarSesion = async (dataRecibida: any): Promise<void> => {

  if (!VITE_BASE_URL_API) {
    throw new Error("No tengo una api a la cual contactarme")
  }

  const datosEncriptados = await EncriptarDatos(dataRecibida);

  // Creamos los datos en formato application/x-www-form-urlencoded
  const data = qs.stringify({
    'datos_encriptados': datosEncriptados,
  });
  
  try {
    // tramite y espera de respuesta
    const response: AxiosResponse<RespuestaApi> = await axios.post(`${VITE_BASE_URL_API}/usuarios/login/`,data);
    // console.log((response.data));
    console.log((response.data));
  } catch (error) {
    if(axios.isAxiosError(error)){
      console.error(error.message); // -> Esto debe ser tratado mejor y no en consola del cliente OJO 
    }
    else{
      console.error(error); // -> Esto debe ser tratado mejor y no en consola del cliente OJO
    }
  }
};

export default Login;