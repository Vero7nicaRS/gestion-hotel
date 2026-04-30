import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../api/api'
import '../styles/Disponibilidad.css'

import imgSencilla from '../assets/Sencilla-habitacion.jpg'
import imgDoble from '../assets/Doble-habitacion.avif'
import imgPremium from '../assets/Premium-habitacion.jpg'
import imgSalaEco from '../assets/salas/Sala-eco-1.jpg'
import imgSalaPro from '../assets/salas/Sala-pro-1.jpg'

const IMAGENES_HAB = { sencilla: imgSencilla, doble: imgDoble, premium: imgPremium }
const IMAGENES_SALA = { eco: imgSalaEco, pro: imgSalaPro }

function getImgHab(nombre = '') {
  const n = nombre.toLowerCase()
  for (const [key, img] of Object.entries(IMAGENES_HAB)) {
    if (n.includes(key)) return img
  }
  return imgSencilla
}

function getImgSala(nombre = '') {
  const n = nombre.toLowerCase()
  for (const [key, img] of Object.entries(IMAGENES_SALA)) {
    if (n.includes(key)) return img
  }
  return imgSalaEco
}

function CardHabitacion({ hab }) {
  const disponible = hab.estado === 'DISPONIBLE'
  const tipo = hab.tipo_habitacion || {}

  return (
    <div className={`disp-card ${disponible ? 'disp-card--disponible' : 'disp-card--ocupada'}`}>
      <div className="disp-card__header">
        <span className={`disp-card__tipo ${disponible ? 'disp-tipo--disponible' : 'disp-tipo--ocupada'}`}>
          {tipo.nombre || 'Habitación'}
        </span>
        <span className={`disp-card__badge ${disponible ? 'disp-badge--disponible' : 'disp-badge--ocupada'}`}>
          {disponible ? 'Disponible' : 'Ocupada'}
        </span>
      </div>

      <div className="disp-card__body">
        <img src={getImgHab(tipo.nombre)} alt={tipo.nombre} className="disp-card__img" />
        <div className="disp-card__info">
          <p className="disp-info__numero">
            <span className="disp-info__hash">#</span> Habitación {hab.numero}
          </p>
          <p className="disp-info__label">Precio Noche</p>
          <p className={`disp-info__valor ${disponible ? 'disp-valor--disponible' : 'disp-valor--ocupada'}`}>
            {tipo.precio || '—'}
          </p>
          {disponible && (
            <Link to={`/habitacion/${hab.id}`} className="disp-btn-ver">
              Ver
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function CardSala({ sala }) {
  const tipo = sala.idtipo_sala || {}
  const hayDisponible = sala.disponible_manana || sala.disponible_tarde

  return (
    <div className={`disp-card ${hayDisponible ? 'disp-card--disponible' : 'disp-card--ocupada'}`}>
      <div className="disp-card__header">
        <span className={`disp-card__tipo ${hayDisponible ? 'disp-tipo--disponible' : 'disp-tipo--ocupada'}`}>
          {tipo.nombre || 'Sala'}
        </span>
        <div className="disp-jornadas">
          <span className={`disp-jornada ${sala.disponible_manana ? 'disp-jornada--disponible' : 'disp-jornada--ocupada'}`}>
            Mañana
          </span>
          <span className={`disp-jornada ${sala.disponible_tarde ? 'disp-jornada--disponible' : 'disp-jornada--ocupada'}`}>
            Tarde
          </span>
        </div>
      </div>

      <div className="disp-card__body">
        <img src={getImgSala(tipo.nombre)} alt={tipo.nombre} className="disp-card__img" />
        <div className="disp-card__info">
          <p className="disp-info__numero">
            <span className="disp-info__hash">#</span> Sala {sala.numero}
          </p>
          <p className="disp-info__label">Precio</p>
          <p className={`disp-info__valor ${hayDisponible ? 'disp-valor--disponible' : 'disp-valor--ocupada'}`}>
            {tipo.precio || '—'}
          </p>
          {hayDisponible && (
            <Link to="/salas" className="disp-btn-ver">Ver</Link>
          )}
        </div>
      </div>
    </div>
  )
}

const hoy = new Date().toISOString().split('T')[0]

export default function Disponibilidad() {
  const [habitaciones, setHabitaciones] = useState([])
  const [salas, setSalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fecha, setFecha] = useState(hoy)
  const [jornada, setJornada] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ fecha })
        if (jornada) params.append('jornada', jornada)

        const [resHab, resSala] = await Promise.all([
          fetch(`${API_BASE_URL}/habitaciones/`),
          fetch(`${API_BASE_URL}/salas/?${params}`),
        ])
        if (!resHab.ok) throw new Error('Error al cargar habitaciones')
        if (!resSala.ok) throw new Error('Error al cargar salas')

        const [dataHab, dataSala] = await Promise.all([
          resHab.json(),
          resSala.json(),
        ])

        setHabitaciones(Array.isArray(dataHab) ? dataHab : dataHab.results || [])
        setSalas(Array.isArray(dataSala) ? dataSala : dataSala.results || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [fecha, jornada])

  if (loading) return <div className="disp-estado">Cargando disponibilidad...</div>
  if (error) return <div className="disp-estado disp-estado--error">Error: {error}</div>

  return (
    <div className="disp-container">
      <section className="disp-seccion">
        <h2 className="disp-titulo">
          <span className="disp-titulo__rojo">Reserva</span> Habitaciones
        </h2>
        <div className="disp-grid">
          {habitaciones.map(hab => (
            <CardHabitacion key={hab.id} hab={hab} />
          ))}
          {habitaciones.length === 0 && (
            <p className="disp-vacio">No hay habitaciones registradas.</p>
          )}
        </div>
      </section>

      <section className="disp-seccion">
        <h2 className="disp-titulo">
          <span className="disp-titulo__rojo">Reserva</span> Salas
        </h2>

        <div className="disp-filtros">
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="disp-filtro__fecha"
          />
          <div className="disp-filtro__jornadas">
            {[
              { valor: '',       etiqueta: 'Todas' },
              { valor: 'MANANA', etiqueta: 'Mañana' },
              { valor: 'TARDE',  etiqueta: 'Tarde' },
            ].map(({ valor, etiqueta }) => (
              <button
                key={valor}
                className={`disp-filtro__btn ${jornada === valor ? 'disp-filtro__btn--activo' : ''}`}
                onClick={() => setJornada(valor)}
              >
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        <div className="disp-grid">
          {salas.map(sala => (
            <CardSala key={sala.id} sala={sala} />
          ))}
          {salas.length === 0 && (
            <p className="disp-vacio">No hay salas registradas.</p>
          )}
        </div>
      </section>
    </div>
  )
}
