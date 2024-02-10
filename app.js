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


let playbtn = document.querySelector('.play-btn');


const music = document.getElementById('audio');


// Progress Bar
const seekBar = document.querySelector('.sleek-bar')

// Volume Bar

// Titles and Images
const currentCoverImage = document.getElementById('current-cover-img');
const currentSongTitle = document.getElementById('current-song-title');
const currentArtist = document.getElementById('current-song artist');
const playListImage = document.querySelector('.playlist-card-img');
const playListSongTitle = document.querySelector('.song-title');
const playListArtist = document.querySelector('.artist');

const playListInfo = document.querySelectorAll('.playlist-info');


// Songs
let songs;
let songIndex = 0;
let musicMaxPercentage;

// Check clicked
let clicked = false;
// Shuffled Song
let shuffledsongs;






// // FUNCTIONS //


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


// Update UI with current Song
const loadSong = (song) => {
    currentSongTitle.innerText = song.name;
    music.src = `${song.path}`;
    currentCoverImage.setAttribute('src', song.cover);
    console.log(currentCoverImage);
}

// Check AudioPlaying
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
    await fetch('audio.json')
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
            console.log("Done")
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

// Reapeat Music Loop
const enableLoop = () => {
    repeatBtn.classList.toggle('shuffle-background');
    if(repeatBtn.classList.contains('shuffle-background')) {
        // clicked = true;
        music.loop = true;
        music.load;
    } else {
         music.loop = false;
    }   
}

// Update Next Music to Play After Current Finishes
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

// Update Progress Bar Width
const updateProgressBar = () => {
    seekBar.max = music.duration;
    seekBar.value = music.currentTime;
    musicMaxPercentage = Math.round((seekBar.value/seekBar.max)*100);
    seekBar.style.background = `linear-gradient(to right, #FACD66 ${musicMaxPercentage}%, rgba(255, 255, 255, 0.04) ${musicMaxPercentage}%)`;
    updateMusic();
}

// ControlMusic Volume
const controlVolume = () => {
    music.volume = volumeSlider.value;
    if(volumeSlider.value == 0) {
        hideVolume.classList.add('display-vol');
    } else {
        hideVolume.classList.remove('display-vol');
    }
}

const muteVolume = () => {
    volumeSlider.value = 1;
    hideVolume.classList.toggle('display-vol');
    if (hideVolume.classList.contains('display-vol')) {
        volumeSlider.value = 0;
    }
    controlVolume();
}

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////
////// EVENT LISTENERS

// Play, prev, next , shuffle, repeatmusic
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

window.addEventListener('load', () => {
    retrieveSongsFromServer();
})