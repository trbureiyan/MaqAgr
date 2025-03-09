import React from "react";

const Home = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Bienvenido 🚀</h1>
            <p className="text-gray-700 text-lg mb-6">
              Este es el inicio de la aplicación. Explora y diviértete. lol
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105 hover:bg-blue-700">
              Empezar
            </button>
          </div>
        </div>
    );
};

export default Home;
