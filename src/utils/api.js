// src/utils/api.js

import axiosInstance from '@/axios'; // Asumiendo que tienes una instancia de axios configurada
export async function handleRequest({ endpoint, method = 'GET', data = null, params = null, includeToken = true }) {
  try {
    const config = {
      method: method.toUpperCase(),
      url: endpoint,
      ...(data && { data }),
      ...(params && { params }),
      includeToken
    };

    const response = await axiosInstance(config);
    
    // Éxito: 2xx
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: response.data?.message || response.data?.msg,
        data: response.data
      };
    }

    // Caso 204 (No Content) – opcional
    if (response.status === 204) {
      return { success: true, data: null };
    }

  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      // Helper para extraer mensaje
      const getMessage = (d) => d?.message || d?.msg || 'Error desconocido';

      switch (status) {
        case 400:
          if (data?.errors) {
            const validationErrors = Object.values(data.errors).flat();
            return { success: false, message: `Errores de validación: ${validationErrors.join(', ')}` };
          }
          return { success: false, message: getMessage(data) };

        case 401:
          return { success: false, message: "Acceso no autorizado. Por favor, inicie sesión nuevamente." };

        case 404:
          // ✅ Manejo específico para 404 con mensaje del backend
          return { success: false, message: getMessage(data) };

        case 500:
          return { success: false, message: getMessage(data) };

        default:
          return { success: false, message: `Error (${status}): ${getMessage(data)}` };
      }
    } else if (error.request) {
      return { success: false, message: "No se recibió respuesta del servidor. Verifique su conexión." };
    } else {
      return { success: false, message: "Error al configurar la solicitud." };
    }
  }

  // En caso de que no haya error pero tampoco sea 2xx (poco probable)
  return { success: false, message: "Respuesta inesperada del servidor." };
}
