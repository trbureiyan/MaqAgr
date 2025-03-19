import React, { useState } from 'react';
import backgroundImage from '../assets/img/fondo.jpg';

const AuthForm = ({ formType }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    userType: 'normal'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica de autenticación
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-85 bg-blend-overlay bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full py-8 px-4 sm:px-6 lg:py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-4 sm:px-8 pt-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
                  {formType === 'login' ? 'LOGIN' : 'REGISTRO'}
                </h2>
                
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
                    placeholder={formType === 'login' ? "Digita tu contraseña" : "Digita una contraseña segura"}
                    className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-white bg-transparent text-white placeholder-gray-400 px-0 py-2 focus:ring-0 focus:border-yellow-400 text-sm sm:text-base"
                    required
                  />
                </div>
                
                {formType === 'register' && (
                  <>
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
                    
                    <div className="mt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
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
                
                {formType === 'login' && (
                  <div className="text-center">
                    <a href="/registro" className="text-white hover:text-yellow-200 text-sm sm:text-base">
                      ¿Aun no estas registrado? Registrate aquí
                    </a>
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 sm:py-3 px-4 rounded-full uppercase text-sm sm:text-base"
                  >
                    {formType === 'login' ? 'Enviar' : 'Enviar'}
                  </button>
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