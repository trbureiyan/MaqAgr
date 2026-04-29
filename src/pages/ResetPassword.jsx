import React, { useState } from 'react';
import { useAuth } from '../components/common/auth';
import { sileo } from 'sileo';
import backgroundImage from '../assets/img/fondo.jpg';
import Button from '../components/ui/buttons/Button';
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
    } catch (error) {
      sileo.error('Error al restablecer contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = 'w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base';
  const labelClass = 'block text-white font-bold mb-2 text-sm sm:text-base';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-85 bg-blend-overlay bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md mx-auto py-8 px-4 sm:px-6">
        <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden px-5 sm:px-8 pt-8 pb-10">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-6">RESTABLECER CONTRASEÑA</h2>
          
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
              <Button type="submit" variant="primary" color="#EAB308" fullWidth shape="pill" textColor="#000000" disabled={isLoading}>
                {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
