// Importar imágenes locales
// Imágenes de las habitaciones 

// Premium
import fotoBanoPremium from "../assets/habitacion/premium-bano.png";
import fotoCocinaPremium  from "../assets/habitacion/premium-cocina.png";
import fotoEstudioPremium  from "../assets/habitacion/premium-estudio.png";
import fotoHabitacionPremium  from "../assets/habitacion/premium-habitacion.png";

// Doble
import fotoBanoDoble from "../assets/habitacion/doble-bano.png";
import fotoDuchaDoble  from "../assets/habitacion/doble-ducha.png";
import fotoArmarioDoble  from "../assets/habitacion/doble-armario.png";
import fotoHabitacionDoble  from "../assets/habitacion/doble-habitacion.png";

// Sencilla
import fotoBanoSencila from "../assets/habitacion/sencilla-bano.png";
import fotoDuchaSencilla  from "../assets/habitacion/sencilla-ducha.png";
import fotoArmarioSencilla  from "../assets/habitacion/sencilla-armario.png";
import fotoHabitacionSencilla  from "../assets/habitacion/sencilla-habitacion.png";



// Es un objeto que contiene las imágenes de cada tipo de habitaciones, relacionadas por su id.
const ImagenesHabitaciones = {
  premium: [
    { id: "hab-prem-1", src: fotoBanoPremium },
    { id: "hab-prem-2", src: fotoCocinaPremium },
    { id: "hab-prem-3", src: fotoEstudioPremium },
    { id: "hab-prem-4", src: fotoHabitacionPremium },
  ],
  sencilla: [
    { id: "pro-1", src: fotoBanoDoble },
    { id: "pro-2", src: fotoDuchaDoble },
    { id: "pro-3", src: fotoArmarioDoble },
    { id: "pro-4", src: fotoHabitacionDoble },
  ],
  familiar: [
    { id: "pro-1", src: fotoBanoSencila },
    { id: "pro-2", src: fotoDuchaSencilla },
    { id: "pro-3", src: fotoArmarioSencilla },
    { id: "pro-4", src: fotoHabitacionSencilla },
  ]
};

export default ImagenesHabitaciones;