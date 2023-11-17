import { mostrarSpinner, ocultarSpinner } from "./Spinner.js";
import Profesional from '../Entities/Profesional.js';
import Futbolista from '../Entities/Futbolista.js';

export default class FormularioDinamico {
    constructor(clases, buttonText, componenteOcultar, tabla) {
      this.clases = clases;
      this.buttonText = buttonText;
      this.componenteOcultar = componenteOcultar;
      this.formulario = this.crearFormulario();
      this.tipoSeleccionado = null;
      this.buttonContainer = this.crearButtonContainer();
      this.agregarEventListeners();
      this.renderizarEnMain();
      this.IdEditar = null;
      this._tabla = tabla;
    }
  
    crearFormulario() {
      const form = document.createElement("form");
      form.id = "agregar-form";

      const titulo = document.createElement("h2");
      titulo.classList.add("titulo-formulario"); 
      form.appendChild(titulo);
    
      const tipoLabel = document.createElement("label");
      tipoLabel.textContent = "Seleccionar tipo:";
      form.appendChild(tipoLabel);
  
      this.clases.forEach((clase) => {
        const inputTipo = document.createElement("input");
        inputTipo.type = "radio";
        inputTipo.id = clase.name.toLowerCase();
        inputTipo.name = "tipo";
        inputTipo.value = clase.name.toLowerCase();
  
        const labelTipo = document.createElement("label");
        labelTipo.setAttribute("for", clase.name.toLowerCase());
        labelTipo.textContent = clase.name.charAt(0).toUpperCase() + clase.name.slice(1);
  
        inputTipo.addEventListener("change", () => {
          this.tipoSeleccionado = clase;
          this.actualizarCamposFormulario();
        });
  
        form.appendChild(inputTipo);
        form.appendChild(labelTipo);
      });
  
      const datosContainer = document.createElement("div");
      datosContainer.classList.add("datos-modal-form");
  
      form.appendChild(datosContainer);
  
      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.setAttribute("id", "boton-agregar");
      submitButton.value = "Agregar";
  
      const cancelButton = document.createElement("button");
      cancelButton.setAttribute("id", "boton-cancelar");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancelar";
  
      cancelButton.addEventListener("click", () => {
        this.ocultarFormulario();
      });
  
      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("id", "boton-eliminar");
      deleteButton.type = "button";
      deleteButton.textContent = "Eliminar";
      deleteButton.style.display = "none";

     deleteButton.addEventListener("click", async () => {
      if (this.IdEditar != null && this.IdEditar > 0) {
        mostrarSpinner();
        // Realizar la solicitud DELETE al archivo PHP
        const response = await fetch('http://localhost/personasFutbolitasProfesionales.php', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: this.IdEditar }),
        });
        ocultarSpinner();
        // Verificar el estado de la respuesta
        if (response.ok) {
          // Si la respuesta es exitosa, proceder con la eliminación local
          const datosDB = JSON.parse(localStorage.getItem("misDatos"));
          const index = datosDB.findIndex((datos) => datos.id === this.IdEditar);
    
          if (index !== -1) {
            datosDB.splice(index, 1);
            localStorage.setItem("misDatos", JSON.stringify(datosDB));
            console.log("Datos después de eliminar:", datosDB);
    
            // Actualizar la tabla después de eliminar utilizando los datos actualizados
            this._tabla.actualizarTabla(datosDB);
    
            // Ocultar el formulario después de eliminar
            this.ocultarFormulario();
          }
        } else {
          // Si la respuesta no es exitosa, mostrar un alert con el mensaje de error
          const errorMessage = await response.text();
          alert(`Error al eliminar: ${errorMessage}`);
        }
      }
    });
    

      form.appendChild(submitButton);
      form.appendChild(cancelButton);
      form.appendChild(deleteButton);
  
      return form;
    }

    crearButtonContainer() {
      const container = document.createElement("div");
  
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = this.buttonText;
  
      button.addEventListener("click", () => {
        this.IdEditar = null;
        this.mostrarFormulario();
      });
  
      container.appendChild(button);
      container.appendChild(this.formulario);
      this.formulario.style.display = "none";
  
      return container;
    }
  
    agregarEventListeners() {
        this.formulario.addEventListener("submit", (event) => {
            event.preventDefault();
            this.procesarFormulario();
      });
    }
  
    mostrarFormulario() {
      this.formulario.style.display = "block";
      this.buttonContainer.querySelector("button").style.display = "none";
      if (this.componenteOcultar) {
        this.componenteOcultar.style.display = "none";
      }
    
      const titulo = this.formulario.querySelector(".titulo-formulario");
      if (this.IdEditar != null && this.IdEditar > 0) {
        titulo.textContent = "Modificar/Borrar";
        console.log("Estoy modificando.")
      } else {
        titulo.textContent = "Alta de Vehículo";
        console.log("Estoy dando un alta.")
      }
    }
    
  
    ocultarFormulario() {
      this.formulario.style.display = "none";
      this.buttonContainer.querySelector("button").style.display = "block";
      this.formulario.reset();
      this.tipoSeleccionado = null;
      const submitButton = document.getElementById("boton-agregar");
      if(submitButton.value === "Modificar")
      {
        submitButton.value = "Agregar";
      }
      
      if (this.componenteOcultar) {
        this.componenteOcultar.style.display = "block";
      }
      const Eliminar = document.getElementById("boton-eliminar");
      Eliminar.style.display = "none";
    }
  
    actualizarCamposFormulario() {
      const datosContainer = this.formulario.querySelector(".datos-modal-form");
  
      // Eliminar campos anteriores
      while (datosContainer.firstChild) {
        datosContainer.removeChild(datosContainer.firstChild);
      }
  
      // Agregar campos según la clase seleccionada
      if (this.tipoSeleccionado) {
        const clase = this.tipoSeleccionado;
        const instance = new clase();
  
        for (const key in instance) {
          if (key !== "id") {
            const label = document.createElement("label");
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ":";
            const input = document.createElement("input");
            input.type = typeof instance[key] === "number" ? "number" : "text";
            input.id = key;
            input.name = key;
            input.required = true;
  
            datosContainer.appendChild(label);
            datosContainer.appendChild(input);
          }
        }
      }
    }
  
    procesarAlta(datos, datosDB) {
      mostrarSpinner();
    
      const objetoEnviar = {};
      for (const key in datos) {
        if (key !== "id") {
          objetoEnviar[key] = datos[key];
        }
      }
    
      const validaciones = this.validarDatos(objetoEnviar);
      if (validaciones.length > 0) {
        alert(`Error: ${validaciones.join(", ")}`);
        ocultarSpinner(); // Ensure Spinner is hidden in case of validation error
        return;
      }
    
      fetch('http://localhost/personasFutbolitasProfesionales.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objetoEnviar),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al realizar la solicitud. Estado: ${response.status}`);
          }
          return response.json();
        })
        .then(responseData => {
          datos.id = responseData.id;
          datosDB.push(datos);
          localStorage.setItem("misDatos", JSON.stringify(datosDB));
          ocultarSpinner();
          this.ocultarFormulario();
          this._tabla.actualizarTabla(datosDB);
        })
        .catch(error => {
          ocultarSpinner();
          this.ocultarFormulario();
          console.error(error);
          alert("No se pudo realizar la operación.");
        });
    }
    
    
    procesarEdicion(datos, datosDB) {
      if (!this.IdEditar || this.IdEditar <= 0) {
        alert("Error: ID de edición no válido.");
        return;
      }
    
      const objetoExistente = datosDB.find((dato) => dato.id === this.IdEditar);
    
      if (!objetoExistente) {
        alert("Error: No se encontró el elemento a editar.");
        return;
      }
    
      const formData = new FormData(this.formulario);
      const datosModificados = {};
      formData.forEach((value, key) => {
        datosModificados[key] = value;
      });
    
      const validaciones = this.validarDatos(datosModificados);
      if (validaciones.length > 0) {
        alert(`Error: ${validaciones.join(", ")}`);
        return;
      }
    
      mostrarSpinner();
    
      const objetoEnviar = {
        id: this.IdEditar,
        ...datosModificados,
      };
    
      fetch('http://localhost/personasFutbolitasProfesionales.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objetoEnviar),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al realizar la solicitud. Estado: ${response.status}`);
          }
          return response.text();
        })
        .then(responseData => {
          if (responseData === "Exito") {
            const index = datosDB.findIndex((objeto) => objeto.id === this.IdEditar);
            if (index !== -1) {
              datosDB[index].nombre = datos.nombre;
              datosDB[index].apellido = datos.apellido;
              datosDB[index].edad = datos.edad;
              datosDB[index].equipo = datos.equipo;
              datosDB[index].posicion = datos.posicion;
              datosDB[index].cantidadGoles = datos.cantidadGoles;
              datosDB[index].titulo = datos.titulo;
              datosDB[index].facultad = datos.facultad;
              datosDB[index].añoGraduacion = datos.añoGraduacion;

              localStorage.setItem("misDatos", JSON.stringify(datosDB));
              ocultarSpinner();
              this.ocultarFormulario();
              this._tabla.actualizarTabla(datosDB);
              console.log("Operación exitosa");
              ocultarSpinner();
            } else {
              console.log("No se pudo realizar la operación: No se encontró el objeto en datosDB");
              alert("Error");
            }
          } else {
            console.log("No se pudo realizar la operación");
            alert("Error");
          }
        })
        .catch(error => {
          ocultarSpinner();
          this.ocultarFormulario();
          console.error(error);
          alert("No se pudo realizar la operación.");
        });        
    }
    
    
    validarDatos(datos) {
      const errores = [];
    
      if (this.tipoSeleccionado === Futbolista) {
        if (isNaN(datos.cantidadGoles) || datos.cantidadGoles < 0) {
          errores.push("La cantidad de goles debe ser un número mayor o igual a 0.");
        }
      } else if (this.tipoSeleccionado === Profesional) {
        if (isNaN(datos.añoGraduacion) || datos.añoGraduacion < 1950) {
          errores.push("El año de graduación debe ser un número mayor a 1950.");
        }
      }
    
      return errores;
    }
    
    procesarFormulario() {
      if (this.tipoSeleccionado) {
        const datos = {};
        const datosDB = JSON.parse(localStorage.getItem("misDatos"));
    
        const formData = new FormData(this.formulario);
        formData.forEach((value, key) => {
          datos[key] = value;
        });
    
        // Agregar el ID al objeto datos si es una edición
        if (this.IdEditar != null && this.IdEditar > 0) {
          datos.id = this.IdEditar;
        }
    
        const clavesEsperadas = ['nombre', 'apellido', 'edad', 'equipo', 'posicion', 'cantidadGoles', 'titulo', 'facultad', 'añoGraduacion'];
        const datosAjustados = {};
        clavesEsperadas.forEach((key) => {
          datosAjustados[key] = datos[key];
        });
    
        console.log(datosAjustados);
    
        if (this.IdEditar != null && this.IdEditar > 0) {
          console.log("Estoy obteniendo datos para modificación");
          this.procesarEdicion(datosAjustados, datosDB);
        } else {
          console.log("Estoy dando un alta");
          this.procesarAlta(datosAjustados, datosDB);
        }
    
        this.ocultarFormulario();
      }
    }
    
  
    actualizarLocalStorageYTabla(datosDB) {
      // Actualizar la base de datos local
      localStorage.setItem("misDatos", JSON.stringify(datosDB));
      this.actualizarCamposFormulario();
      this._tabla.actualizarTabla(datosDB);
    }
  
    renderizarEnMain() {
      const main = document.querySelector("main");
      if (main) {
        main.appendChild(this.buttonContainer);
      } else {
        const newMain = document.createElement("main");
        newMain.appendChild(this.buttonContainer);
        document.body.appendChild(newMain);
      }
    };

    abrirFormularioEditar(objeto) {
        this.IdEditar=objeto.id;
        console.log(this.IdEditar);
        this.mostrarFormulario();
        this.formulario.reset();
        const submitButton = document.getElementById("boton-agregar");
        submitButton.value = "Modificar";
        const Eliminar = document.getElementById("boton-eliminar");
        Eliminar.style.display = "block";
        this.tipoSeleccionado = objeto.constructor;
        this.actualizarCamposFormulario();
      
        // Rellena los campos del formulario con los valores del objeto
        for (const key in objeto) {
          if (key !== "id") {
            const input = this.formulario.querySelector(`[name="${key}"]`);
            if (input) {
              input.value = objeto[key];
            }
          }
        }
    }; 
  };
  