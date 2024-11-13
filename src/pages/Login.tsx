import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './Auth.css';

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

export default Login;