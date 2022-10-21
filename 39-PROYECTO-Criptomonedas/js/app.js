const form = document.querySelector('#formulario')
const moneda = document.querySelector('#moneda').value
const criptomoneda = document.querySelector('#criptomonedas').value
const criptomonedaselect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const resultadoDiv = document.querySelector('#resultado')

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}
//Crear un Promise

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
});

window.onload = () => {
    consultarCriptomonedas();
    form.addEventListener('submit', validarFormulario)
    criptomonedaselect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)

}

function validarFormulario(e) {
    e.preventDefault();
    const { moneda, criptomoneda } = objBusqueda

    if (moneda == '' || criptomoneda == '') {
        imprimirAlerta('Todos los campos son obligatorios')
        return;
    } else {
        conectarAPI(moneda, criptomoneda);
    }

}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value
}

function conectarAPI(moneda, criptomoneda) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            imprimirInformacionCriptomonedas(resultado.DISPLAY[criptomoneda][moneda])
        })

}

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => imprimirCriptomonedas(criptomonedas))
}

function imprimirCriptomonedas(criptomonedas) {
    criptomonedas.forEach(criptomoneda => {
        const { CoinInfo } = criptomoneda;
        const { Id, Name, FullName } = CoinInfo;
        const criptomonedaHTML = document.querySelector('#criptomonedas')
        criptomonedaHTML.innerHTML += `<option value="${Name}" id="${Id}"> ${FullName} </option>
        `


    });
}

function imprimirAlerta(mensaje) {
    const existeError = document.querySelector('.error')
    if (!existeError) {
        const ParrafoError = document.createElement('p')
        ParrafoError.textContent = mensaje;
        ParrafoError.classList.add('error')
        form.appendChild(ParrafoError)

        setTimeout(() => {
            ParrafoError.remove();
        }, 3000);
    }
}

function imprimirInformacionCriptomonedas(resultado) {
    limpiarHTML();
    Spinner();
    setTimeout(() => {
        const { moneda, criptomoneda } = objBusqueda
        console.log(resultado)
        const { PRICE, HIGH24HOUR, LOW24HOUR, CHANGEPCT24HOUR, LASTUPDATE } = resultado;
        const divResultado = document.createElement('div')

        divResultado.innerHTML = `<strong> Moneda:<span> ${moneda} </span> </strong>
    <strong> Criptomoneda:<span> ${criptomoneda} </span> </strong>
    <p class="precio"> Precio del ${criptomoneda} en ${moneda}: <span> ${PRICE} </span> </p> 
    <p class="precio"> Precio Mas Alto en las ultimas 24 Horas:<span> ${HIGH24HOUR} </span> </p>
    <p class="precio"> Precio Mas Bajo en las ultimas 24 Horas:<span> ${LOW24HOUR} </span> </p>
    <p class="precio"> Porcentaje de ganancia o perdida en las ultimas 24 Horas:<span> ${CHANGEPCT24HOUR} </span> </p>
    <strong> Ultima vez actualizada:<span> ${LASTUPDATE} </span> </strong>
    `

        resultadoDiv.appendChild(divResultado)
    }, 3000);

}

function limpiarHTML() {
    while (resultadoDiv.firstChild) {
        resultadoDiv.removeChild(resultadoDiv.firstChild)
    }
}
function Spinner() {
    const SpinnerDiv = document.createElement('div')
    SpinnerDiv.classList.add('sk-chase', 'spinner')
    SpinnerDiv.innerHTML = `
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>`

    resultadoDiv.appendChild(SpinnerDiv)
    setTimeout(() => {
        SpinnerDiv.remove();
    }, 3000);
}