import Persona from './Persona.js';

export default class Profesional extends Persona {
    constructor(id, nombre, apellido, edad, titulo, facultad, añoGraduacion) {
      super(id, nombre, apellido, edad);
      this.titulo = titulo;
      this.facultad = facultad;
      this.añoGraduacion = añoGraduacion;
    }
  
    toString() {
      return `${super.toString()}, Título: ${this.titulo}, Facultad: ${this.facultad}, Año de Graduación: ${this.añoGraduacion}`;
    }
  }
  