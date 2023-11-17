import { VerificarDataBase, MapearDatos } from './Data/DataBase.Js';
import Filtro from './Modules/Filtro.Js';
import InputConLabelYBoton from './Modules/InputBoton.Js';
import Tabla from './Modules/Tabla.Js';
import Aereo from './Entities/Aereo.js';
import Terrestre from './Entities/Terrestre.js';
import FormularioDinamico from './Modules/FormularioDinamico.js';

document.addEventListener("DOMContentLoaded", () => {
  VerificarDataBase();

  const clases = [Aereo, Terrestre];

  const miFiltro = new Filtro("Filtrar por:", "filtro", clases);

  const miInput = new InputConLabelYBoton(
    "Promedio Velocidad Maxima:",
    "resultado",
    "calcular-btn",
    "Calcular"
  );

  const columnas = [
    { label: "ID", value: "id" },
    { label: "Modelo", value: "modelo" },
    { label: "Año Fab", value: "anoFab" },
    { label: "Vel Max", value: "velMax" },
    { label: "AltMax", value: "altMax" },
    { label: "Autonomia", value: "autonomia" },
    { label: "Cant Pue", value: "cantPue" },
    { label: "Cant Rue", value: "cantRue" },
  ];

  const miTabla = new Tabla(columnas);

  miFiltro.setTabla(miTabla);

  const buttonText = "Mostrar Formulario";

  const miFormulario = new FormularioDinamico(clases, buttonText, document.getElementById("tabla"), miTabla);

  miTabla.formularioDinamico = miFormulario;

  miInput.calcularPromedio(document.getElementById("tabla"), 4);
});
