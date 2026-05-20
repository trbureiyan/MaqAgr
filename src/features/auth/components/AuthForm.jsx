/**
 * @fileoverview Formulario de autenticación reutilizable (Login / Registro).
 *
 * Estilo "Calm-Industrial": minimalista, plano, sin sombras exageradas ni
 * fondos difuminados. Usa tokens semánticos (bg-background, bg-card, border-border).
 *
 * Layout: split-screen — panel visual a la izquierda (oculto en móvil),
 * formulario a la derecha.
 *
 * @module components/common/auth/AuthForm
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '@/components/ui/LegacyButton';
import { Tractor } from 'lucide-react';
import backgroundImage from '@/assets/background/lime-isometric-stepped-pattern-bg-pexels-hartonocreativestudio.webp';
import fieldImage from '@/assets/domain/feature-tractor-on-sand-pexels-markusspiske.webp';

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

  const inputClass = "w-full rounded border border-border/60 bg-background px-4 py-2.5 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors";
  const labelClass = "block text-base font-semibold leading-none text-foreground mb-2";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      {/* Left: Visual panel — hidden on mobile */}
      <div
        className="hidden md:flex relative flex-col justify-between p-10 overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-foreground/60" />

        {/* Branding content — on top of overlay */}
        <div className="relative z-10 flex flex-col">
          <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center rounded-sm mb-4">
            <Tractor className="w-5 h-5 text-white" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">MAQAGR</span>
          <span className="text-white/95 text-base mt-2">
            Tecnología y precisión para la toma de decisiones agrícolas
          </span>
        </div>

        {/* Bottom inset photo + caption */}
        <div className="relative z-10 mt-auto">
          <img
            src={fieldImage}
            alt="Campo agrícola al atardecer"
            className="w-full max-h-[200px] object-cover rounded-md border border-white/20"
          />
          <p className="text-white/80 text-sm mt-2">
            Sistema de apoyo en mecanización agrícola
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          {/* Encabezado */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-sm mb-4">
              <Tractor className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {formType === 'login' ? 'Bienvenido de nuevo' : 'Crear una cuenta'}
            </h1>
            <p className="text-base text-muted-foreground mt-2">
              {formType === 'login' 
                ? 'Ingresa a tu cuenta para continuar.' 
                : 'Regístrate para acceder a la plataforma.'}
            </p>
          </div>

          {/* Tarjeta de formulario */}
          <div className="bg-card border border-border/60 rounded px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

              {errorMessage && (
                <div className="bg-destructive/10 text-destructive text-base font-medium p-3 rounded border border-destructive/20 text-center">
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-base font-semibold leading-none text-foreground">Contraseña</label>
                  {formType === 'login' && (
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
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
                          <span className="text-base font-semibold text-foreground">Usuario General</span>
                          <span className="text-sm text-muted-foreground mt-1">Acceso a consultas de maquinaria</span>
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
                          <span className="text-base font-semibold text-foreground">Perfil Técnico</span>
                          <span className="text-sm text-muted-foreground mt-1">Acceso a herramientas y parámetros avanzados</span>
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center h-12 px-4 bg-primary text-primary-foreground text-base font-bold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Procesando...' : (formType === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
              </button>
            </form>
          </div>

          {/* Footer actions */}
          <div className="mt-6 text-center">
            {formType === 'login' ? (
              <p className="text-base text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link to="/Registro" className="font-bold text-primary hover:text-primary/80 transition-colors">
                  Regístrate ahora
                </Link>
              </p>
            ) : (
              <p className="text-base text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/Login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                  Inicia sesión
                </Link>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthForm;
