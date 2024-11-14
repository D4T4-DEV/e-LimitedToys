import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './Auth.css';
import { EncriptarDatos } from '../security/Encr_decp';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

const { BASE_URL_API_E_LIMITED } = import.meta.env;

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electronico invalido' }),
  password: z.string()
});

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

type JsonData = { [key: string]: any }; // -> Objeto JSON 
export interface Respuesta {
  status: number;
  message: string;
  data?: JsonData
}

const IniciarSesion = async (dataRecibida: any): Promise<void> => {

  // Creamos los datos en formato application/x-www-form-urlencoded
  const data = qs.stringify({
    'datos_encriptados': await EncriptarDatos(dataRecibida),
  });

  // Configuracion de la peticion que generá AXIOS
  const config: AxiosRequestConfig = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${BASE_URL_API_E_LIMITED}/usuarios/login/`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data,
  };

  try {
    // tramite y espera de respuesta
    const response: AxiosResponse<Respuesta> = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error(error); // -> Esto debe ser tratado mejor y no en consola del cliente OJO 
  }
};

export default Login;