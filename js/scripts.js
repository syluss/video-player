/* ---------------------------
* Definición de elementos
* ---------------------------- */
const videoPlayer = document.getElementById('video-player');
const btnPlayPause = document.getElementById('play-pause');
const iconsPlayPause = document.querySelectorAll('#play-pause i');
const btnsZoom = document.querySelectorAll('.zoom');
const inputsRange = document.querySelectorAll('[type="range"]');
const rangVolumen = document.getElementById('rangVolumen');
const iconsVolumen = document.querySelectorAll('#mute i');
const btnMute = document.getElementById('mute');

/* ---------------------------
* Definición de constantes
* ---------------------------- */
const initialWidth = videoPlayer.width;
const widthPortion = initialWidth * 0.05;



document.addEventListener("DOMContentLoaded", function(event) {

    // Ejecuta la función playPause al presionar el botón
    btnPlayPause.addEventListener('click', playPause);

    // Ejecuta la función playPause al hacer click en el vídeo
    videoPlayer.addEventListener('click', playPause);

    // Ejecuta la función escala en el botón en el que se ha hecho click de los de la clase zoom
    btnsZoom.forEach(btn => btn.addEventListener('click', escala));    

    // Llama a la función changeVar para el input de todos los que hay sobre el que se haya escrito un nuevo valor
    inputsRange.forEach(i => i.addEventListener('input', () => changeVar(i)));
    
    // Cambia el valor del volumen del vídeo y ejecuta la función cambiaIconoVolumen cuando se escribe un nuevo valor en el input tipo range del volumen
    rangVolumen.addEventListener('input', function() {videoPlayer.volume = this.value});
    rangVolumen.addEventListener('input', () => cambiaIconoVolumen(rangVolumen));

    // Ejecuta la función mutear al presionar el botón mute
    btnMute.addEventListener('click', mutear);

});

/* ---------------------------
* Definición de funciones
* ---------------------------- */
// Para ponerl el vídeo en Play o Pausa
const playPause = () => {
    (videoPlayer.paused || videoPlayer.ended) ? videoPlayer.play() : videoPlayer.pause();
    iconsPlayPause.forEach(icon => icon.classList.toggle('oculto'));
}

// Cambia el tamaño del vídeo
const escala = function() {
    switch (this.dataset.type) {
        case 'bigger':
            videoPlayer.width += widthPortion;
            break;
            
        case 'smaller':
            videoPlayer.width -= (videoPlayer.width - widthPortion > 0) ? widthPortion : 0 ;
            break;
            
        case 'restore':
            videoPlayer.width = initialWidth;
            break;
            
        default:
            break;
    }
}

// Cambia el valor de la variable css --progressW para el input tipo rango que llama la función
const changeVar = function(elemento) {
    let range = elemento.max - elemento.min;
    let progressW = (elemento.value - elemento.min) / range*100 + '%';
    
    elemento.style.setProperty('--progressW', progressW);
}

// Cambia el icono del botón volumen
const cambiaIconoVolumen = function(elemento) {
    // Cambia el icono del botón mute
    let range = elemento.max - elemento.min;
    let valor = (elemento.value - elemento.min) / range * 100;

    switch (true) {
        case (valor == 0):
            iconsVolumen.forEach(icon => {
                icon.classList.remove('oculto');
                if (!icon.classList.contains('volume-off')) {
                    icon.classList.add('oculto')
                }
            });
            break;

        case (valor <= 50):
            iconsVolumen.forEach(icon => {
                icon.classList.remove('oculto');
                if (!icon.classList.contains('volume-low')) {
                    icon.classList.add('oculto')
                }
            });
            break;
            
        case (valor <= 100):
            iconsVolumen.forEach(icon => {
                icon.classList.remove('oculto');
                if (!icon.classList.contains('volume-high')) {
                    icon.classList.add('oculto')
                }
            });
            break;  
            
        default:
            break;
    }
}

// Cuando se presiona mute mutea o desmute al audio y cambia los iconos y input range de audio
const mutear = () => {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        rangVolumen.value = videoPlayer.volume;
        changeVar(rangVolumen);
        cambiaIconoVolumen(rangVolumen);
    } else {
        videoPlayer.muted = true;
        rangVolumen.value = 0;
        changeVar(rangVolumen);
        iconsVolumen.forEach(icon => {
            icon.classList.remove('oculto');
            if (!icon.classList.contains('volume-mute')) {
                icon.classList.add('oculto')
            }
        });
    }
}
