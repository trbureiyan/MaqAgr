import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Icon from './assets/svg/logo1.svg';
import { Navbar, Footer } from "./components/layout"; // Index.js
import Home from "./pages/Home";
import AppCalculadora from "./components/AppCalculadora";
import DatosTractor from "./pages/DatosTractor";
import DatosLlantas from "./pages/DatosLlanta";
import DatosClimaticos from "./pages/DatosClimaticos";
import Resultados from "./pages/Resultados";
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogo from "./pages/Catalogo";
import CatalogoTrac from "./pages/CatalogoTractores";
import CatalogoMaq from "./pages/CatalogoMaquinas";

function App() {
  return (
    <Router>
      {/* Favicon */}
      <link 
        rel="icon" 
        type="image/svg+xml" 
        href={Icon} 
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Calculadora" element={<AppCalculadora />} />
            <Route path="/TengoTractor" element={<DatosTractor/>}/>
            <Route path="/DatosLlantas" element={<DatosLlantas/>}/>
            <Route path="/DatosClimaticos" element={<DatosClimaticos/>}/>
            <Route path="/Resultados" element={<Resultados/>}/>
            <Route path="/Login" element={<Login />} />
            <Route path="/Registro" element={<Register />} />
            <Route path="/Catalogo" element={<Catalogo />} />
            <Route path="/CatalogoTractor" element={<CatalogoTrac />} />
            <Route path="/CatalogoMaquinas" element={<CatalogoMaq />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;