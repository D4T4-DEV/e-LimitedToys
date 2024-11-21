import React, { useState } from 'react';
import './Auth.css';

const SignUp: React.FC = () => {
  const [step, setStep] = useState(1);
  const [exiting, setExiting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    calle: "",
    referencias: "",
    pais: "",
    ciudad: "",
    colonia: "",
    codigoPostal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setStep(2);
    }, 500);
  };

  const handlePreviousStep = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setStep(1);
    }, 500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.error("Las contraseñas no coinciden.");
      return;
    }

    // Lógica para manejar el registro de usuario
    console.log("Datos completos:", formData);

    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      console.log("Registro exitoso.");
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="step-indicator">
        <div className={`step-circle ${step === 1 ? "active" : ""}`} />
        <div className={`step-circle ${step === 2 ? "active" : ""}`} />
      </div>
      <h2>Crear una cuenta</h2>
      <div className="form-container">
        {step === 1 && (
          <form
            onSubmit={handleNextStep}
            className={`form-step ${exiting ? "exiting" : "active"}`}
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" className="button-signup">
              Siguiente
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSignUp}
            className={`form-step ${exiting ? "exiting" : "active"}`}
          >
            <input
              type="text"
              name="calle"
              placeholder="Calle"
              value={formData.calle}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="referencias"
              placeholder="Referencias"
              value={formData.referencias}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pais"
              placeholder="País"
              value={formData.pais}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="colonia"
              placeholder="Colonia"
              value={formData.colonia}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="codigoPostal"
              min="01000"
              max="99999"
              placeholder="Código postal"
              value={formData.codigoPostal}
              onChange={handleChange}
              required
            />
            <div className="buttons">
              <button
                type="button"
                className="button-back"
                onClick={handlePreviousStep}
              >
                Anterior
              </button>
              <button type="submit" className="button-signup">
                Registrarse
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
