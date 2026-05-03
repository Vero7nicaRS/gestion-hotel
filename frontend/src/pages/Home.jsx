import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import inicio from "../assets/1-inicio.jpg";
import "../styles/Home.css";
import sencilla from "../assets/Sencilla-habitacion.jpg";
import doble from "../assets/Doble-habitacion.avif";
import premium from "../assets/Premium-habitacion.jpg";
import pro from "../assets/Sala-pro-1.jpg";
import eco from "../assets/Sala-eco-1.jpg";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [salas, setSalas] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resHab, resSal] = await Promise.all([
          fetch(`${API_BASE}/api/tipos-habitacion/`),
          fetch(`${API_BASE}/api/tipo-salas/`)
        ]);
        const habData = await resHab.json();
        const salData = await resSal.json();
        setHabitaciones(habData);
        setSalas(salData);
      } catch (err) {
        console.error("Error cargando home:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="contenedor">
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: `url(${inicio})` }}>
        <div className="hero-text">
          <h1>Bienvenido a <br /> Hestia Hotel</h1>
          <p>Disfruta de una experiencia única con nuestras habitaciones.</p>
        </div>
      </section>
      {/* HABITACIONES */}
      <section className="card-habitaciones">
        <h2>Reserve su habitación</h2>
        <div className="cardsHabitaciones">
          {habitaciones.map((habitacion) => {
            const imagen =
              habitacion.nombre?.toLowerCase().includes("sencilla")
                ? sencilla
                : habitacion.nombre?.toLowerCase().includes("premium")
                ? premium
                : doble;
            return (
              <div className="cardHabitacion" key={habitacion.id}>
                <img src={imagen} alt={habitacion.nombre} />
                <h3>{habitacion.nombre}</h3>
                <p>{habitacion.descripcion}</p>
                <Link
                  to={`/tipo-habitacion/${habitacion.id}`}
                  className="btn-card-habitacion"
                >
                  Ver más
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      {/* SALAS */}
      <section className="card-salas">
        <h2>Reserve su sala de eventos</h2>
        <div className="cardsSala">
          {salas.map((sala) => {
            const imagen =
              sala.nombre?.toLowerCase().includes("eco") ? eco : pro;
            return (
              <div className="cardSala" key={sala.id}>
                <img src={imagen} alt={sala.nombre} />
                <div className="cardSalaTexto">
                  <h3>{sala.nombre}</h3>
                  <p>Sala para eventos y celebraciones</p>
                </div>
                <Link
                  to={`/tipo-sala/${sala.id}`}
                  className="btn-card-salas"
                >
                  Ver más
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}