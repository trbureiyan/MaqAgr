import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { sileo } from 'sileo';
import backgroundImage from '@/assets/background/deep-teal-minimalist-curved-landscape-pexels-steve.webp';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      sileo.error('Las contraseñas no coinciden');
      return;
    }
    if (!token) {
      sileo.error('Token inválido o no encontrado');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      sileo.success('Contraseña restablecida correctamente');
      navigate('/Login');
    } catch {
      sileo.error('Error al restablecer contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = 'w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors';
  const labelClass = 'block text-sm font-medium leading-none text-foreground mb-1.5';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat w-full relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="w-full max-w-md mx-auto py-8 px-4 sm:px-6 relative z-10">
        <div className="bg-card/95 backdrop-blur-sm border border-border/40 rounded-md overflow-hidden px-5 sm:px-8 pt-8 pb-10">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-foreground mb-6">Restablecer contraseña</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                placeholder="Digita tu nueva contraseña"
                required
              />
            </div>
            
            <div>
              <label className={labelClass}>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="Confirma tu nueva contraseña"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center h-10 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
