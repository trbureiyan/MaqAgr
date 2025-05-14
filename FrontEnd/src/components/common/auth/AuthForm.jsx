import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '.';
import backgroundImage from '../../../assets/img/fondo.jpg';
import Button from '../../ui/buttons/Button';

const AuthForm = ({ formType }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Estado centralizado para todos los campos del formulario
  // El valor inicial incluye campos para ambos tipos de formulario (login y registro)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    userType: 'normal' // Valor por defecto para el tipo de usuario
  });

  // Función para manejar cambios en cualquier campo del formulario
  // Utiliza la desestructuración para extraer propiedades del evento
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualiza solo el campo específico que cambió, manteniendo los demás valores
    setFormData(prev => ({
      ...prev,  // Spread operator mantiene los valores anteriores
      [name]: value  // Sintaxis de propiedad computada para actualizar campo dinámicamente
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();  // Evita que la página se recargue al enviar el formulario
    
    // Se implemente una logica breve de autenticacion para consola CRUD admin
    
    if (formType === 'login') {
      // Llamamos a la función login del contexto con los datos del usuario
      login({
        email: formData.email,
        name: formData.email.split('@')[0]
      });
      
      // Redirigir a la página principal después del login
      navigate('/');
    } else {
      // Para registro, podríamos hacer algo diferente
      // Por ahora, en debug salta alerta:
      alert('Registro exitoso. Por favor inicie sesión.');
      navigate('/login');
    }
  };

  return (
    // Contenedor principal con imagen de fondo y overlay oscuro
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-85 bg-blend-overlay bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full py-8 px-4 sm:px-6 lg:py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Tarjeta del formulario con esquinas redondeadas */}
          <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-4 sm:px-8 pt-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título dinámico basado en el tipo de formulario */}
                <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
                  {formType === 'login' ? 'LOGIN' : 'REGISTRO'}
                </h2>
                
                {/* Campo de nombre - solo visible en modo registro */}
                {formType === 'register' && (
                  <div>
                    <label htmlFor="name" className="block text-white font-bold mb-2 text-sm sm:text-base">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Digite su nombre"
                      className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base"
                      required
                    />
                  </div>
                )}
                
                {/* Campo de email - presente en ambos tipos de formulario */}
                <div>
                  <label htmlFor="email" className="block text-white font-bold mb-2 text-sm sm:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite un email valido"
                    className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base"
                    required
                  />
                </div>
                
                {/* Campo de contraseña - presente en ambos tipos de formulario */}
                <div>
                  <label htmlFor="password" className="block text-white font-bold mb-2 text-sm sm:text-base">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    // Placeholder dinámico según el tipo de formulario
                    placeholder={formType === 'login' ? "Digita tu contraseña" : "Digita una contraseña segura"}
                    className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base"
                    required
                  />
                </div>
                
                {/* Campos adicionales solo para registro */}
                {formType === 'register' && (
                  <>
                    {/* Campo de confirmación de contraseña */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-white font-bold mb-2 text-sm sm:text-base">
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Digita otra vez la contraseña"
                        className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base"
                        required
                      />
                    </div>
                    
                    {/* Selección de tipo de usuario con radio buttons */}
                    <div className="mt-4">
                      {/* Layout responsivo: vertical en móvil, horizontal en pantallas más grandes */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        {/* Opción de usuario normal */}
                        <div className="flex items-center">
                          <input
                            id="normal"
                            name="userType"
                            type="radio"
                            value="normal"
                            checked={formData.userType === 'normal'}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-500 focus:ring-yellow-400"
                          />
                          <label htmlFor="normal" className="ml-2 block text-white text-sm sm:text-base">
                            Usuario Normal
                          </label>
                        </div>
                        {/* Opción de usuario educador */}
                        <div className="flex items-center">
                          <input
                            id="educator"
                            name="userType"
                            type="radio"
                            value="educator"
                            checked={formData.userType === 'educator'}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-500 focus:ring-yellow-400"
                          />
                          <label htmlFor="educator" className="ml-2 block text-white text-sm sm:text-base">
                            Usuario Educador
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Enlace para ir a registro - solo visible en modo login */}
                {formType === 'login' && (
                  <div className="text-center">
                    <a href="/Registro" className="text-white hover:text-yellow-200 text-sm sm:text-base">
                      ¿Aun no estas registrado? Registrate aquí
                    </a>
                  </div>
                )}
                
                {/* Botón de envío */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    color="#EAB308"
                    fullWidth
                    size="large"
                    shape="pill"
                    textColor="#000000"
                  >
                    {formType === 'login' ? 'Enviar' : 'Enviar'}
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