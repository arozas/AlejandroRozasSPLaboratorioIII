import { VerificarDataBase, MapearDatos } from './Data/DataBase.Js';
import Filtro from './Modules/Filtro.Js';
import InputConLabelYBoton from './Modules/InputBoton.Js';
import Tabla from './Modules/Tabla.Js';
import Profesional from './Entities/Profesional.js';
import Futbolista from './Entities/Futbolista.js';
import FormularioDinamico from './Modules/FormularioDinamico.js';

document.addEventListener("DOMContentLoaded", () => {
  VerificarDataBase();

  const clases = [Profesional, Futbolista];

  const miFiltro = new Filtro("Filtrar por:", "filtro", clases);

  const miInput = new InputConLabelYBoton(
    "Promedio Edad:",
    "resultado",
    "calcular-btn",
    "Calcular"
  );

  const columnas = [
    { label: "ID", value: "id" },
    { label: "Nombre", value: "nombre" },
    { label: "Apellido", value: "apellido" },
    { label: "Edad", value: "edad" },
    { label: "Equipo", value: "equipo" },
    { label: "Posición", value: "posicion" },
    { label: "Cantidad Goles", value: "cantidadGoles" },
    { label: "Titulo", value: "titulo" },
    { label: "Facultad", value: "facultad" },
    { label: "Año Graduación", value: "añoGraduacion" },
  ];

  const miTabla = new Tabla(columnas);

  miFiltro.setTabla(miTabla);

  const buttonText = "Mostrar Formulario";

  const miFormulario = new FormularioDinamico(clases, buttonText, document.getElementById("tabla"), miTabla);

  miTabla.formularioDinamico = miFormulario;

  miInput.calcularPromedio(document.getElementById("tabla"), 4);
});
