'use strict'


//// QUERY SELECTORS ////
// Music Player
const playHldrs = document.querySelectorAll('.ply-hld')
const playBtn = document.querySelectorAll('.play-btn');
const pauseBtns = document.querySelectorAll('.pause-btn');
const forwardBtn = document.querySelectorAll('.next-btn');
const backwardBtn = document.querySelector('.prev-btn');
const shuffleBtn = document.querySelector('.shuffle-btn');
const repeatBtn = document.querySelector('.repeat-btn');
const volumeBtn = document.querySelector('.snd-icon');
const volumeSlider = document.querySelector('.volume-slider');
const hideVolume = document.querySelector('.sound-sh');

const loadPlaytunes = document.getElementById('playtunes');

const music = document.getElementById('audio');

let playbtn = document.querySelector('.play-btn');




// Progress Bar
const seekBar = document.querySelector('.sleek-bar')

// Titles and Images
const currentCoverImage = document.getElementById('current-cover-img');
const currentSongTitle = document.getElementById('current-song-title');
const currentArtist = document.getElementById('current-song artist');
const playListImage = document.querySelector('.playlist-card-img');
const playListSongTitle = document.querySelector('.song-title');
const playListArtist = document.querySelector('.artist');
const playListInfo = document.querySelectorAll('.playlist-info');
const nathTunes = document.querySelector('.tune-inner2');
// const currentMusicTime = document.querySelector('.current-time');


// Songs
let songs;
let songIndex = 0;
let musicMaxPercentage;

// Check clicked
let clicked = false;
// Shuffled Song
let shuffledsongs;






// ///////// FUNCTIONS //


// Update UI with all music
const displayAll = (data, index) => {
    playListInfo.forEach((playlist) => {
        const musicHolder = document.createElement('div');
        musicHolder.classList = 'music-holder mus';

        musicHolder.innerHTML = `
            <img src="${data.cover}" alt="${data.name}">
            <h3 class="song-title playlist-card-title">${data.name}</h3>
            <p class="artist playlist-card-artist">${data.artist}</p>
        `
        playlist.append(musicHolder);

        musicHolder.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex])
            playAudio();
        })
    })
}


// Update Index UI with current Song
const loadSong = (song) => {
    currentSongTitle.innerText = song.name;
    music.src = `${song.path}`;
    currentCoverImage.setAttribute('src', song.cover);
}

// Check if Audio is Playing
const isAudioPlaying = () => {
    return playbtn.classList.contains("hide");
}

// Play Current song
const playAudio = () => {
    playBtn.forEach((playbtn) => {
        playbtn.classList.add('hide')
    })
    pauseBtns.forEach((pausebtn) => {
        pausebtn.classList.remove('hide');
    })
    music.play();
}

// Pause Current song
const pauseAudio = () => {
    playBtn.forEach((playbtn) => {
        playbtn.classList.remove('hide')
    })
    pauseBtns.forEach((pausebtn) => {
        pausebtn.classList.add('hide');
    })
    music.pause();
}

//LOAD SONGS FROM "server"
async function retrieveSongsFromServer() {
    await fetch('/audio.json')
        .then((response) => {
            if(!response.ok){
                throw new Error('Network Response was not okay');
            }
            return response.json();
            }
        )
        .then((data) => {
            songs = data.songs;
            songs.forEach(displayAll);
            loadSong(songs[songIndex]);
            nathSongs(songs);
        })
        .catch((error) => {
            console.error("There has been an error", error);
        })
}


// Reset Sleek
const resetSleek = () => {
    musicMaxPercentage = Math.round(0 * 100);
    seekBar.style.background = `linear-gradient(to right, #FACD66 ${musicMaxPercentage}%, rgba(255, 255, 255, 0.04) ${musicMaxPercentage}%)`;
    isAudioPlaying() === true ? playAudio() : pauseAudio();
}

// Load up Previous Song
const prevSong = () => {
    songIndex -= 1;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    checkShuffle();
    resetSleek();
}


// Load up Next Song
const nextSong = () => {
    songIndex += 1;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    checkShuffle();
    resetSleek();
}

// Load up Shuffled Song
const shuffleSong = () => {
    shuffledsongs = songs.slice();
    for (let i = shuffledsongs.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random()*(i + 1));
        [shuffledsongs[i], shuffledsongs[j]] = [shuffledsongs[j], shuffledsongs[i]];
    }
    shuffleBtn.classList.toggle('shuffle-background');
    if(shuffleBtn.classList.contains('shuffle-background')) {
        clicked = true;
    } else {
        clicked = false
    }
    return shuffledsongs;
}

// Check if Shuffled is click
const checkShuffle = () => {
    if(clicked === true) {
        loadSong(shuffledsongs[songIndex]);
    }
    else {
        loadSong(songs[songIndex]);
    }
}

// Repeat Music Loop
const enableLoop = () => {
    repeatBtn.classList.toggle('shuffle-background');
    if(repeatBtn.classList.contains('shuffle-background')) {
        music.loop = true;
        music.load;
    } else {
         music.loop = false;
    }   
}

// Update Next Music to Play After Current music Finishes
const updateMusic = () => {
    let end = music.duration;
    let now = music.currentTime;
    if (end <= now) {
        songIndex += 1;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        checkShuffle();
        music.play();
    }
    
}

// Update Progress Bar Width as music plays
const updateProgressBar = () => {
    seekBar.max = music.duration;
    seekBar.value = music.currentTime;
    musicMaxPercentage = Math.round((seekBar.value/seekBar.max)*100);
    seekBar.style.background = `linear-gradient(to right, #FACD66 ${musicMaxPercentage}%, rgba(255, 255, 255, 0.04) ${musicMaxPercentage}%)`;
    updateMusic();
}

// Control Music Volume
const controlVolume = () => {
    music.volume = volumeSlider.value;
    if(volumeSlider.value == 0) {
        hideVolume.classList.add('display-vol');
    } else {
        hideVolume.classList.remove('display-vol');
    }
}
// Mute Volume
const muteVolume = () => {
    volumeSlider.value = 1;
    hideVolume.classList.toggle('display-vol');
    if (hideVolume.classList.contains('display-vol')) {
        volumeSlider.value = 0;
    }
    controlVolume();
}

const nathSongs = (songs) => {
    for (let [key, index] in songs) {
        if(songs[key].artist == 'Nathaniel Bassey') {
            let song = songs[key];

            music.src = song.path
            const nathMusic = document.createElement('div');
            nathMusic.classList = 'ms';

            const nathDetail = document.createElement('div');
            nathDetail.classList = 'invisible';

            const nathDetailLeft = document.createElement('div');
            nathDetailLeft.classList = 'ms-left';
            nathDetailLeft.innerHTML = `
                <img src="${song.cover}" alt="">
                <div class="lv">
                    <img src="/images/tunes-img/Stroke-1.png" alt="">
                    <img src="/images/tunes-img/Stroke-3.png" alt="">
                </div>
            `

            const nathDetailCenter = document.createElement('div');
            nathDetailCenter.classList = 'ms-center';
            nathDetailCenter.innerHTML = `
                    <h3 class="nath-click">${song.name} ~ ${song.artist}</h3>
                    <p>Single</p>
            `

            nathDetail.append(nathDetailLeft);
            nathDetail.append(nathDetailCenter);

            const nathRight = document.createElement('div');
            nathRight.classList = 'ms-right';
            nathRight.innerHTML = `
                <div class="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <span class='current-time'></span>
            `

            nathMusic.append(nathDetail);
            nathMusic.append(nathRight);

            nathTunes.append(nathMusic);

            const crntTime = document.querySelectorAll('.current-time');
            const nathCurrentMusics = document.querySelectorAll('.nath-click');

            setTimeout(() => {
                crntTime.forEach((timing) => {
                    timing.innerHTML = formatTime(music.duration);
                })
            }, 300);
            

            nathDetailCenter.addEventListener('click', () => {
                console.log(song.path)
                console.log(songs[key])
                loadSong(song);
                playAudio();
            })
        }
    }
}

let formatTime = (time) => {
    let min = Math.floor(time / 60);
    if(min < 10){
        min = `0` + min;
    }

    let sec = Math.floor(time % 60);
    if(sec < 10){
        sec = `0` + sec;
    }

    return `${min} : ${sec}`;
}
    



//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////
////// EVENT LISTENERS

// Play, prev, next , shuffle, repeat
playHldrs.forEach(play => {
    play.addEventListener('click', () => {
        isAudioPlaying() ? pauseAudio() : playAudio();
    })
})
backwardBtn.addEventListener('click', prevSong);
forwardBtn.forEach((forward) => {
    forward.addEventListener('click', nextSong);
})
shuffleBtn.addEventListener('click', shuffleSong);
repeatBtn.addEventListener('click', enableLoop);

// Progress Bar Update
music.addEventListener('timeupdate', updateProgressBar);

seekBar.oninput = function () {
    music.currentTime = seekBar.value;
}

// Control Volume Btns
volumeBtn.addEventListener('click', muteVolume)
volumeSlider.addEventListener('input', controlVolume)

// loadPlaytunes.addEventListener('click', nathSongs)


// Fetch Music on load
window.addEventListener('load', () => {
    retrieveSongsFromServer();
})