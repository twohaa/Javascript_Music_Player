const play = document.querySelector(".play"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  //
  trackImage = document.querySelector(".track-image"),
  title = document.querySelector(".title"),
  artist = document.querySelector(".artist"),
  //
  currentVolume = document.querySelector("#volume"),
  showVolume = document.querySelector("#show-volume"),
  volumeIcon = document.querySelector("#volume-icon"),
  //
  durationSlider = document.querySelector(".duration-slider"),
  volumeSlider = document.querySelector(".volume"),
  autoPlayBtn = document.querySelector(".play-all"),
  //
  trackCurrentTime = document.querySelector(".current-time"),
  trackDurationTime = document.querySelector(".duration-time"),
  //
  hamburger = document.querySelector(".fa-bars"),
  closeIcon = document.querySelector(".fa-times"),
  //
  musicPlaylist = document.querySelector(".music-playlist"),
  playlistDiv = document.querySelector(".playlist-div");
playlist = document.querySelector(".playlist");

//
let timer;
let autoplayy = 0;
let indexTrack = 0;
let songIsPlaying = false;
let track = document.createElement("audio");

//all event listener
play.addEventListener("click", justPlay);
next.addEventListener("click", nextSong);
prev.addEventListener("click", prevSong);
autoPlayBtn.addEventListener("click", autoPlayToggle);
volumeIcon.addEventListener("click", muteSound);
currentVolume.addEventListener("change", changeVolume);
durationSlider.addEventListener("change", changeDuration);
track.addEventListener("timeupdate", songTimeUpdate);
hamburger.addEventListener("click", showPlaylist);
closeIcon.addEventListener("click", hidePlaylist);

//load tracks
function loadTrack(indexTrack) {
  clearInterval(timer);
  resetSlider();

  track.src = trackList[indexTrack].path;
  trackImage.src = trackList[indexTrack].img;
  title.innerHTML = trackList[indexTrack].name;
  artist.innerHTML = trackList[indexTrack].singer;
  track.load();

  timer = setInterval(updateSlider, 1000);
}
loadTrack(indexTrack);

// play or pause song
function justPlay() {
  if (songIsPlaying == false) {
    playSong();
  } else {
    pauseSong();
  }
}
//Play song
function playSong() {
  track.play();
  songIsPlaying = true;
  play.innerHTML = '<i class="fas fa-pause"></i>';
}
//pause song
function pauseSong() {
  track.pause();
  songIsPlaying = false;
  play.innerHTML = '<i class="fas fa-play"></i>';
}
//next song
function nextSong() {
  if (indexTrack < trackList.length - 1) {
    indexTrack++;
    loadTrack(indexTrack);
    playSong();
  } else {
    indexTrack = 0;
    loadTrack(indexTrack);
    playSong();
  }
}
//prev song
function prevSong() {
  if (indexTrack > 0) {
    indexTrack--;
    loadTrack(indexTrack);
    playSong();
  } else {
    indexTrack = trackList.length - 1;
    loadTrack(indexTrack);
    playSong();
  }
}
//Mute sound
function muteSound() {
  track.volume = 0;
  showVolume.innerHTML = 0;
  currentVolume.value = 0;
}
//change volume
function changeVolume() {
  showVolume.value = currentVolume.value;
  track.volume = currentVolume.value / 100;
}
//change duration slider
function changeDuration() {
  let sliderPosition = track.duration * (durationSlider.value / 100);
  track.currentTime = sliderPosition;
}

//auto play
function autoPlayToggle() {
  if (autoplayy == 0) {
    autoplayy = 1;
    autoPlayBtn.style.background = "#db6400";
  } else {
    autoplayy = 0;
    autoPlayBtn.style.background = "#ccc";
  }
}

//reset slider
function resetSlider() {
  durationSlider.value = 0;
}
//update slider
function updateSlider() {
  let position = 0;
  if (!isNaN(track.duration)) {
    position = track.currentTime * (100 / track.duration);
    durationSlider.value = position;
  }

  if (track.ended) {
    play.innerHTML = '<i class="fas fa-play"></i>';

    if (autoplayy == 1 && indexTrack < trackList.length - 1) {
      indexTrack++;
      loadTrack(indexTrack);
      playSong();
    } else if (autoplayy == 1 && indexTrack == trackList.length - 1) {
      indexTrack = 0;
      loadTrack(indexTrack);
      playSong();
    }
  }
}

//update current song time
function songTimeUpdate() {
  if (track.duration) {
    let curmins = Math.floor(track.currentTime / 60);
    let cursecs = Math.floor(track.currentTime - curmins * 60);

    let durmins = Math.floor(track.duration / 60);
    let dursecs = Math.floor(track.duration - durmins * 60);

    if (dursecs < 10) {
      dursecs = "0" + dursecs;
    }
    if (durmins < 10) {
      durmins = "0" + durmins;
    }
    if (curmins < 10) {
      curmins = "0" + curmins;
    }
    if (cursecs < 10) {
      cursecs = "0" + cursecs;
    }

    trackCurrentTime.innerHTML = curmins + ":" + cursecs;
    trackDurationTime.innerHTML = durmins + ":" + dursecs;
  } else {
    trackCurrentTime.innerHTML = "00" + ":" + "00";
    trackDurationTime.innerHTML = "00" + ":" + "00";
  }
}

//show playlist
function showPlaylist() {
  musicPlaylist.style.transform = "translateX(0)";
}
//hide playlist
function hidePlaylist() {
  musicPlaylist.style.transform = "translateX(-100%)";
}
//Display tracks in playlist
let counter = 1;
function displayTracks() {
  for (let i = 0; i < trackList.length; i++) {
    // console.log(trackList[i].name)
    let div = document.createElement("div");
    div.classList.add("playlist");
    div.innerHTML = `
      <span class="song-index">${counter++}</span>
      <p class="single-song">${trackList[i].name}</p>
    `;
    playlistDiv.appendChild(div);
  }
  playFormPlaylist();
}
displayTracks();

//play song form playlist
function playFormPlaylist() {
  playlistDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("single-song")) {
      // alert(e.target.innerHTML)
      const indexNum = trackList.findIndex((item, index) => {
        if (item.name === e.target.innerHTML) {
          return true;
        }
      });
      loadTrack(indexNum);
      playSong();
      hidePlaylist();
    }
  });
}
