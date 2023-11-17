import Futbolista from '../Entities/Futbolista.js';
import Profesional from '../Entities/Profesional.js';
import Persona from '../Entities/Persona.js';
import { mostrarSpinner, ocultarSpinner } from "../Modules/Spinner.js";



/*
Archivo que simula dase de datos.
*/

// Función para verificar datos y cargar el LocalStorage
export function VerificarDataBase() {
  mostrarSpinner(); // Muestra el spinner antes de la solicitud

  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost/personasFutbolitasProfesionales.php', false); // false para solicitud síncrona
  xhr.send();

  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);

    if (localStorage.getItem("misDatos") == null) {
      localStorage.setItem('misDatos', JSON.stringify(data));
      console.log('No hay datos, se cargó la base de datos.');
    } else {
      console.log('No se cargó la base de datos, ya hay datos.');
    }
  } else {
    console.error('Error al realizar la solicitud. Estado:', xhr.status);
  }

  ocultarSpinner(); // Oculta el spinner después de la solicitud (éxito o error)
}



export function MapearDatos() {
  const data = JSON.parse(localStorage.getItem("misDatos"));
  let resultados = [];

  if (data) {
    resultados = data.map((item) => {
      if ("equipo" in item && "cantidadGoles" in item) {
        return new Futbolista(
          item.id,
          item.nombre,
          item.apellido,
          item.edad,
          item.equipo,
          item.posicion,
          item.cantidadGoles
        );
      } else if ("facultad" in item && "añoGraduacion" in item) {
        return new Profesional(
          item.id,
          item.nombre,
          item.apellido,
          item.edad,
          item.titulo,
          item.facultad,
          item.añoGraduacion
        );
      } else {
        return new Persona(item.id, item.nombre, item.apellido, item.edad);
      }
    });
  }
  console.log("Datos mapeados.");
  return resultados;
}
