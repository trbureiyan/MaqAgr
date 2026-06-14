import React from 'react';

// Tractor
export const TractorIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 18h18" />
    <path d="M5 18v-4h4" />
    <path d="M9 14l2-4h5l1 4" />
    <path d="M16 14h2l1 4" />
    <circle cx="8" cy="18" r="3" />
    <circle cx="17" cy="18" r="2" />
    <path d="M11 10v-3h2v3" />
    <path d="M7 14h2" />
  </svg>
);

// Implemento (arado/rastra simulado)
export const ImplementIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 8h18" />
    <path d="M3 10V6h18v4" />
    <path d="M5 10l-1 6q-1 3 2 4" />
    <path d="M11 10l-1 6q-1 3 2 4" />
    <path d="M17 10l-1 6q-1 3 2 4" />
    <path d="M21 10v5" />
    <circle cx="21" cy="17" r="2" />
  </svg>
);

// Busco Equipo (campo con lupa/análisis)
export const SearchEquipIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 14h18" />
    <path d="M4 18h16" />
    <path d="M5 22h14" />
    <path d="M12 14v4" />
    <path d="M8 14v4" />
    <path d="M16 14v4" />
    {/* Magnifying Glass */}
    <circle cx="12" cy="7" r="4" />
    <path d="M14.8 9.8L18 13" />
  </svg>
);
