import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AppCalculadora from "./components/AppCalculadora";
import Logo from './assets/img/logo.svg';

function App() {
  return (
    <Router>
      {/* Favicon */}
      <link 
        rel="icon" 
        type="image/svg+xml" 
        href={Logo}
        style={{ filter: "invert(34%) sepia(93%) saturate(1055%) hue-rotate(42deg) brightness(93%) contrast(101%)" }} 
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculadora" element={<AppCalculadora />} />
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