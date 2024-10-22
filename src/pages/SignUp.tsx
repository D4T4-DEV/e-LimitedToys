import React, { useState } from 'react';
import './Auth.css';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para el registro de usuario
    console.log('Usuario registrado:', { username, email, password });
  };

  return (
    <div className="auth-container">
      <h2>Crear una cuenta</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className='button-signup'>Registrarse</button>
      </form>
      <h3>¿Ya tienes una cuenta? Inicia sesión aquí</h3>
    </div>
  );
};

export default SignUp;
