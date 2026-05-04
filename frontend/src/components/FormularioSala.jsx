import { useState, useEffect } from "react";
import "../styles/Formulario.css";
import { API_BASE_URL } from "../api/api";

export default function FormularioSala({tipoSala, salaId}) {

  const [salas, setSalas] = useState([]);

  console.log("Tipo Sala: ", tipoSala, " Numero de la sala: ", salaId)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sala: "",
    numero_personas: 1,
    fecha_uso: "",
    jornada: "",
    hora_inicio: "",
    hora_fin: ""
  });

  const horariosManana = [8,9,10,11];
  const horariosTarde = [14,15,16,17,18];

  // Fecha mínima y máxima
  const hoy = new Date();
  const fechaMin = hoy.toISOString().split("T")[0];

  const tresMeses = new Date();
  tresMeses.setMonth(tresMeses.getMonth()+3);
  const fechaMax = tresMeses.toISOString().split("T")[0];

  const [mensaje, setMensaje] = useState("");
  //filtro para saber cual información mostrar segun el tipo de sala, salas no siempre es array por eso
  //se crea const salasArray
  const salasArray = Array.isArray(salas) ? salas : [];

const esLaSalaSeleccionada = (s) =>
  salaId && s.id.toString() === salaId.toString();

const salasFiltradas = tipoSala
  ? salasArray.filter(
      (s) =>
        (s.estado === "DISPONIBLE" || esLaSalaSeleccionada(s)) &&
        s.tipo_sala?.nombre?.toLowerCase() === tipoSala?.toLowerCase()
    )
  : salasArray.filter((s) => s.estado === "DISPONIBLE" || esLaSalaSeleccionada(s));

  // Obtener salas disponibles
  useEffect(() => {
    fetch(`${API_BASE_URL}/salas/`)
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.results || []);
        setSalas(arr);
      })
      .catch(err => console.error(err));
  }, []);

  // change controlado + reset jornada
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
        if (name === "jornada") {
          updated.hora_inicio = "";
          updated.hora_fin = "";
        }
        return updated;
      });
    };
  // horarios según jornada
  const horariosDisponibles =
    formData.jornada === "manana"
      ? horariosManana
      : horariosTarde;
  // solo horas válidas para fin
  const horariosFin = horariosDisponibles.filter(
    (h) => Number(h) > Number(formData.hora_inicio)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🔥 validación lógica
    if (
      Number(formData.hora_fin) <= Number(formData.hora_inicio)
    ) {
      setMensaje("⚠ La hora de inicio debe ser menor que la hora de fin");
      return;
    }


    const payload = {

      cliente:{
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono
      },

      sala: formData.sala,
      numero_personas: formData.numero_personas,
      fecha_uso: formData.fecha_uso,
      hora_inicio: `${formData.hora_inicio}:00:00`,
      hora_fin: `${formData.hora_fin}:00:00`

    };

    try{

      const response = await fetch(
        "http://127.0.0.1:8000/api/reserva-sala/",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if(!response.ok){
        const errorData = await response.json();
        console.log("Error backend:", errorData);
        setMensaje("❌ Error: " + JSON.stringify(errorData));
        return;
      }
      const data = await response.json();
      setMensaje(`✅ Reserva pendiente de confirmación. La confirmación sera enviada al correo ${formData.email}`);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        sala: "",
        numero_personas: 1,
        fecha_uso: "",
        jornada: "",
        hora_inicio: "",
        hora_fin: ""
      });
    }catch(error){
      console.error(error);
      alert("Error creando reserva");
    }
  };

  // poner id seleccionado en disponibilidad en el formulario
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      sala: salaId ? salaId.toString() : "",
    }));
  }, [salaId]);
    return (

    <form onSubmit={handleSubmit} className="card-formulario">
      <h1 className="titulo"><strong>Reservar</strong> Sala</h1>
      

      {/* DATOS PERSONALES */}
      <div className="grupo-formulario nombre">
        <input type="text"id="nombre" name="nombre"placeholder=""value={formData.nombre}onChange={handleChange}required/>
        <label htmlFor="nombre">Nombre completo</label>
      </div>
      
      <div className="grupo-formulario">
        <input type="email" id="email" name="email" placeholder="" value={formData.email} onChange={handleChange} required/>
        <label htmlFor="email">Correo</label>
      </div>
      
      <div className="grupo-formulario">
        <input type="text"id="telefono" name="telefono"placeholder=""value={formData.telefono} onChange={handleChange} pattern="[0-9]{10}"maxLength="10" required/>
        <label htmlFor="telefono">Teléfono</label>
      </div>

      {/* SALAS */}
      <div className="grupo-formulario">
          <select 
            name="sala"
            id="sala"
            value={formData.sala}
            onChange={handleChange}
            required = {salasFiltradas.length >0}
            disabled = {salasFiltradas.length === 0}
          >
            <option value="">
              {salasFiltradas.length === 0
                ? "No hay salas disponibles"
                : "Seleccione una sala..."}
            </option>
            {salasFiltradas.map((s) => (
                <option key={s.id} value={s.id}>
                  Sala {s.numero} - {s.tipo_sala.nombre}
                </option>
              ))
            }
          </select>
          {/* <label>Salas</label> */}
        </div>
      {/* PERSONAS */}
      <div className="grupo-formulario">
        <input type="number"min={1}id="numero_personas" name="numero_personas"value={formData.numero_personas} onChange={handleChange}/>
        <label htmlFor="numero_personas">Numero de personas</label>  
      </div> 
      {/* FECHA DE USO */}
      <div className="grupo-formulario">
        <input
          type={formData.fecha_uso ? "date" : "text"}
          id="fecha_uso"
          name="fecha_uso"
          value={formData.fecha_uso}
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
          min={fechaMin}
          max={fechaMax}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label htmlFor="fecha_uso">Fecha de uso</label>
      </div>

      {/* JORNADA */}
      <div className="grupo-formulario">
        <select
          id="jornada"
          name="jornada"
          value={formData.jornada}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden></option>
          <option value="manana">Mañana</option>
          <option value="tarde">Tarde</option>
        </select>
        <label htmlFor="jornada">Jornada</label>
      </div>

      {/* HORA INICIO */}
      <div className="grupo-formulario">
        <select
          name="hora_inicio"
          id="hora_inicio"
          value={formData.hora_inicio}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden></option>
          {horariosDisponibles.map((hora) => (
            <option key={hora} value={hora}>
              {hora}:00
            </option>
          ))}
        </select>
        <label htmlFor="hora_inicio">Hora Inicio</label>
      </div>

      {/* HORA FIN */}
      <div className="grupo-formulario">
        <select
          name="hora_fin"
          id="hora_fin"
          value={formData.hora_fin}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden></option>
          {horariosFin.map((hora) => (
            <option key={hora} value={hora}>
              {hora}:00
            </option>
          ))}
        </select>
        <label htmlFor="hora_fin">Hora Fin</label>
      </div>


      <button type="submit">
        Reservar Sala
      </button>

      {mensaje && (
        <p className="mensaje-formulario">
          {mensaje}
        </p>
      )}

    </form>

  );

}