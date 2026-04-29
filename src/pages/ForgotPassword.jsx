import React, { useState } from "react";
import { useAuth } from "../components/common/auth";
import { sileo } from "sileo";
import backgroundImage from "../assets/img/fondo.jpg";
import Button from "../components/ui/buttons/Button";
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
    } catch (error) {
      sileo.error("Error al solicitar recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base";
  const labelClass = "block text-white font-bold mb-2 text-sm sm:text-base";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-85 bg-blend-overlay bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md mx-auto py-8 px-4 sm:px-6">
        <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden px-5 sm:px-8 pt-8 pb-10">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-6">
            RECUPERAR CONTRASEÑA
          </h2>

          {isSuccess ? (
            <div className="text-center space-y-6">
              <p className="text-white">
                Se ha enviado un enlace de recuperación a tu correo electrónico.
              </p>
              <Button
                variant="primary"
                color="#EAB308"
                to="/Login"
                fullWidth
                shape="pill"
                textColor="#000000"
              >
                Volver a Iniciar Sesión
              </Button>
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
                <Button
                  type="submit"
                  variant="primary"
                  color="#EAB308"
                  fullWidth
                  shape="pill"
                  textColor="#000000"
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Enviar Instrucciones"}
                </Button>
              </div>

              <div className="text-center mt-4">
                <Link
                  to="/Login"
                  className="text-white hover:text-yellow-200 text-sm transition-colors hover:underline"
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
