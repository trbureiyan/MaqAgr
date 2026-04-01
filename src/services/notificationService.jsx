/**
 * @fileoverview Servicio frontend para notificaciones globales usando Sileo.
 * 
 * Traslada la lógica semántica de notificaciones implementada en el backend 
 * (RECOMMENDATION, TRACTOR_AVAILABLE, SYSTEM).
 */

import React from 'react';
import { sileo } from 'sileo';
import { CheckCircle, AlertCircle, Bell, Tractor } from 'lucide-react';

export const NOTIFICATION_TYPES = {
  RECOMMENDATION: 'recommendation',
  TRACTOR_AVAILABLE: 'tractor_available',
  SYSTEM: 'system',
};

/**
 * Notificación de nueva recomendación disponible.
 * @param {string|number} recommendationId - ID de la recomendación
 */
export function notifyRecommendationCreated(recommendationId) {
  sileo.success("Nueva recomendación", {
    description: `Se generó una recomendación (Query ID: ${recommendationId})`,
    icon: <CheckCircle className="text-[#909d00] w-5 h-5" />
  });
}

/**
 * Notificación de que un tractor o equipo está disponible.
 * @param {string|number} tractorId - Identificador del equipo
 * @param {string} tractorName - Nombre/Modelo del equipo
 */
export function notifyTractorAvailable(tractorId, tractorName) {
  sileo.info("Tractor guardado con éxito", {
    description: `El tractor ${tractorName} ha sido registrado correctamente.`,
    icon: <Tractor className="text-[#893d46] w-5 h-5" />
  });
}

/**
 * Notificación de eventos globales del sistema.
 * @param {string} title - Título de la notificación
 * @param {string} message - Descripción / Mensaje
 */
export function notifySystemEvent(title, message) {
  sileo.info(title, {
    description: message,
    icon: <Bell className="text-[#893d46] w-5 h-5" />
  });
}

/**
 * Notificación de errores para feedback interactivo.
 * @param {string} title - Título del error
 * @param {string} message - Descripción
 */
export function notifyError(title, message) {
  sileo.error(title, {
    description: message,
    icon: <AlertCircle className="text-destructive w-5 h-5" />
  });
}

/**
 * Notificación de éxito genérica.
 * @param {string} title - Título de la alerta
 * @param {string} message - Descripción
 */
export function notifySuccess(title, message) {
  sileo.success(title, {
    description: message,
    icon: <CheckCircle className="text-[#909d00] w-5 h-5" />
  });
}
