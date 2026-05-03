import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ReservaCard from "./ReservaCard";
import ReservaDetail from "./ReservaDetail";
import {
  getReservas, cambiarEstadoReserva, getTiposHabitacion, crearHabitacion, getHabitacionesPorTipo, actualizarPrecioTipoHabitacion,
  cambiarTipoHabitacion, getTiposSala, crearSala, getSalasPorTipo, actualizarPrecioTipoSala, cambiarTipoSala,
} from '../../api/adminApi';
import "../../styles/admin.css";

const AdminDashboard = ({ onLogout = () => { } }) => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [nuevoNumeroHabitacion, setNuevoNumeroHabitacion] = useState("");
  const [tipoHabitacionParaNueva, setTipoHabitacionParaNueva] = useState("");
  const [mensajeCrearHab, setMensajeCrearHab] = useState("");
  const [errorCrearHab, setErrorCrearHab] = useState("");
  const handleLogoutClick = () => { onLogout(); navigate("/login-administracion"); };
  const [tipoSeleccionadoId, setTipoSeleccionadoId] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [habitacionesDelTipo, setHabitacionesDelTipo] = useState([]);
  const [precioEditado, setPrecioEditado] = useState("");
  const [tipoSeleccionadoPorHabitacion, setTipoSeleccionadoPorHabitacion] = useState({});
  const [mensajeTipoHab, setMensajeTipoHab] = useState("");
  const [errorTipoHab, setErrorTipoHab] = useState("");
  const [tiposSala, setTiposSala] = useState([]);
  const [tipoSalaSeleccionadoId, setTipoSalaSeleccionadoId] = useState("");
  const [tipoSalaSeleccionado, setTipoSalaSeleccionado] = useState(null);
  const [salasDelTipo, setSalasDelTipo] = useState([]);
  const [precioSalaEditado, setPrecioSalaEditado] = useState("");
  const [tipoSeleccionadoPorSala, setTipoSeleccionadoPorSala] = useState({});
  const [mensajeTipoSala, setMensajeTipoSala] = useState("");
  const [errorTipoSala, setErrorTipoSala] = useState("");
  const [nuevoNumeroSala, setNuevoNumeroSala] = useState("");
  const [tipoSalaParaNueva, setTipoSalaParaNueva] = useState("");
  const [mensajeCrearSala, setMensajeCrearSala] = useState("");
  const [errorCrearSala, setErrorCrearSala] = useState("");
  const [seccionActiva, setSeccionActiva] = useState("reservas");
  useEffect(() => {
    cargarReservas();
  }, [filtroEstado]);

  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const data = await getTiposHabitacion();
        setTiposHabitacion(data);
      } catch (err) {
        console.error("Error al cargar tipos de habitación:", err);
      }
    };

    cargarTipos();
  }, []);

  useEffect(() => {
    const cargarTiposSala = async () => {
      try {
        const data = await getTiposSala();
        setTiposSala(data);
      } catch (err) {
        console.error("Error al cargar tipos de sala:", err);
      }
    };

    cargarTiposSala();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const response = await getReservas(filtroEstado);

      console.log('=== DEPURACIÓN ===');
      console.log('1. Response completo:', response);
      console.log('2. Tipo de response:', typeof response);
      console.log('3. ¿Es array?:', Array.isArray(response));
      console.log('4. response.reservas:', response.reservas);
      console.log('5. response.results:', response.results);
      console.log('6. Keys de response:', Object.keys(response));
      console.log('==================');

      if (Array.isArray(response)) {
        setReservas(response);
      } else if (response.reservas) {
        setReservas(response.reservas);
      } else if (response.results) {
        setReservas(response.results);
      } else {
        console.error('Formato no reconocido:', response);
        setReservas([]);
      }
    } catch (error) {
      console.error('Error al cargar:', error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirDetalle = (reserva) => {
    setReservaSeleccionada(reserva);
    setShowModal(true);
  };

  const cerrarDetalle = () => {
    setShowModal(false);
    setReservaSeleccionada(null);
  };

  const handleCrearHabitacion = async (e) => {
    e.preventDefault();
    setMensajeCrearHab("");
    setErrorCrearHab("");

    if (!nuevoNumeroHabitacion || !tipoHabitacionParaNueva) {
      setErrorCrearHab("Indica número de habitación y tipo.");
      return;
    }

    try {
      await crearHabitacion(
        Number(nuevoNumeroHabitacion),
        Number(tipoHabitacionParaNueva)
      );

      setMensajeCrearHab("Habitación creada correctamente.");
      setNuevoNumeroHabitacion("");
      setTipoHabitacionParaNueva("");
    } catch (err) {
      console.error("Error al crear habitación:", err);
      const detalle =
        err.response?.data?.detail ||
        err.response?.data?.numero?.[0] ||
        "Error al crear habitación. Revisa que el número no esté repetido.";
      setErrorCrearHab(detalle);
    }
  };

  const handleSeleccionTipo = async (tipoId) => {
    setTipoSeleccionadoId(tipoId);
    setMensajeTipoHab("");
    setErrorTipoHab("");

    if (!tipoId) {
      setTipoSeleccionado(null);
      setHabitacionesDelTipo([]);
      setPrecioEditado("");
      setTipoSeleccionadoPorHabitacion({});
      return;
    }

    const tipo = tiposHabitacion.find((t) => String(t.id) === String(tipoId));
    setTipoSeleccionado(tipo || null);
    setPrecioEditado(tipo ? String(tipo.precio) : "");

    try {
      const habs = await getHabitacionesPorTipo(tipoId);
      setHabitacionesDelTipo(habs);

      // inicializamos el valor del select por habitación
      const mapa = {};
      habs.forEach((h) => {
        mapa[h.id] = String(tipoId);
      });
      setTipoSeleccionadoPorHabitacion(mapa);
    } catch (err) {
      console.error("Error al cargar habitaciones por tipo:", err);
      setHabitacionesDelTipo([]);
      setTipoSeleccionadoPorHabitacion({});
      setErrorTipoHab("No se pudieron cargar las habitaciones de este tipo.");
    }
  };

  const handleGuardarPrecioTipo = async () => {
    if (!tipoSeleccionadoId) return;

    setMensajeTipoHab("");
    setErrorTipoHab("");

    try {
      await actualizarPrecioTipoHabitacion(tipoSeleccionadoId, precioEditado);
      setMensajeTipoHab("Precio del tipo actualizado correctamente.");
      setTiposHabitacion((prev) =>
        prev.map((t) =>
          String(t.id) === String(tipoSeleccionadoId)
            ? { ...t, precio: precioEditado }
            : t
        )
      );
    } catch (err) {
      console.error("Error al actualizar precio de tipo:", err);
      setErrorTipoHab("No se pudo actualizar el precio de este tipo.");
    }
  };

  const handleCambiarTipoDeHabitacion = async (habitacionId) => {
    const nuevoTipoId = tipoSeleccionadoPorHabitacion[habitacionId];
    if (!nuevoTipoId) return;

    setMensajeTipoHab("");
    setErrorTipoHab("");

    try {
      await cambiarTipoHabitacion(habitacionId, nuevoTipoId);
      setHabitacionesDelTipo((prev) =>
        prev.filter((h) => h.id !== habitacionId)
      );

      setMensajeTipoHab("Tipo de la habitación actualizado.");
    } catch (err) {
      console.error("Error al cambiar tipo de habitación:", err);
      setErrorTipoHab("No se pudo cambiar el tipo de esta habitación.");
    }
  };

  //SALAS

  const handleCrearSala = async (e) => {
    e.preventDefault();
    setMensajeCrearSala("");
    setErrorCrearSala("");

    if (!nuevoNumeroSala || !tipoSalaParaNueva) {
      setErrorCrearSala("Indica número de sala y tipo.");
      return;
    }

    try {
      await crearSala(
        Number(nuevoNumeroSala),
        Number(tipoSalaParaNueva)
      );

      setMensajeCrearSala("Sala creada correctamente.");
      setNuevoNumeroSala("");
      setTipoSalaParaNueva("");

    } catch (err) {
      console.error("Error al crear sala:", err);

      const detalle =
        err.response?.data?.detail ||
        err.response?.data?.numero?.[0] ||
        "Error al crear sala. Revisa que el número no esté repetido.";

      setErrorCrearSala(detalle);
    }
  };
  const handleSeleccionTipoSala = async (tipoId) => {
    setTipoSalaSeleccionadoId(tipoId);
    setMensajeTipoSala("");
    setErrorTipoSala("");

    if (!tipoId) {
      setTipoSalaSeleccionado(null);
      setSalasDelTipo([]);
      setPrecioSalaEditado("");
      setTipoSeleccionadoPorSala({});
      return;
    }

    const tipo = tiposSala.find((t) => String(t.id) === String(tipoId));
    setTipoSalaSeleccionado(tipo || null);
    setPrecioSalaEditado(tipo ? String(tipo.precio) : "");

    try {
      const salas = await getSalasPorTipo(tipoId);
      setSalasDelTipo(salas);

      const mapa = {};
      salas.forEach((s) => {
        mapa[s.id] = String(tipoId);
      });
      setTipoSeleccionadoPorSala(mapa);
    } catch (err) {
      console.error("Error al cargar salas:", err);
      setSalasDelTipo([]);
      setTipoSeleccionadoPorSala({});
      setErrorTipoSala("No se pudieron cargar las salas.");
    }
  };
  const handleGuardarPrecioTipoSala = async () => {
    if (!tipoSalaSeleccionadoId) return;

    setMensajeTipoSala("");
    setErrorTipoSala("");

    try {
      await actualizarPrecioTipoSala(
        tipoSalaSeleccionadoId,
        precioSalaEditado
      );

      setMensajeTipoSala("Precio actualizado correctamente.");

      setTiposSala((prev) =>
        prev.map((t) =>
          String(t.id) === String(tipoSalaSeleccionadoId)
            ? { ...t, precio: precioSalaEditado }
            : t
        )
      );
    } catch (err) {
      console.error("Error actualizando precio sala:", err);
      setErrorTipoSala("No se pudo actualizar el precio.");
    }
  };

  const handleCambiarTipoDeSala = async (salaId) => {
    const nuevoTipoId = tipoSeleccionadoPorSala[salaId];
    if (!nuevoTipoId) return;

    setMensajeTipoSala("");
    setErrorTipoSala("");

    try {
      await cambiarTipoSala(salaId, nuevoTipoId);

      setSalasDelTipo((prev) =>
        prev.filter((s) => s.id !== salaId)
      );

      setMensajeTipoSala("Tipo de la sala actualizado.");
    } catch (err) {
      console.error("Error cambiando tipo de sala:", err);
      setErrorTipoSala("No se pudo cambiar el tipo.");
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoReserva(id, nuevoEstado);
      await cargarReservas();
      cerrarDetalle();
    } catch (error) {
      console.error(' Error al cambiar estado:', error);
      alert('Error al cambiar el estado de la reserva');
    }
  };

  return (
    <main className="admin-dashboard">
      <h1 className="admin-title">Panel de Administración HESTIA</h1>

      {/* 🔥 TABS */}
      <div className="admin-tabs">
        <button
          className={seccionActiva === "reservas" ? "active" : ""}
          onClick={() => setSeccionActiva("reservas")}
        >
          Reservas
        </button>

        <button
          className={seccionActiva === "habitaciones" ? "active" : ""}
          onClick={() => setSeccionActiva("habitaciones")}
        >
          Habitaciones
        </button>

        <button
          className={seccionActiva === "salas" ? "active" : ""}
          onClick={() => setSeccionActiva("salas")}
        >
          Salas
        </button>

        <button
          type="button"
          className="admin-filter-btn admin-logout-btn"
          onClick={handleLogoutClick}
        >
          Cerrar sesión
        </button>
      </div>

      {/* ===================== RESERVAS ===================== */}
      {seccionActiva === "reservas" && (
        <>
          <div className="admin-filters">
            <button
              className={`admin-filter-btn ${!filtroEstado ? "active" : ""}`}
              onClick={() => setFiltroEstado(null)}
            >
              Todas
            </button>
            <button
              className={`admin-filter-btn ${filtroEstado === "PENDIENTE" ? "active" : ""
                }`}
              onClick={() => setFiltroEstado("PENDIENTE")}
            >
              Pendientes
            </button>
            <button
              className={`admin-filter-btn ${filtroEstado === "CONFIRMADA" ? "active" : ""
                }`}
              onClick={() => setFiltroEstado("CONFIRMADA")}
            >
              Confirmadas
            </button>
            <button
              className={`admin-filter-btn ${filtroEstado === "CANCELADA" ? "active" : ""
                }`}
              onClick={() => setFiltroEstado("CANCELADA")}
            >
              Canceladas
            </button>
          </div>

          {loading ? (
            <div className="admin-loading">Cargando reservas...</div>
          ) : reservas.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📭</div>
              No hay reservas para mostrar
            </div>
          ) : (
            <div className="admin-reservas-grid">
              {reservas.map((reserva) => (
                <ReservaCard
                  key={reserva.id}
                  reserva={reserva}
                  onClick={() => abrirDetalle(reserva)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ===================== HABITACIONES ===================== */}
      {seccionActiva === "habitaciones" && (
        <>
          {/* CREAR */}
          <section className="admin-gestion-habitaciones">
            <h2 className="admin-section-title">Gestión de habitaciones</h2>

            {mensajeCrearHab && (
              <div className="admin-alert admin-alert-success">
                {mensajeCrearHab}
              </div>
            )}
            {errorCrearHab && (
              <div className="admin-alert admin-alert-error">
                {errorCrearHab}
              </div>
            )}

            <div className="admin-gestion-grid">
              <div className="admin-gestion-card">
                <h3>Crear nueva habitación</h3>

                <form onSubmit={handleCrearHabitacion} className="admin-form">
                  <input
                    type="number"
                    value={nuevoNumeroHabitacion}
                    onChange={(e) =>
                      setNuevoNumeroHabitacion(e.target.value)
                    }
                    placeholder="Número"
                  />

                  <select
                    value={tipoHabitacionParaNueva}
                    onChange={(e) =>
                      setTipoHabitacionParaNueva(e.target.value)
                    }
                  >
                    <option value="">Selecciona un tipo</option>
                    {tiposHabitacion.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>

                  <button type="submit">Guardar habitación</button>
                </form>
              </div>
            </div>
          </section>

          {/* EDITAR */}
          <section className="admin-gestion-habitaciones">
            <div className="admin-gestion-card">
              <h3>Editar tipos y reasignar habitaciones</h3>

              <select
                value={tipoSeleccionadoId}
                onChange={(e) => handleSeleccionTipo(e.target.value)}
              >
                <option value="">Selecciona un tipo</option>
                {tiposHabitacion.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>

              {tipoSeleccionado && (
                <>
                  <input
                    type="number"
                    value={precioEditado}
                    onChange={(e) => setPrecioEditado(e.target.value)}
                  />

                  <button onClick={handleGuardarPrecioTipo}>
                    Guardar precio
                  </button>

                  {habitacionesDelTipo.map((h) => (
                    <div key={h.id}>
                      Hab {h.numero}
                      <select
                        value={tipoSeleccionadoPorHabitacion[h.id]}
                        onChange={(e) =>
                          setTipoSeleccionadoPorHabitacion((prev) => ({
                            ...prev,
                            [h.id]: e.target.value,
                          }))
                        }
                      >
                        {tiposHabitacion.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          handleCambiarTipoDeHabitacion(h.id)
                        }
                      >
                        Guardar
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </>
      )}

      {/* ===================== SALAS ===================== */}
      {seccionActiva === "salas" && (
        <>
          {/* CREAR */}
          <section className="admin-gestion-habitaciones">
            <h2>Gestión de salas</h2>

            <form onSubmit={handleCrearSala}>
              <input
                type="number"
                value={nuevoNumeroSala}
                onChange={(e) => setNuevoNumeroSala(e.target.value)}
              />

              <select
                value={tipoSalaParaNueva}
                onChange={(e) => setTipoSalaParaNueva(e.target.value)}
              >
                <option value="">Selecciona un tipo</option>
                {tiposSala.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>

              <button type="submit">Guardar sala</button>
            </form>
          </section>

          {/* EDITAR */}
          <section className="admin-gestion-habitaciones">
            <div className="admin-gestion-card">
              <h3>Editar tipos y reasignar salas</h3>

              <select
                value={tipoSalaSeleccionadoId}
                onChange={(e) =>
                  handleSeleccionTipoSala(e.target.value)
                }
              >
                <option value="">Selecciona un tipo</option>
                {tiposSala.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>

              {tipoSalaSeleccionado && (
                <>
                  <input
                    type="number"
                    value={precioSalaEditado}
                    onChange={(e) =>
                      setPrecioSalaEditado(e.target.value)
                    }
                  />

                  <button onClick={handleGuardarPrecioTipoSala}>
                    Guardar precio
                  </button>

                  {salasDelTipo.map((s) => (
                    <div key={s.id}>
                      Sala {s.numero}

                      <select
                        value={tipoSeleccionadoPorSala[s.id]}
                        onChange={(e) =>
                          setTipoSeleccionadoPorSala((prev) => ({
                            ...prev,
                            [s.id]: e.target.value,
                          }))
                        }
                      >
                        {tiposSala.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          handleCambiarTipoDeSala(s.id)
                        }
                      >
                        Guardar
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </>
      )}

      {/* MODAL */}
      {showModal && reservaSeleccionada && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <ReservaDetail
              reserva={reservaSeleccionada}
              onClose={cerrarDetalle}
              onCambiarEstado={handleCambiarEstado}
            />
          </div>
        </div>
      )}
    </main>
  );
 };

export default AdminDashboard;