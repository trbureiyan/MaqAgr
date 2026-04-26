const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Sube una imagen al backend usando multipart/form-data.
 * 
 * ⚠️ IMPORTANTE: NO usar apiClient aquí porque setea Content-Type: application/json
 * automáticamente, lo que rompe el boundary de multipart/form-data que el browser
 * genera solo. Se usa fetch directamente.
 */
export const uploadImage = async (file, folder = 'general') => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const formData = new FormData();
  formData.append('image', file);   // campo 'image' — lo que espera Multer
  formData.append('folder', folder); // campo de texto

  // ⚠️ NO poner Content-Type aquí. El browser lo genera con el boundary correcto.
  const response = await fetch(`${API_URL.replace(/\/$/, '')}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al subir la imagen');
  }

  return data;
};

/**
 * Elimina una imagen del almacenamiento por su URL.
 */
export const deleteImage = async (url) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const response = await fetch(`${API_URL.replace(/\/$/, '')}/api/upload`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar la imagen');
  }

  return data;
};

