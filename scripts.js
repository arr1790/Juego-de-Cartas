document.addEventListener('DOMContentLoaded', function () {
    const tablero = document.getElementById('tablero');
    const seleccionCartas = document.getElementById('numCartas');
    const botonJugar = document.getElementById('botonJugar');
    let s = 0;
    let m = 0;
    let h = 0;
      let temporizador;

    const caraImagen = [  
        "./imagenes/carta1.jpg",
        "./imagenes/carta2.png",
        "./imagenes/carta3.png",
        "./imagenes/carta4.png",
        "./imagenes/carta5.png",
        "./imagenes/carta6.png",
        "./imagenes/carta7.png",
        "./imagenes/carta8.png",
        "./imagenes/carta9.png",
        "./imagenes/carta10.png",
        "./imagenes/carta11.png",
        "./imagenes/carta12.png",
        "./imagenes/carta13.png",
        "./imagenes/carta14.png",
        "./imagenes/carta15.png",
        "./imagenes/carta16.png",
        "./imagenes/carta17.png",
        "./imagenes/carta18.png",
        "./imagenes/carta19.png",
        "./imagenes/carta20.png",
    ];

    let audioperder = new Audio("audio/perder.wav");  
    let audiosuperar = new Audio("audio/acierto.wav"); 
    let sonidoGanador = new Audio("audio/sonidoGanador.mp3"); 

    let cartaVolteada = null; 
    let bloqueoTablero = false; 
    let paresEncontrados = 0; 
  
    
    
    for (let i = 2; i <= 20; i++) {
        const opcion = document.createElement('option'); // Creo cada opción
        opcion.value = i; 
        opcion.textContent = `${i} cartas`; // Mostrar el número de cartas como texto
        seleccionCartas.appendChild(opcion); 
    }

    botonJugar.addEventListener('click', function () {
        const numCartas = parseInt(seleccionCartas.value); // Obtener el número de cartas value es del select
        paresEncontrados = 0;
        generarCartas(numCartas);
        mostrarCartas(); 
        iniciaCronometro(); 
    });

    // Función para generar las cartas del juego
    function generarCartas(numCartas) {
        tablero.innerHTML = ''; 

        const totalCartas = numCartas * 2; 
        const columnas = Math.floor(Math.sqrt(totalCartas)); 
        tablero.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`; 

        const imagenesSeleccionadas = caraImagen.slice(0, numCartas); 
        const imagenesDuplicadas = [...imagenesSeleccionadas, ...imagenesSeleccionadas]; 
        imagenesDuplicadas.sort(() => Math.random() ); // Mezclar las cartas aleatoriamente

        // Crear las cartas y agregarlas al tablero
        for (let i = 0; i < totalCartas; i++) {
            const carta = document.createElement('div');
            carta.classList.add('carta');

            const cartaRotada = document.createElement('div');
            cartaRotada.classList.add('cartaRotada');

            const cara = document.createElement('div');
            cara.classList.add('cara');
            cara.style.backgroundImage = `url('${imagenesDuplicadas[i]}')`; // Mostrar la imagen en la cara de la carta rotada y url sirve para mostrar la imagen y la i es el index 

            const espalda = document.createElement('div');
            espalda.classList.add('espalda');

            cartaRotada.appendChild(cara);
            cartaRotada.appendChild(espalda);

            carta.appendChild(cartaRotada);
            carta.addEventListener('click', voltearCarta);

            tablero.appendChild(carta);
        }
    }
//memorizar las cartas
    function mostrarCartas() {
        const cartas = document.querySelectorAll('.carta');
        cartas.forEach(carta => carta.classList.add('volteada')); // Mostrar todas las cartas
        setTimeout(() => {
            cartas.forEach(carta => carta.classList.remove('volteada')); // Ocultar todas las cartas
        }, 2000); 
    }

    // Función para jugar con las cartas
    function voltearCarta() {
        if (bloqueoTablero || this.classList.contains('volteada')) return;

        this.classList.add('volteada'); 

        if (!cartaVolteada) { // la logica de la carta volteada o no volteada que se compara en el if de arriba
            cartaVolteada = this; 
            return;
        }

        const imagen1 = cartaVolteada.querySelector('.cara').style.backgroundImage; // se compara las cartas es decir la imagen de la cara
        const imagen2 = this.querySelector('.cara').style.backgroundImage;

        if (imagen1 === imagen2) {
            cartaVolteada.removeEventListener('click', voltearCarta);
            this.removeEventListener('click', voltearCarta);
            paresEncontrados++;
            setTimeout(() => audiosuperar.play(), 500);

            if (paresEncontrados === parseInt(seleccionCartas.value)) {
                setTimeout(() => {
                    detenerCronometro();
                    mostrarGanador();  
                    bloqueoTablero = false;
                }, 500);
            }

            cartaVolteada = null; // Limpiar la carta volteada para que empieze de nuevo el jugador
        } else {
            bloqueoTablero = true; // Bloquear el tablero durante 1 segundo
            setTimeout(() => {
                cartaVolteada.classList.remove('volteada'); // de nuevo se voltea la carta 
                this.classList.remove('volteada'); //se voltea la otra carta
                bloqueoTablero = false;  //despues de un segundo se desbloque el tablero 
                cartaVolteada = null; // se reinicia la carta 
                audioperder.play(); 
            }, 1000);
        }
    }

    // Función del cronómetro
    function actualizar() {
        s++;
        if (s == 60) {
            s = 0;
            m++;
            if (m == 60) {
                m = 0;
                h++;
            }
        }
        segundos.textContent = s;
        minutos.textContent = m;
        horas.textContent = h;
    }

    // Iniciar cronómetro
    function iniciaCronometro() {
        temporizador = setInterval(actualizar, 500); //inicia el cronometro cada segundo 
    }

    // Detener cronómetro
    function detenerCronometro() {
        clearInterval(temporizador);
       
    }

    // Mostrar el mensaje de ganador
    function mostrarGanador() {
        detenerCronometro();
        sonidoGanador.play();
        tablero.style.display = 'none';
        const h = document.getElementById('horas');
        const m = document.getElementById('minutos');
        const s = document.getElementById('segundos');
        const horas=h.textContent;
        const minutos=m.textContent;
        const segundos=s.textContent;
        setTimeout(() => alert(`¡Felicidades, has ganado! Tiempo total: ${horas}:${minutos}:${segundos}`), 500);
        h.textContent=0;
        m.textContent=0;
        s.textContent=0;

    }
});
