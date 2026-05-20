import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { sileo } from 'sileo';
import backgroundImage from '@/assets/background/sage-green-3d-podium-shadow-play-crazy-motions.webp';

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
    } catch {
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
    } catch {
      sileo.error('Error al actualizar contraseña');
    }
  };

  const inputClass = 'w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors mb-4';
  const labelClass = 'block text-sm font-medium leading-none text-foreground mb-1.5';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat w-full relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-foreground/50" />

      <div className="w-full py-8 px-4 sm:px-6 lg:py-12 relative z-10">
        <div className="w-full max-w-2xl mx-auto space-y-8 mt-12 sm:mt-0">
          {/* Profile Card */}
          <div className="bg-card/95 backdrop-blur-sm border border-border/40 rounded-md overflow-hidden px-5 sm:px-8 pt-8 pb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Mi Perfil</h2>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-sm font-semibold px-4 py-1.5 rounded-md border border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                {isEditingProfile ? 'Cancelar' : 'Actualizar Perfil'}
              </button>
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
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Password Card */}
          <div className="bg-card/95 backdrop-blur-sm border border-border/40 rounded-md overflow-hidden px-5 sm:px-8 pt-8 pb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Cambiar Contraseña</h2>
              <button
                type="button"
                onClick={() => setIsEditingPassword(!isEditingPassword)}
                className="text-sm font-semibold px-4 py-1.5 rounded-md border border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                {isEditingPassword ? 'Cancelar' : 'Cambiar Contraseña'}
              </button>
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
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-muted-foreground text-sm">Tu contraseña no se muestra por razones de seguridad. Haz clic en "Cambiar Contraseña" para establecer una nueva.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
