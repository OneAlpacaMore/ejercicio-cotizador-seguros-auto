//Constructores

function Seguro(marca, year, tipoSeguro) {
    this.marca = marca;
    this.year = year;
    this.tipoSeguro = tipoSeguro;
}

//realizar la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
    let cantidad;
    const precioBase = 2000;

    switch (this.marca) {
        case '1':
            cantidad = precioBase * 1.15;
            break;
        case '2':
            cantidad = precioBase * 1.05;
            break;
        case '3':
            cantidad = precioBase * 1.35;
            break;
        default:
            'Error'
            break;
    }

    //leer el year
    const diferencia = new Date().getFullYear() - this.year;
    //cada year que la diferencia es mayor, el costo va reducirse en un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;


    /*Si el seguro es basico se multiplica por 30% mas
    si la cobertura es completa, se multiplica por 50% mas*/

    if (this.tipoSeguro === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;

}




function UI() {

}

//Llena las opciones de lo usuarios
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}
//muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    ////////NO HACER NADA SI YA existe el bendito mensaje!!!!!
    ///
    const divExistente = document.querySelector('.mensaje'); //targeteamos la clase 

    if (divExistente) {
        // Si ya existe, no se ejecuta nada más
        return;
    }
    ////////



    const div = document.createElement('div');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //insertar en HTML 
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
        mensajeMostrado = false
    }, 3000)

};

UI.prototype.mostrarResultado = (total, seguro) => {



    const { marca, year, tipoSeguro } = seguro;

    let textoMarca;
    switch (marca) {
        case "1":
            textoMarca = "Americano";
            break;
        case "2":
            textoMarca = "Asiático";
            break;
        case "3":
            textoMarca = "Europeo"
            break;
        default:
            break;
    }


    const div = document.createElement("div");
    div.classList.add("mt-10", "remover");

    div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Total: <span class="font-normal">$${total.toFixed(2)}</span></p>
    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
    <p class="font-bold">Year: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal">${tipoSeguro}</span></p>
 `

    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";

    setTimeout(() => {

        //Evita que se creen multiples divs si se clickea el boton muchas veces
        const divExistente = document.querySelector('.remover');

        if (divExistente) {
            return;
        }

        spinner.style.display = "none";

        const resultadoDiv = document.querySelector("#resultado");
        resultadoDiv.appendChild(div);
    }, 3000);



}

//Instanciar UI
const ui = new UI();


document.addEventListener("DOMContentLoaded", () => {
    ui.llenarOpciones(); //Llena el select con los years
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    //leer la marca seleccionada
    const marca = document.querySelector("#marca").value;
    //leer el year seleccionado
    const year = document.querySelector("#year").value;
    //leer el tipo de cobertura
    const tipo = document.querySelector("input[name='tipo']:checked").value;


    //Mensajes
    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Procesando cotización...', 'exito');

    //ocultar cotizaciones previas
    const resultados = document.querySelector("#resultado div");
    if (resultados != null) {
        resultados.remove();
    }

    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    //Utilizar el prototype que va a cotizar.
    ui.mostrarResultado(total, seguro);



}