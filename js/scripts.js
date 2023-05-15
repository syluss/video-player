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
const duration = document.getElementById('duration');
const timeLeft = document.getElementById('time-left');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const snapshot = document.getElementById('snapshot');
const canvas = document.getElementById('frame');
const currentTitle = document.querySelector('#current-title span');
const titlesMenu = document.querySelector('.titles-menu');
const speedButton = document.getElementById('speed-button');
const speedMenu = document.querySelector('.speed-menu');
const speedOptions = document.querySelectorAll('.speed-menu .f-menu-option');
const subsButton = document.getElementById('subs-button');
const subsMenu = document.querySelector('.subs-menu');
const subsOptions = document.querySelectorAll('.subs-menu .f-menu-option');


/* ---------------------------
* Definición de constantes y variables
* ---------------------------- */
const initialWidth = videoPlayer.width;
const widthPortion = initialWidth * 0.05;
const videoList = [
    'streaming',
    'arboles1',
    'arboles2',
    'rio',
    'fuente'
];
let videoPlayingIndex = 0;
let selectedSubs = "es";



/* ---------------------------
* Definición de eventos
* ---------------------------- */
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

    // Ejecuta la función inicializeVideo cuando se cargan los metadatos del video
    videoPlayer.addEventListener('loadedmetadata', initializeVideo);

    // Ejecuta la función updateTimeLeft cuando se actualiza el tiempo visto del vídeo
    videoPlayer.addEventListener('timeupdate', updateTimeLeft);

    // Ejecuta updateProgress para actualizar la barra de progreso
    videoPlayer.addEventListener('timeupdate', updateProgress);

    // Ejecuta updateSeekTooltip cuando se mueve el ratón por encima del seek
    seek.addEventListener('mousemove', updateSeekTooltip);

    // Pone visible el Tooltip en el hover del seek
    seek.addEventListener('mouseover', () => seekTooltip.style.display = 'block');

    // Pone oculto el Tooltip en el hover del seek
    seek.addEventListener('mouseout', () => seekTooltip.style.display = 'none');

    // Ejecuta skipAhead cuando se clica en la barra de progreso
    seek.addEventListener('input', skipAhead);

    // Ejecuta takeSmapShot cuando se pulsa el botón de captura
    snapshot.addEventListener('click', takeSnapShot);



    // Ejecuta toggleSpeedMenu para ver el menú al pulsar sobre el botón velocidad
    speedButton.addEventListener('click', toggleSpeedMenu);

    // Ejecuta las funciones para actualizar la velocidad del vídeo, el valor de velocidad mostrado y oculta el menú
    speedOptions.forEach(option => {
        option.addEventListener('click', updateSpeed);
        option.addEventListener('click', updateSpeedButton);
        option.addEventListener('click', toggleSpeedMenu);
    });

    // Ejecuta toggleSubsMenu para ver el menú al pulsar sobre el botón velocidad
    subsButton.addEventListener('click', toggleSubsMenu);

    // Ejecuta las funciones para actualizar la velocidad del vídeo, el valor de velocidad mostrado y oculta el menú
    subsOptions.forEach(option => {
        option.addEventListener('click', updateSubs);
        option.addEventListener('click', toggleSubsMenu);
    });


    // oculta los menús flotantes al pulsar en otro sitio que no sea el botón
    document.body.addEventListener('click', (e) => {
        if (e.target !== currentTitle) {titlesMenu.classList.add('oculto')};
        if (e.target !== speedButton) {speedMenu.classList.add('oculto')};
        if (e.target !== subsButton) {subsMenu.classList.add('oculto')};
    });

    
    



    /*** Preparación de opciones de vídeos ***/
    video1.src = `videos/${videoList[videoPlayingIndex]}.mp4`;
    video2.src = `videos/${videoList[videoPlayingIndex]}.ogg`;
    videoPlayer.load();
    currentTitle.innerHTML = videoList[videoPlayingIndex];

    for (let i = 0; i < videoList.length; i++) {
        let node = document.createElement("div");
        node.classList.add('f-menu-option');
        node.textContent = videoList[i];
        node.onclick = () => {
            switchVideos({ videoIndex: i });
            toggleTitlesMenu();
        }
        titlesMenu.appendChild(node);
    }

    /*** Preparación de opciones de subtítulos ***/
    for (var i = 0; i < video.textTracks.length; i++) {
        // Añadimos los posibles subtítulos
        var curTrack = video.textTracks[i];
        var trackOpt = document.createElement('div');
        trackOpt.classList.add('f-menu-option');
        trackOpt.setAttribute('data-language', curTrack.language);
        trackOpt.textContent = curTrack.label;
        subsMenu.appendChild(trackOpt);

    }



    /*** Selector de vídeo ***/
    function switchVideos(config) {
        console.log('switching video with ', config, 'when in ', videoPlayingIndex);
        console.log('el video es ', video1);

        const { direction, videoIndex } = config;

        console.log('direction es ', direction);
        console.log('videoIndex es ', videoIndex);


        // cambios usando dirección
        if (direction) {
            if (direction === "forward") {
                // si ya estamos al último video, salimos de la función
                if (videoPlayingIndex === videoList.length - 1)
                    return
                else
                    videoPlayingIndex++

            } else if (direction === "backwards") {
                // si ya estamos al primer video, salimos de la función
                if (videoPlayingIndex === 0)
                    return
                else
                    videoPlayingIndex--
            }

            // cambios usando índice
        } else if (videoIndex || videoIndex === 0) {
            // si ya estamos al video del índice deseado, salimos de la función
            if (videoIndex === videoPlayingIndex)
                return
            else
                videoPlayingIndex = videoIndex
        }


        video1.src = `videos/${videoList[videoPlayingIndex]}.mp4`;
        video2.src = `videos/${videoList[videoPlayingIndex]}.ogg`;
        // esSubs.src = "subs/" + videoList[videoPlayingIndex] + "-es.vtt";
        // enSubs.src = "subs/" + videoList[videoPlayingIndex] + "-en.vtt";
        videoPlayer.pause();
        videoPlayer.load();
        videoPlayer.play();
        currentTitle.innerHTML = videoList[videoPlayingIndex];
        // trackChange(null, selectedSubs);

    }
    playPrev.addEventListener("click", () => switchVideos({ direction: 'backwards' }));
    playNext.addEventListener("click", () => switchVideos({ direction: 'forward' }));
    /********************************/

    // toggleTitlesMenu muestra el menú de opciones de vídeos
    // si está escondido, y si está visible lo esconde
    function toggleTitlesMenu() {
        titlesMenu.classList.toggle('oculto');
    }
    currentTitle.addEventListener('click', toggleTitlesMenu);




    

    

    
    







}); // Final DOMContentLoaded

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

// Convierte un intervalo de tiempo en segundos a minutos y segundos
const formatTime = (timeInSeconds) => {
    let result = new Date(timeInSeconds * 1000).toISOString().substring(11, 11+8);

    return {
        minutes: result.substring(3, 3+2),
        seconds: result.substring(6, 6+2),
    };
}

// Configura la duración del vídeo y el valor máximo de la barra de progreso
const initializeVideo = () => {
    const videoDuration = Math.round(videoPlayer.duration);
    seek.setAttribute('max', videoDuration);
    
    const time = formatTime(videoDuration);
    // duration.innerText = `${time.minutes}:${time.seconds}`;
    // duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
    timeLeft.innerText = `-${time.minutes}:${time.seconds}`;
    timeLeft.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}

// Indica cuanto tiempo del vídeo ha pasado
const updateTimeLeft = () => {
    const time = formatTime(seek.max - Math.round(videoPlayer.currentTime));
    timeLeft.innerText = `-${time.minutes}:${time.seconds}`;
    timeLeft.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)

}

// Indica en qué punto del vídeo se está actualizando la barra de progreso
const updateProgress = () => {
    seek.value = Math.floor(videoPlayer.currentTime);
    changeVar(seek);
}

// Usa la posición del cursor en la barra de progreso para calcular aproximadamente 
// en qué punto del vídeo el usuario saltará si hace click
const updateSeekTooltip = (event) => {
    const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
    seek.setAttribute('data-seek', skipTo)
    const t = formatTime(skipTo);
    seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
    const rect = videoPlayer.getBoundingClientRect();
    seekTooltip.style.left = `${event.pageX - rect.left}px`;
    // Oculta el Tooltip si estamos a menos de 0 o a más de la duración del vídeo
    (skipTo < seek.min || skipTo > seek.max) ? seekTooltip.style.display = 'none' : seekTooltip.style.display = 'block';
}

// Salta a un punto diferente en el vídeo cuando se clicka a la barra de progreso
const skipAhead = (event) => {
    const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
    videoPlayer.currentTime = skipTo;
    seek.value = skipTo;
}

const takeSnapShot = () =>{
    let canvasContext = frame.getContext("2d");
    canvasContext.drawImage(videoPlayer, 0, 0, videoPlayer.width, videoPlayer.width * 405 / 720);

    const time = formatTime(Math.round(videoPlayer.currentTime));
    const canvas = document.getElementById("frame");
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `image_${time.minutes}.${time.seconds}.png`;
    anchor.click();
}




// Muestra el menú de opciones de velocidades si está escondido, y si no lo esconde
const toggleSpeedMenu = () => {
    speedMenu.classList.toggle('oculto');
}

// Cambia el valor que muestra el botón de velocidad
const updateSpeedButton = (e) => {
    let speed = e.target.getAttribute('data-speed');
    speedButton.innerHTML = speed;
}

// Actualiza la velocidad del vídeo
const updateSpeed = (e) => {
    let speed = e.target.getAttribute('data-speed');
    videoPlayer.playbackRate = speed;
}

// Muestra el menú de opciones de subtítulos si está escondido, y si no lo esconde
const toggleSubsMenu = () => {
    subsMenu.classList.toggle('oculto');
}

// Cambia los subtítulos a la lengua asociada a la target
const updateSubs = (e, lang) => {
    let language = e ?  e.target.getAttribute('data-language') : lang;
    console.log('changing to ', language);
    if(language === 'off') {
        hideTracks();
    } else {
        hideTracks();

        for (var i = 0; i < videoPlayer.textTracks.length; i++) {   
            if(videoPlayer.textTracks[i].language === language) {
                videoPlayer.textTracks[i].mode = 'showing';
            }
        }
    }
    selectedSubs = language;
}


// Esconde los subtítulos
const hideTracks = () => {
    for (var i = 0; i < videoPlayer.textTracks.length; i++) {
        console.log('hidding track',videoPlayer.textTracks[i] );
        videoPlayer.textTracks[i].mode = 'hidden';
    }
}