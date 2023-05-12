// Seleccionamos los elementos
const video = document.getElementById('video');
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

const videoList = [
    "arboles1",
    "arboles2",
    "rio",
    "fuente"
];
let videoPlayingIndex = 0;

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
    // Añadimos al select los posibles subtítulos
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
function trackChange(e) {
    let language = e.target.getAttribute('data-language');
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