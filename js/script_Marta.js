// Seleccionamos los elementos
const video = document.getElementById('videoPlayer');
const videoControls = document.getElementById('video-controls');
const playButton = document.getElementById('play');
const playbackIcons = document.querySelectorAll('.playback-icons use');
const playbackAnimation = document.getElementById('playback-animation');
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use');
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');
const speedButton = document.querySelector('.speed-button');
const speedMenu = document.querySelector('.speed-menu');
const speedOptions = document.querySelectorAll('.speed-menu .f-menu-option');
const subsButton = document.querySelector('.subs-button');
const subsMenu = document.querySelector('.subs-menu');
const currentTitle = document.querySelector('#current-title span');
const titlesMenu = document.querySelector('.titles-menu');
const canvas = document.getElementById('frame');

const videoList = [
    "videos/streaming",
    "videos/arboles1",
    "videos/arboles2",
    "videos/rio",
    "videos/fuente"
];
let videoPlayingIndex = 0;
let selectedSubs = "es"; 

/*** Preparación de opciones de vídeos ***/

for (let i=0; i < videoList.length; i++){
    let node = document.createElement("div");
    node.classList.add('f-menu-option');
    node.textContent = videoList[i];
    node.onclick = () => {
      switchVideos({videoIndex: i});
      toggleTitlesMenu();
    }
    titlesMenu.appendChild(node);
}
/******************************************/

// Si el navegador tiene compatibilidad con el vídeo, 
// activamos los controles personalizados
const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
    video.controls = false;
    videoControls.classList.remove('hidden');
}

// togglePlay cambia el estado de reproducción del vídeo
// Si el vídeo está parado o ha acabado, se pone en play
// sino, se pausa
function togglePlay() {
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
}
playButton.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

// updatePlayButton actualiza el icono y el tooltip del playback
// dependiendo del estado de playback
function updatePlayButton() {
    playbackIcons.forEach(icon => icon.classList.toggle('hidden'));

    if (video.paused) {
        playButton.setAttribute('data-title', 'Play (k)')
    } else {
        playButton.setAttribute('data-title', 'Pause (k)')
    }
}
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);

// animatePlayback muestra una animación
// cuando se pausa o se resume el vídeo
function animatePlayback() {
  playbackAnimation.animate([
    {
      opacity: 1,
      transform: "scale(1)",
    },
    {
      opacity: 0,
      transform: "scale(1.3)",
    }], {
    duration: 500,
  });
}
video.addEventListener('click', animatePlayback);


// formatTime convierte un intervalo de tiempo en segundos
// a minutos y segundos
function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
};


// initializeVideo configura la duración del vídeo
// y el valor máximo de la barra de progreso 
function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);

  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
video.addEventListener('loadedmetadata', initializeVideo);

// updateTimeElapsed indica cuanto tiempo del vídeo
// ha pasado
function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
video.addEventListener('timeupdate', updateTimeElapsed);

// updateProgress indica en qué punto del vídeo
// se está actualizando la barra de progreso
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}
video.addEventListener('timeupdate', updateProgress);

// updateSeekTooltip usa la posición del cursor
// en la barra de progreso para calcular aproximadamente 
// en qué punto del vídeo el usuario saltará si hace click
function updateSeekTooltip(event) {
  const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
  seek.setAttribute('data-seek', skipTo)
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${event.pageX - rect.left}px`;
}
seek.addEventListener('mousemove', updateSeekTooltip);

// skipAhead salta a un punto diferente en el vídeo cuando
// se clicka a la barra de progreso
function skipAhead(event) {
  const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}
seek.addEventListener('input', skipAhead);

// updateVolume actuliza el volumen del vídeo
// i desactiva el estado muteado si está activo 
function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }

  video.volume = volume.value;
}
volume.addEventListener('input', updateVolume);

// updateVolumeIcon actualiza el icono del volumen
// para reflejar el volumen del vídeo
function updateVolumeIcon() {
  volumeIcons.forEach(icon => {
    icon.classList.add('hidden');
  });

  volumeButton.setAttribute('data-title', 'Mute (m)')

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove('hidden');
    volumeButton.setAttribute('data-title', 'Unmute (m)')
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove('hidden');
  } else {
    volumeHigh.classList.remove('hidden');
  }
}
video.addEventListener('volumechange', updateVolumeIcon);

// toggleMute mutea o desmutea el vídeo
// Cúando se desmutea, el volumen retorna al valor
// que tenía justo antes de mutearse
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute('data-volume', volume.value);
    volume.value = 0;
  } else {
    volume.value = volume.dataset.volume;
  }
}
volumeButton.addEventListener('click', toggleMute);

// toggleSpeedMenu muestra el menú de opciones de velocidades
// si está escondido, y si está visible lo esconde
function toggleSpeedMenu() {
    speedMenu.classList.toggle('hidden');
}
speedButton.addEventListener('click', toggleSpeedMenu);

// updateSpeedButton cambia el valor que muestra el 
// botón de velocidad
function updateSpeedButton(e){
    let speed = e.target.getAttribute('data-speed');
    speedButton.innerHTML =  '<span>×' + speed + '</span>';
}

// updateSpeed actualiza la velocidad del vídeo
function updateSpeed(e){
    let speed = e.target.getAttribute('data-speed');
    video.playbackRate  = speed;
}

speedOptions.forEach(option => {
    option.addEventListener('click', updateSpeed);
    option.addEventListener('click',updateSpeedButton);
    option.addEventListener('click', toggleSpeedMenu);
});


// Añadimos las opciones de subtítulos al menú
for (var i = 0; i < video.textTracks.length; i++) {
    // Añadimos los posibles subtítulos
    var curTrack = video.textTracks[i];
    var trackOpt = document.createElement('div');
    trackOpt.classList.add('f-menu-option');
    trackOpt.setAttribute('data-language', curTrack.language);
    trackOpt.textContent = curTrack.label;
    subsMenu.appendChild(trackOpt);

}
const subsOptions = document.querySelectorAll('.subs-menu .f-menu-option');

// hideTracks esconde los subtítulos
function hideTracks() {
    for (var i = 0; i < video.textTracks.length; i++) {
        console.log('hidding track',video.textTracks[i] );
        video.textTracks[i].mode = 'hidden';
    }
}

// trackChange coge un evento y cambia los subtítulos
// a la lengua asociada a la target de ese evento
function trackChange(e, lang) {
    let language = e ?  e.target.getAttribute('data-language') : lang;
    console.log('changing to ', language);
    if(language === 'off') {
        hideTracks();
    } else {
        hideTracks();

        for (var i = 0; i < video.textTracks.length; i++) {   
            if(video.textTracks[i].language === language) {
                video.textTracks[i].mode = 'showing';
            }
        }
    }
    selectedSubs = language; 
}

// toggleSpeedMenu muestra el menú de opciones de velocidades
// si está escondido, y si está visible lo esconde
function toggleSubsMenu() {
    console.log('toggling subs menu')
    subsMenu.classList.toggle('hidden');
}
subsButton.addEventListener('click', toggleSubsMenu);


subsOptions.forEach(option => {
    console.log('option', option);
    option.addEventListener('click', trackChange );
    option.addEventListener('click', toggleSubsMenu );
});



/*** Selector de vídeo ***/
function switchVideos(config){
    console.log('switching video with ', config, 'when in ', videoPlayingIndex);
    const {direction, videoIndex} = config;
    
    // cambios usando dirección
    if (direction){
        if (direction === "forward") {
            // si ya estamos al último video, salimos de la función
            if (videoPlayingIndex === videoList.length-1) 
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
    } else if (videoIndex || videoIndex === 0){
        // si ya estamos al video del índice deseado, salimos de la función
        if (videoIndex === videoPlayingIndex)
            return
        else 
            videoPlayingIndex = videoIndex
    }


    video1.src = videoList[videoPlayingIndex] + ".mp4";
    video2.src = videoList[videoPlayingIndex] + ".ogv";
    // esSubs.src = "subs/" + videoList[videoPlayingIndex] + "-es.vtt";
    // enSubs.src = "subs/" + videoList[videoPlayingIndex] + "-en.vtt";
    video.pause();
    video.load();
    video.play();
    currentTitle.innerHTML = videoList[videoPlayingIndex];
    trackChange(null, selectedSubs);
  
}
playPrev.addEventListener("click", ()=> switchVideos({direction:'backwards'}));
playNext.addEventListener("click", ()=> switchVideos({direction:'forward'}));
/********************************/

// toggleTitlesMenu muestra el menú de opciones de vídeos
// si está escondido, y si está visible lo esconde
function toggleTitlesMenu() {
    console.log('toggling titles menu')
    titlesMenu.classList.toggle('hidden');
}
currentTitle.addEventListener('click', toggleTitlesMenu);

/*** Cambio de medidas del vídeo ***/
const widthPortion = 720*0.05; 
function scale(type){
    // cambios a menor
    if (type === "smaller"){
        if (video.width - widthPortion > 0){
            video.width -= widthPortion;
            console.log('entra a smaller');
        }

    // cambios a mayor
    } else if (type === "bigger") {
        video.width += widthPortion;
        console.log('entra a bigger');
    }

    canvas.width = video.width;
    canvas.height = video.width * 405 / 720;
}
/*********************************/

/*** Captura de instantánea ***/
function takeSnapShot(){
    let canvasContext = frame.getContext("2d");
    canvasContext.drawImage(video, 0, 0, video.width, video.width * 405 / 720);

    var canvas = document.getElementById("frame");
    var anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "IMAGE.PNG";
    anchor.click();
    //document.removeChild(docume.firstElementChild);
}
/*****************************/    