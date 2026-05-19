/**
 * @fileoverview Formulario de autenticación reutilizable (Login / Registro).
 *
 * Estilo "Calm-Industrial": minimalista, plano, sin sombras exageradas ni
 * fondos difuminados. Usa tokens semánticos (bg-background, bg-card, border-border).
 *
 * @module components/common/auth/AuthForm
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '.';
import Button from '../../ui/buttons/Button';
import { Tractor } from 'lucide-react';

const AuthForm = ({ formType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    userType: 'normal',
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor, completa los campos requeridos.');
      return;
    }

    if (formType === 'register' && !formData.name?.trim()) {
      setErrorMessage('Por favor, ingresa tu nombre.');
      return;
    }

    if (formType === 'register' && formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      if (formType === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        });
        const from = location.state?.from;
        const redirectTo = from
          ? `${from.pathname || '/'}${from.search || ''}${from.hash || ''}`
          : '/';
        navigate(redirectTo, { replace: true });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.userType === 'educator' ? 'operator' : 'user',
        });
        navigate('/Login', { replace: true, state: { registered: true } });
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium leading-none text-foreground mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-sm mb-4">
            <Tractor className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {formType === 'login' ? 'Bienvenido de nuevo' : 'Crear una cuenta'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formType === 'login' 
              ? 'Ingresa a tu cuenta para continuar.' 
              : 'Regístrate para acceder a la plataforma.'}
          </p>
        </div>

        {/* Tarjeta de formulario */}
        <div className="bg-card border border-border/60 rounded px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {errorMessage && (
              <div className="bg-destructive/10 text-destructive text-sm font-medium p-3 rounded border border-destructive/20 text-center">
                {errorMessage}
              </div>
            )}

            {formType === 'register' && (
              <div>
                <label htmlFor="name" className={labelClass}>Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className={inputClass}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClass}>Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className={inputClass}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium leading-none text-foreground">Contraseña</label>
                {formType === 'login' && (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                )}
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
                required
                autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {formType === 'register' && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputClass}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <fieldset>
                  <legend className={labelClass}>Tipo de perfil</legend>
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border/40 hover:bg-muted/50 transition-colors">
                      <input
                        id="normal"
                        name="userType"
                        type="radio"
                        value="normal"
                        checked={formData.userType === 'normal'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Usuario General</span>
                        <span className="text-xs text-muted-foreground mt-0.5">Acceso a consultas de maquinaria</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border/40 hover:bg-muted/50 transition-colors">
                      <input
                        id="educator"
                        name="userType"
                        type="radio"
                        value="educator"
                        checked={formData.userType === 'educator'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Perfil Técnico</span>
                        <span className="text-xs text-muted-foreground mt-0.5">Acceso a herramientas y parámetros avanzados</span>
                      </div>
                    </label>
                  </div>
                </fieldset>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center h-10 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : (formType === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
            </button>
          </form>
        </div>

        {/* Footer actions */}
        <div className="mt-6 text-center">
          {formType === 'login' ? (
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link to="/Registro" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Regístrate ahora
              </Link>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/Login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Inicia sesión
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthForm;
