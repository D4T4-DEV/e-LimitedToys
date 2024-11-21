import React, { useState } from 'react';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Usuario inició sesión:', { email, password });
  };

  return (
    <div className="auth-container login">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
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
    </div>
  );
};

export default Login;
