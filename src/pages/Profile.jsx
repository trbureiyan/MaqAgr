import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/common/auth';
import { sileo } from 'sileo';
import backgroundImage from '../assets/img/fondo.jpg';
import Button from '../components/ui/buttons/Button';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      sileo.success('Perfil actualizado correctamente');
      setIsEditingProfile(false);
    } catch (error) {
      sileo.error('Error al actualizar perfil');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      sileo.error('Las nuevas contraseñas no coinciden');
      return;
    }
    try {
      await changePassword({ 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      });
      sileo.success('Contraseña actualizada correctamente');
      setIsEditingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      sileo.error('Error al actualizar contraseña');
    }
  };

  const inputClass = 'w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base mb-4';
  const labelClass = 'block text-white font-bold mb-2 text-sm sm:text-base';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-85 bg-blend-overlay bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full py-8 px-4 sm:px-6 lg:py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8 mt-12 sm:mt-0">
          <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden px-5 sm:px-8 pt-8 pb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Mi Perfil</h2>
              <Button variant="outline" color="#EAB308" onClick={() => setIsEditingProfile(!isEditingProfile)} size="small" shape="pill">
                {isEditingProfile ? 'Cancelar' : 'Actualizar Perfil'}
              </Button>
            </div>
            
            <form onSubmit={handleProfileSubmit}>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className={inputClass}
                disabled={!isEditingProfile}
                required
              />
              
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className={inputClass}
                disabled={!isEditingProfile}
                required
              />

              {isEditingProfile && (
                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" color="#EAB308" shape="pill" textColor="#000000">
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden px-5 sm:px-8 pt-8 pb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Cambiar Contraseña</h2>
              <Button variant="outline" color="#EAB308" onClick={() => setIsEditingPassword(!isEditingPassword)} size="small" shape="pill">
                {isEditingPassword ? 'Cancelar' : 'Cambiar Contraseña'}
              </Button>
            </div>

            {isEditingPassword ? (
              <form onSubmit={handlePasswordSubmit}>
                <label className={labelClass}>Contraseña Actual</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={inputClass}
                  required
                />
                
                <label className={labelClass}>Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={inputClass}
                  required
                />
                
                <label className={labelClass}>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={inputClass}
                  required
                />

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" color="#EAB308" shape="pill" textColor="#000000">
                    Actualizar Contraseña
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-300 text-sm">Tu contraseña no se muestra por razones de seguridad. Haz clic en "Cambiar Contraseña" para establecer una nueva.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
