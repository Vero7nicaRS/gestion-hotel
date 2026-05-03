import axios from 'axios';

const API_URL = "http://localhost:8000/api/admin";
const API_BASE_URL = "http://localhost:8000/api";


export const getTiposHabitacion = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tipos-habitacion/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener tipos de habitación:", error);
    throw error;
  }
};

export const crearHabitacion = async (numero, tipoHabitacionId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/habitaciones/`, {
      numero,
      tipo_habitacion_id: tipoHabitacionId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear habitación:", error);
    throw error;
  }
};

// Habitaciones filtradas por tipo 
export const getHabitacionesPorTipo = async (tipoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/habitaciones/`, {
      params: { tipo_habitacion: tipoId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener habitaciones por tipo:", error);
    throw error;
  }
};

// Actualizar precio del tipo de habitación
export const actualizarPrecioTipoHabitacion = async (tipoId, nuevoPrecio) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/tipos-habitacion/${tipoId}/`,
      { precio: nuevoPrecio }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar precio de tipo de habitación:", error);
    throw error;
  }
};

// Cambiar el tipo de una habitación concreta
export const cambiarTipoHabitacion = async (habitacionId, nuevoTipoId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/habitaciones/${habitacionId}/`,
      { tipo_habitacion_id: nuevoTipoId }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el tipo de la habitación:", error);
    throw error;
  }
};

export const getReservas = async (estado = null) => {
  try {
    const url = estado ? `${API_URL}/reservas/?estado=${estado}` : `${API_URL}/reservas/`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const getReservaDetalle = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/reservas/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    throw error;
  }
};

export const cambiarEstadoReserva = async (id, estado) => {
  try {
    const response = await axios.patch(`${API_URL}/reservas/${id}/estado/`, {
      estado: estado
    });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    throw error;
  }
};
// SALAS (panel admin) 

export const getTiposSala = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tipo-salas/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener tipos de sala:", error);
    throw error;
  }
};

export const crearSala = async (numero, tipoSalaId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/salas/`, {
      numero,
      tipo_sala_id: tipoSalaId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear sala:", error);
    throw error;
  }
};

export const getSalasPorTipo = async (tipoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/salas/`, {
      params: { tipo_sala: tipoId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener salas por tipo:", error);
    throw error;
  }
};

export const actualizarPrecioTipoSala = async (tipoId, nuevoPrecio) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/tipo-salas/${tipoId}/`,
      { precio: nuevoPrecio }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar precio del tipo de sala:", error);
    throw error;
  }
};

export const cambiarTipoSala = async (salaId, nuevoTipoId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/salas/${salaId}/`,
      { tipo_sala_id: nuevoTipoId }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el tipo de la sala:", error);
    throw error;
  }
};