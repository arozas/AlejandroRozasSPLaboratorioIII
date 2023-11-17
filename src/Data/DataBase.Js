import Terrestre from '../Entities/Terrestre.js';
import Aereo from '../Entities/Aereo.js';
import Vehiculo from '../Entities/Vehiculo.js';
import { mostrarSpinner, ocultarSpinner } from "../Modules/Spinner.js";


/*
Archivo que simula dase de datos.
*/

// Función para verificar datos y cargar el LocalStorage
export function VerificarDataBase() {
  mostrarSpinner(); // Muestra el spinner antes de la solicitud

  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost/Vehiculos.php', false); // false para solicitud síncrona
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
      if ("cantPue" in item && "cantRue" in item) {
        return new Terrestre(
          item.id,
          item.modelo,
          item.anoFab,
          item.velMax,
          item.cantPue,
          item.cantRue
        );
      } else if ("altMax" in item && "autonomia" in item) {
        return new Aereo(
          item.id,
          item.modelo,
          item.anoFab,
          item.velMax,
          item.altMax,
          item.autonomia
        );
      } else {
        return new Vehiculo(item.id, item.nombre, item.apellido, item.edad);
      }
    });
  }
  console.log("Datos mapeados.");
  return resultados;
}
