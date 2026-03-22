/**
 * @fileoverview Formulario de autenticación reutilizable (Login / Registro).
 *
 * Componente unificado que renderiza el formulario de login o de registro
 * según la prop `formType`. Usa una imagen de fondo con overlay oscuro
 * para crear un contexto visual inmersivo.
 *
 * Campos por tipo de formulario:
 *  - login    : email, contraseña
 *  - register : nombre, email, contraseña, confirmar contraseña, tipo de usuario
 *
 * Responsive:
 *  - Contenedor centrado con padding horizontal adaptable
 *  - Tarjeta de formulario con ancho máximo `max-w-md`
 *  - Tipografía y espaciado escalados con breakpoints sm
 *
 * @module components/common/auth/AuthForm
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './';
import backgroundImage from '../../../assets/img/fondo.jpg';
import Button from '../../ui/buttons/Button';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * AuthForm — Formulario de autenticación unificado (login y registro).
 *
 * Gestiona un estado centralizado para todos los campos del formulario.
 * La lógica de envío es simplificada (mock) para el contexto actual del proyecto;
 * en producción se reemplazará por llamadas a la API de autenticación.
 *
 * @component
 *
 * @param {Object} props
 * @param {'login' | 'register'} props.formType - Tipo de formulario a renderizar.
 *
 * @returns {JSX.Element} Formulario de autenticación con fondo de imagen.
 *
 * @example
 * // Página de login
 * <AuthForm formType="login" />
 *
 * @example
 * // Página de registro
 * <AuthForm formType="register" />
 */
const AuthForm = ({ formType }) => {
  // ── Hooks ─────────────────────────────────────────────────────────────────

  /** Función de navegación programática para redirigir tras el envío. */
  const navigate = useNavigate();

  /** Función de login del contexto de autenticación global. */
  const { login } = useAuth();

  // ── Estado del formulario ─────────────────────────────────────────────────

  /**
   * Estado centralizado para todos los campos del formulario.
   * Incluye campos de ambos tipos (login y registro) para simplificar el manejo.
   *
   * @type {{
   *   email: string,
   *   password: string,
   *   name: string,
   *   confirmPassword: string,
   *   userType: 'normal' | 'educator'
   * }}
   */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    userType: 'normal',
  });

  // ── Manejadores ───────────────────────────────────────────────────────────

  /**
   * Actualiza el campo correspondiente del formulario cuando el usuario escribe.
   * Usa la propiedad computada `[name]` para actualizar solo el campo que cambió,
   * preservando los demás valores con el spread operator.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario.
   * En modo login: autentica al usuario y redirige al inicio.
   * En modo registro: muestra confirmación y redirige al login.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
   */
  const handleSubmit = (e) => {
    // Prevenir recarga de página por comportamiento nativo del formulario
    e.preventDefault();

    if (formType === 'login') {
      /*
       * Autenticación mock: en producción se llamará a POST /api/auth/login.
       * El nombre de usuario se deriva del email para simplificar el contexto actual.
       */
      login({
        email: formData.email,
        name: formData.email.split('@')[0],
      });
      navigate('/');
    } else {
      /*
       * Registro mock: en producción se llamará a POST /api/auth/register.
       * Por ahora solo muestra una alerta y redirige al login.
       */
      alert('Registro exitoso. Por favor inicie sesión.');
      navigate('/login');
    }
  };

  // ── Clases compartidas para los inputs ───────────────────────────────────

  /**
   * Clases CSS comunes para todos los campos de texto del formulario.
   * Estilo de línea inferior (underline) sobre fondo transparente.
   */
  const inputClass =
    'w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white ' +
    'bg-transparent text-white placeholder-gray-400 px-0 py-2 ' +
    'focus:ring-0 focus:border-yellow-400 text-sm sm:text-base';

  /** Clases CSS comunes para las etiquetas de los campos. */
  const labelClass = 'block text-white font-bold mb-2 text-sm sm:text-base';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    /*
     * Contenedor principal con imagen de fondo y overlay oscuro.
     * `bg-blend-overlay` combina el color de fondo con la imagen.
     */
    <div
      className="min-h-screen flex items-center justify-center
                 bg-gray-800 bg-opacity-85 bg-blend-overlay
                 bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Wrapper con padding responsive */}
      <div className="w-full py-8 px-4 sm:px-6 lg:py-12">

        {/* Tarjeta del formulario — ancho máximo centrado */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-5 sm:px-8 pt-8 pb-10">

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>

                {/* Título dinámico según el tipo de formulario */}
                <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
                  {formType === 'login' ? 'LOGIN' : 'REGISTRO'}
                </h2>

                {/* ── Campo: Nombre (solo en registro) ── */}
                {formType === 'register' && (
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Digite su nombre"
                      className={inputClass}
                      required
                      autoComplete="name"
                    />
                  </div>
                )}

                {/* ── Campo: Email (ambos tipos) ── */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite un email válido"
                    className={inputClass}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* ── Campo: Contraseña (ambos tipos) ── */}
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      formType === 'login'
                        ? 'Digita tu contraseña'
                        : 'Digita una contraseña segura'
                    }
                    className={inputClass}
                    required
                    autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>

                {/* ── Campos adicionales solo para registro ── */}
                {formType === 'register' && (
                  <>
                    {/* Campo: Confirmar contraseña */}
                    <div>
                      <label htmlFor="confirmPassword" className={labelClass}>
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Digita otra vez la contraseña"
                        className={inputClass}
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    {/* Selección de tipo de usuario con radio buttons */}
                    <fieldset className="mt-4">
                      <legend className={labelClass}>Tipo de usuario</legend>
                      {/*
                       * Layout responsive:
                       *  - móvil  : vertical (flex-col)
                       *  - sm+    : horizontal (flex-row)
                       */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 sm:items-center">
                        {/* Opción: usuario normal */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            id="normal"
                            name="userType"
                            type="radio"
                            value="normal"
                            checked={formData.userType === 'normal'}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-500 focus:ring-yellow-400"
                          />
                          <span className="text-white text-sm sm:text-base">Usuario Normal</span>
                        </label>

                        {/* Opción: usuario educador */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            id="educator"
                            name="userType"
                            type="radio"
                            value="educator"
                            checked={formData.userType === 'educator'}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-500 focus:ring-yellow-400"
                          />
                          <span className="text-white text-sm sm:text-base">Usuario Educador</span>
                        </label>
                      </div>
                    </fieldset>
                  </>
                )}

                {/* Enlace a registro — solo visible en modo login */}
                {formType === 'login' && (
                  <div className="text-center">
                    <a
                      href="/Registro"
                      className="text-white hover:text-yellow-200 text-sm sm:text-base
                                 underline-offset-2 hover:underline transition-colors"
                    >
                      ¿Aún no estás registrado? Regístrate aquí
                    </a>
                  </div>
                )}

                {/* Botón de envío — ancho completo */}
                <div className="pt-2 sm:pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    color="#EAB308"
                    fullWidth
                    size="large"
                    shape="pill"
                    textColor="#000000"
                  >
                    {formType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
