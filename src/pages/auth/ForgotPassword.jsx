import React, { useState } from "react";
import { useAuth } from '@/features/auth/hooks/useAuth';
import { sileo } from "sileo";
import backgroundImage from "@/assets/background/deep-teal-minimalist-curved-landscape-pexels-steve.webp";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSuccess(true);
      sileo.success("Instrucciones enviadas al correo");
    } catch {
      sileo.error("Error al solicitar recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors';
  const labelClass = 'block text-sm font-medium leading-none text-foreground mb-1.5';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat w-full relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="w-full max-w-md mx-auto py-8 px-4 sm:px-6 relative z-10">
        <div className="bg-card/95 backdrop-blur-sm border border-border/40 rounded-md overflow-hidden px-5 sm:px-8 pt-8 pb-10">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-foreground mb-6">
            Recuperar contraseña
          </h2>

          {isSuccess ? (
            <div className="text-center space-y-6">
              <p className="text-foreground">
                Se ha enviado un enlace de recuperación a tu correo electrónico.
              </p>
              <Link
                to="/Login"
                className="w-full flex justify-center items-center h-10 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Digita tu correo electrónico"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center h-10 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Procesando..." : "Enviar instrucciones"}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link
                  to="/Login"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Volver al Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
