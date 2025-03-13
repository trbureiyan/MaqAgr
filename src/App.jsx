import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AppCalculadora from "./components/AppCalculadora";
import DatosTractor from "./pages/DatosTractor";
import DatosLlantas from "./pages/DatosLlanta";
import DatosClimaticos from "./pages/DatosClimativos";
import Resultados from "./pages/Resultados";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculadora" element={<AppCalculadora />} />
            <Route path="/TengoTractor" element={<DatosTractor/>}/>
            <Route path="/DatosLlantas" element={<DatosLlantas/>}/>
            <Route path="/DatosClimaticos" element={<DatosClimaticos/>}/>
            <Route path="/Resultados" element={<Resultados/>}/>
            {/* ++++++ Rutas adicionales ++++++ */}
            {/* <Route path="/catalogo" element={<Catalogo />} /> */}
            {/* <Route path="/sobre-nosotro" element={<SobreNosotros />} /> */}
            {/* <Route path="/login" element={<Login />} /> */}
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>Copyright ©2025 xxxxxxxxxxxxxxxxx Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;