import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../api/api'
import { useParams, useLocation} from "react-router-dom";
import '../styles/SalaDetalle.css';
import FormularioSala from "../components/FormularioSala";
import ImagenesSalas from '../data/ImagenesSalas';

// Iconos
import iconoBano from "../assets/iconos/bano.png";


import ReglasHotel from '../components/ReglasHotel';
import ComodidadesHotel from '../components/ComodidadesHotel';

function SalaDetalle() {

  // Se obtienen parámetros de la URL.
  const { id } = useParams();
  const location = useLocation(); // Se obtiene la ruta utilizada
  const esRutaTipoSala = location.pathname.startsWith("/tipo-sala");

  // Estado para useEffect (sala y tipo de sala)
  const [sala, setSala] = useState(null);
  const [tipoSala, setTipoSala] = useState(null);

  //console.log("ID de la sala: ", id, "Nombre: ", tipoSala?.nombre);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para la imagen seleccionada de cada sala (para la galería)
  const [fotoActual, setFotoActual] = useState(null);
  
  /* Se obtienen las fotos pasándole el nombre de la sala (tipoSala: se ha obtenido de la API).
     Si el nombre de la sala no existe, se muestra un array vacío (no se muestran fotos). 
  */
  const nombreSala = tipoSala?.nombre?.toLowerCase() || "";
  const fotosSalas = ImagenesSalas[nombreSala] || []; 


  /* Manejador para las fotos: al seleccionar una imagen, 
  se coloca esa imagen como fotoHabitacionSeleccionada, 
  que es la que se muestra como imagen principal (grande). */
  const handleCambiarFotoSala = (foto) => {
    setFotoActual(foto);
  }

  const handleCambiarFotoSalaSiguiente = () => {
    //setFotoIndice((indice_foto) => (indice_foto + 1) % fotosHabitacion.length);
    const indiceActual = fotosSalas.findIndex(
      (foto) => foto.id === fotoActual.id
    );

    const anteriorIndice =
      (indiceActual + 1) % fotosSalas.length;

    setFotoActual(fotosSalas[anteriorIndice]);
    }

  const handleCambiarFotoSalaAnterior = () => {
    //setFotoIndice((indice_foto) => (indice_foto - 1 + fotosHabitacion.length) % fotosHabitacion.length);
    const indiceActual = fotosSalas.findIndex(
      (foto) => foto.id === fotoActual.id
    );

    const anteriorIndice =
      (indiceActual - 1 + fotosSalas.length) % fotosSalas.length;

    setFotoActual(fotosSalas[anteriorIndice]);
  }

  // Estado del formulario de reserva
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    celular: '',
    fecha: '',
    salon: '',
    horario: ''
  })

  /* Desde la API el campo "precio" puede venir en decimal.
     Ej: 50.00€ o 46,34€.
     Se desea mostrar números enteros en caso de que no tenga ningún decimal.
     Por tanto, se convierte a "Float" y se pasa a formato "String" para que respete el formato
     de la monera europea */
  const ponerFormatoPrecio = (precio) => {
    return parseFloat(precio).toLocaleString("es-ES");
  }

  // Cargar tipos de sala desde la API
  useEffect(() => {
    const fetchSala = async () => {
      console.log( "Lanzando fetch a la API...");
      setLoading(true);
      setError(null);
      try {
        const url = esRutaTipoSala
          ? `${API_BASE_URL}/tipo-salas/${id}/`
          : `${API_BASE_URL}/salas/${id}/`;

        const responseSala = await fetch(url)
//        const responseSala = await fetch(`${API_BASE_URL}/salas/${id}/`);
        if (!responseSala.ok) throw new Error('Error al cargar las salas');

        const data = await responseSala.json();
        console.log('Salas cargadas del API:', data);

        if(esRutaTipoSala){
          setSala(null);
          setTipoSala(data);
        }else{
          setSala(data);
          setTipoSala(data.tipo_sala);
        }
      } catch (err) {

        /* Ignorar si el error de abort (no es un error real, 
        sino que es una señal de que el componente se desmontó antes
        de recibir la respuesta ) */
        if(err.name === "AbortError") {
          console.log("Fetch abortado, el componente se desmontó antes de recibir la respuesta.");
          return;
        }

        console.error("Error al obtener los datos de la sala:", err.message);
        setError(err.message);

      } finally {
        console.log("Fetch finalizado.");
        setLoading(false); // Se pone a false "loading", ya que se han cargado los datos.
      }
    }
    fetchSala();
  }, [id, esRutaTipoSala])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Enviar formulario de reserva
  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implementar lógica de envío al backend
    console.log('Datos de reserva:', formData)
    alert('Reserva enviada (pendiente de implementar)')
  }
  


  useEffect(() => {
    if (fotosSalas.length > 0) {
      setFotoActual(fotosSalas[0]);
    }
    console.log("Cambiando foto de Sala...")
  }, [nombreSala]);


/* Renderizados condicionales:
      - Loading.
      - Error.
    Muestra un mensaje si está cargando la aplicación o si hay un error.
    En caso contrario, aparecerá el contenido de la aplicación 
  */

  if (loading) return <p className="hd-info">🔄 Cargando...</p>;
  if (error) return <p className="hd-error">{error}</p>;

  return (
    <div className='sd-contenedor'>
      <h2 className="sd-titulo">{`Sala ${tipoSala?.nombre || "Sala"}`} </h2> 


      {/* Miniaturas a la izquierda e imagen principal a la derecha en grande */}
      <div className="sd-contenedor-fotos">
        <div className="sd-contenedor-miniaturas">
          {fotosSalas.map((foto) => (
            <div
              key={foto.id}
              className={`sd-miniatura ${fotoActual?.id === foto.id ? "activa" : ""}`}
              onClick={() => handleCambiarFotoSala(foto)}
            >
              <img src={foto.src} alt="Imagen miniatura" />
            </div>
          ))}
        </div>
        
        {fotoActual && (
           <div className="sd-foto-principal">
          <img src={fotoActual.src} alt="Imagen principal"  />
        </div>
        )}
       
      </div>
      
      {/* Botones para desplazar las fotos: Anterior y Siguiente */}
      <div className="sd-contenedor-botones-fotos"> 
        <button onClick={() => handleCambiarFotoSalaAnterior()}> Anterior  </button>
        <button onClick={() => handleCambiarFotoSalaSiguiente()}> Siguiente  </button>
      </div>


      {/* Precios */}
      <div className="sd-contenedor-precios">
        <div className="sd-contenedor-precios-izq-der">
                
          <div className="sd-precios-dinero">
              <div className="sd-precio">{tipoSala?.precio ? ponerFormatoPrecio(tipoSala.precio): "—"} €</div>
              <div className="sd-precio-noche">Por hora</div>
          </div>
       
          <div className="sd-precios-iconos">
            <img className="sd-iconos" src={iconoBano} alt = "Icono rojo baño"/>
             <span className="sd-texto-icono"> Baño</span>
          </div>
              
        </div>
      </div>

      {/* Comodidades */}
      <ComodidadesHotel tipo="sala" />

      {/* Reglas: comunes y salas */}
      <ReglasHotel tipo="sala" />
      
      {/* Formulario de reserva */}
      <div className="formulario">
        <FormularioSala 
          tipoSala= {tipoSala?.nombre || ""}
          salaId={ esRutaTipoSala ? null : id}/>
      </div>
      
    </div>
  );
}

export default SalaDetalle;
