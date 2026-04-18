import React from "react";
import Button from "../ui/buttons/Button";

/**
 * Componente Límite de Errores (Error Boundary) global.
 * Captura excepciones no manejadas en el árbol de renderizado, emitiendo una UI defensiva.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de repuesto.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes enviar el error a un servicio de reporte de errores
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
          <h2 className="text-3xl font-bold text-red-700 mb-4">Algo salió mal</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Ocurrió un error inesperado al procesar la interfaz. Por favor, intenta de nuevo o regresa al inicio.
          </p>
          <Button variant="primary" onClick={this.handleReset}>
            Regresar al inicio
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
