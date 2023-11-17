import Persona from './Persona.js';

export default class Futbolista extends Persona {
    constructor(id, nombre, apellido, edad, equipo, posicion, cantidadGoles) {
      super(id, nombre, apellido, edad);
      this.equipo = equipo;
      this.posicion = posicion;
      this.cantidadGoles = cantidadGoles;
    }
  
    toString() {
      return `${super.toString()}, Posición: ${this.posicion}, Equipo: ${this.equipo}, Goles: ${this.cantidadGoles}`;
    }
  }
  