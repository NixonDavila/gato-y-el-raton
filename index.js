document.addEventListener("DOMContentLoaded", function () {
    let cuadros = document.getElementsByClassName("div-option");
    let turnoPantalla = document.getElementById("turnoEnPantalla");
    let reset = document.getElementById("restart");
    let winO = document.getElementById("winO");
    let winX = document.getElementById("winX");
    let mensaje = document.getElementById("mensaje");
    let contadorO = parseInt(localStorage.getItem('contadorO')) || 0; // Contador de O
    let contadorX = parseInt(localStorage.getItem('contadorX')) || 0; // Contador de X

    let jugadores = true; // Indica si es el turno del jugador
    let juegoActivo = true; // Controla si el juego está en estado activo

    let jugadasGanadoras = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Muestra los contadores en pantalla
    winO.innerHTML = contadorO;
    winX.innerHTML = contadorX;

    // Verificar el estado del juego al cargar
    verificarEstadoJuego();

    // Añade eventos a cada cuadro
    for (let index = 0; index < cuadros.length; index++) {
        cuadros[index].addEventListener("click", movimientos);
    }

    // Añade el evento de clic para el botón de reinicio
    reset.addEventListener("click", resetJuego);

    function verificarEstadoJuego() {
        // Verifica si hay un ganador o empate en localStorage
        const estadoJuego = localStorage.getItem('estadoJuego');
        if (estadoJuego) {
            const { ganador, turn } = JSON.parse(estadoJuego);
            juegoActivo = false; // Desactiva el juego
            mensaje.innerHTML = ganador === "X" ? "¡Gana la X!" : ganador === "O" ? "¡Gana la máquina!" : "¡El juego terminó en empate!";
            turnoPantalla.innerHTML = ""; // Limpia el mensaje de turno
        }
    }

    function movimientos(jugador) {
        let cuadrosValor = jugador.target.innerHTML;

        // Solo permite el movimiento si la celda está vacía y el juego está activo
        if (cuadrosValor === "" && jugadores && juegoActivo) {
            jugador.target.innerHTML = "❌"; // Marca el movimiento del jugador

            // Verifica si el jugador ha ganado
            if (esganador("❌")) {
                contadores("X");
                mensajeG("X"); // Llama a mensajeG indicando que ganó X
                return; // Finaliza si el jugador gana
            } else if (empateTab()) {
                mensajeG("empate"); // Llama a mensajeG indicando que hay un empate
                return; // Finaliza si hay empate
            }

            // Cambia el turno a la máquina
            jugadores = false;
            turnoPantalla.innerHTML = "Turno de la máquina"; // Cambia el mensaje de turno
            turnodeO();
        }
    }

    function turnodeO() {
        const lugareslibres = [];

        // Verifica qué lugares están disponibles
        for (let index = 0; index < cuadros.length; index++) {
            if (cuadros[index].innerHTML === "") {
                lugareslibres.push(index);
            }
        }

        // Si no queda lugar no puede hacer un movimiento
        if (lugareslibres.length === 0) {
            return;
        }

        // Hace un movimiento al azar en los lugares disponibles
        const posicionAleatoria = Math.floor(Math.random() * lugareslibres.length);
        const lugarelegido = lugareslibres[posicionAleatoria];

        setTimeout(() => {
            cuadros[lugarelegido].innerHTML = "⭕"; // Marca la celda de la máquina

            // Verifica si la máquina ganó o si hubo un empate
            if (esganador("⭕")) {
                contadores("O"); // Llama a contadores indicando que ganó O
                mensajeG("O"); // Llama a mensajeG indicando que ganó O
                return; // Finaliza si la máquina gana
            } else if (empateTab()) {
                mensajeG("empate"); // Llama a mensajeG indicando que hay un empate
                return; // Finaliza si hay empate
            }

            // Cambia el turno de vuelta al jugador
            jugadores = true;
            turnoPantalla.innerHTML = "Turno del jugador"; // Cambia el mensaje de turno al jugador

        }, 500);
    }

    function resetJuego() {
        for (let index = 0; index < cuadros.length; index++) {
            cuadros[index].innerHTML = ""; // Limpia el tablero
        }
        jugadores = true; // Reinicia el turno al jugador
        juegoActivo = true; // Reinicia el estado del juego
        turnoPantalla.innerHTML = "Turno del jugador"; // Restablece el mensaje de turno
        mensaje.innerHTML = ""; // Limpia el mensaje de ganador o empate
    
       
    
        
      
    
        // Limpia el estado del juego en localStorage
        localStorage.removeItem('estadoJuego');
    }

    // Función para verificar si hay un ganador
    function esganador(simbolo) {
        for (let index = 0; index < jugadasGanadoras.length; index++) {
            if (cuadros[jugadasGanadoras[index][0]].innerHTML === simbolo &&
                cuadros[jugadasGanadoras[index][1]].innerHTML === simbolo &&
                cuadros[jugadasGanadoras[index][2]].innerHTML === simbolo) {
                juegoActivo = false; // Desactiva el juego si hay un ganador
                return true; // Si hay una combinación ganadora, retornar true
            }
        }
        return false; // Retornar false si no hay ganador
    }

    // Función para verificar si hay un empate
    function empateTab() {
        for (let index = 0; index < cuadros.length; index++) {
            if (cuadros[index].innerHTML === "") {
                return false; // Si hay alguna celda vacía, no hay empate
            }
        }
        juegoActivo = false; // Desactiva el juego si hay empate
        return true; // Si no hay celdas vacías, es un empate
    }

    // Función para contar victorias y almacenar en localStorage
    function contadores(result) {
        if (result === "X") {
            contadorX++;
            winX.innerHTML = contadorX;
            localStorage.setItem('contadorX', contadorX); // Guarda el contador de X en localStorage
            localStorage.setItem('estadoJuego', JSON.stringify({ ganador: "X", turn: "jugador" })); // Guarda el estado del juego
        } else if (result === "O") {
            contadorO++;
            winO.innerHTML = contadorO;
            localStorage.setItem('contadorO', contadorO); // Guarda el contador de O en localStorage
            localStorage.setItem('estadoJuego', JSON.stringify({ ganador: "O", turn: "máquina" })); // Guarda el estado del juego
        }
    }

    // Función para mostrar el mensaje del ganador o del empate en la pantalla
    function mensajeG(result) {
        if (result === "X") {
            mensaje.innerHTML = "¡Gana la X!";
        } else if (result === "O") {
            mensaje.innerHTML = "¡Gana la máquina!";
        } else if (result === "empate") {
            mensaje.innerHTML = "¡El juego terminó en empate!";
        }
        // Reiniciar el juego después de 2 segundos
        setTimeout(resetJuego, 2000); // Espera 2 segundos antes de reiniciar
    }
});







// const miMusica = document.getElementById("miMusica");
// const toggleButton = document.getElementById("toggleMusic");

// // Reproduce la música al cargar la página
// window.onload = () => {
//     miMusica.play();
// };

// // Controla la reproducción/pausa de la música
// toggleButton.addEventListener("DOMContentLoaded", () => {
//     if (miMusica.paused) {
//         miMusica.play();
//         toggleButton.innerText = "Pausar Música";
//     } else {
//         miMusica.pause();
//         toggleButton.innerText = "Reproducir Música";
//     }
// });


