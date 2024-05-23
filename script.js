console.log("Hi, It's me Ronit :)");

let currentSong = new Audio();
let songs;
let currentFolder;

// Fetching songs
async function getSongs(folder) {
    currentFolder = folder;

    let a = await fetch(`${folder}`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchortags = div.getElementsByTagName("a");
    songs = [];

    for (let i = 0; i < anchortags.length; i++) {
        const element = anchortags[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${currentFolder}/`)[1]);
        }
    }

    // Listing song names in Your Library Playlist
    let listSong = document.querySelector(".list_song");

    listSong.innerHTML = "";

    for (const song of songs) {
        let onlyName = song.split(".mp3")[0].replaceAll("%20", " ");
        listSong.innerHTML = listSong.innerHTML + `
        <div class="body flex">
            <img class="invert" src="svg/music2.svg" alt="song">
            <div class="flex song_name">${onlyName}</div>
        </div>
        `
    }

    // Play the exact song when it's clicked
    Array.from(document.getElementsByClassName("song_name")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.innerHTML.trim());
        })
    })

    return songs;
}

// Playing music
const playMusic = (track, pause = false) => {
    currentSong.src = (`/${currentFolder}/` + track + ".mp3");
    if (!pause) { // To play a song just clicking on play button for the 1st time without selecting any song
        currentSong.play();
    }
    play.src = "svg/pause.svg";
    song_title.innerHTML = track;
}

// Converting durations to proper format
function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    let minutesStr = String(minutes).padStart(2, '0');
    let secondsStr = String(remainingSeconds).padStart(2, '0');

    return minutesStr + ':' + secondsStr;
}

// Displaying albums dynamically
async function displayAlbums() {
    let a = await fetch(`songs`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchortags = div.getElementsByTagName("a");

    let array = Array.from(anchortags)

    let songContainer = document.querySelector(".songs")

    for (let i = 0; i < array.length; i++) {

        let e = array[i]

        if (e.href.includes("songs")) {
            let folder = e.href.split("/").slice(-2)[0];

            // Fetching metadata from song folder's song_info.json
            let a = await fetch(`songs/${folder}/song_info.json`)
            let response = await a.json()

            songContainer.innerHTML += `
            <div data-folder="${folder}" class="song_card_container flex">

                <div class="image flex_center smooth_transition">
                    <img src="svg/music.svg" alt="song">
                    <div class="play_button"><img src="svg/play_button.svg" alt="play"></div>
                </div>

                <div class="">${response.title}</div>
                <div class="">${response.desc}</div>
            </div>
        `

        }
    }

    // Load songs in the library when one of song card is clicked
    let songCards = Array.from(document.getElementsByClassName("song_card_container"))
    songCards.forEach((e) => {
        e.addEventListener("click", async (item) => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

            // To play a song just clicking on play button for the 1st time without selecting any song
            let firstSong = songs[0].split(".mp3")[0].replaceAll("%20", " ");
            playMusic(firstSong)
            play.src = "svg/pause.svg";
        })
    })
}

// Main Function
async function main() {

    await getSongs(`songs/music`);

    // Changing Play/Pause svgs
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "svg/play.svg";
        }
    })

    // Updating Time Stamp
    currentSong.addEventListener("timeupdate", () => {

        song_duration.innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}`;

        musicPercentage = (currentSong.currentTime / currentSong.duration) * 100;
        circle.style.left = musicPercentage + "%";
    })


    // Working Seekbar
    let seekbar = document.querySelector(".seekbar");

    seekbar.addEventListener("click", (e) => {
        // console.log(e.target.getBoundingClientRect().width, e.offsetX);
        let positionPercentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        circle.style.left = positionPercentage + "%"

        currentSong.currentTime = (currentSong.duration * positionPercentage) / 100;
    })

    // Opening Hamburger
    let hamburger = document.querySelector(".hamburger")
    hamburger.addEventListener("click", () => {
        document.querySelector(".left_section").style.left = 0;
        document.querySelector(".hamburger2").style.display = "block"
    });

    // Closing Hamburger
    let hamburger2 = document.querySelector(".hamburger2")
    hamburger2.addEventListener("click", () => {
        document.querySelector(".left_section").style.left = -100 + "%";
        document.querySelector(".hamburger2").style.display = "none "

    });

    // Next Song
    next.addEventListener("click", (e) => {
        let indexOfCurrentSong = songs.indexOf(currentSong.src.split(`${currentFolder}/`)[1]);
        if ((indexOfCurrentSong + 1) < songs.length) {
            playMusic(songs[indexOfCurrentSong + 1].split(".mp3")[0].replaceAll("%20", " "));
        }

    })

    // Previous Song
    prev.addEventListener("click", (e) => {
        let indexOfCurrentSong = songs.indexOf(currentSong.src.split(`${currentFolder}/`)[1]);
        if ((indexOfCurrentSong + 1) >= 0) {
        }
        playMusic(songs[indexOfCurrentSong - 1].split(".mp3")[0].replaceAll("%20", " "));
    })

    // Volume Button
    volume_slider.addEventListener("click", (e) => {
        currentSong.volume = (parseInt(e.target.value) / 100);
    })



    // Show albums dynamically
    displayAlbums()

}

main();


