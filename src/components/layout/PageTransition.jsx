import { motion } from 'motion/react';

/**
 * PageTransition — Envoltorio premium para transiciones de página dinámicas.
 *
 * Utiliza resortes (spring) físicos optimizados para crear transiciones
 * fluidas, orgánicas y rápidas entre vistas principales.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la página.
 */
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.995 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 22,
      }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
