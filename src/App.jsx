import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Logo from './assets/img/logo1.svg';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AppCalculadora from "./components/AppCalculadora";
import DatosTractor from "./pages/DatosTractor";
import DatosLlantas from "./pages/DatosLlanta";
import DatosClimaticos from "./pages/DatosClimativos";
import Resultados from "./pages/Resultados";

function App() {
  return (
    <Router>
      {/* Favicon */}
      <link 
        rel="icon" 
        type="image/svg+xml" 
        href={Logo} 
      />
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;