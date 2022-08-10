const time = document.querySelector('.time')
const dateBox = document.querySelector('.date')
const greetingContainer = document.querySelector('.greeting-container');
const greeting = greetingContainer.querySelector('.greeting');
const greetingInput = greetingContainer.querySelector('input');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity')
const btnGenerationQuotes = document.querySelector('.change-quote');
const quoteBox = document.querySelector('.quote');
const author = document.querySelector('.author');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
let randomNum = generateRandomNumber(1, 20);



const audio = new Audio();
const btncontrolAudio = document.querySelector('.play');
const audioPlayer = document.querySelector('.player');
const btnPlayPrev = document.querySelector('.play-prev');
const btnPlayNext = document.querySelector('.play-next');
const playListBox = document.querySelector('.play-list');
const playControls = document.querySelector('.player-controls');
const playerCurrentTime = document.querySelector('.player__current-time');
const playerTotalTime = document.querySelector('.player__total-time');
const playerSlider = document.querySelector('.player__slider');
const payerNameSong = document.querySelector('.payer__name-song');
const volume = document.querySelector('.volume');

let isPlay = false;
let playNum = 0;

import playList from './playList.js';


window.addEventListener('beforeunload', () => {
    setLocalStorage('name', greetingInput.value)
});
window.addEventListener('load', getLocalStorage);
window.addEventListener('load', () => {
    getDataQuotes()
    showTime()
    getNameCity()
    randomNum = generateRandomNumber(1, 20);
    setBg()
    createListForSongs(playList);
});
city.addEventListener('change', getNameCity);
btnGenerationQuotes.addEventListener('click', () => {
    getDataQuotes()
});
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);
btncontrolAudio.addEventListener('click', playAudio);
btnPlayPrev.addEventListener('click', playPrev);
btnPlayNext.addEventListener('click', playNext);
audio.addEventListener('ended', playNext);
playerSlider.addEventListener('input', rewindAudio);
volume.addEventListener('click', turnVolume);



function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate("en-US")
    showGreeting("en-US", getTimeOfDay)
    setTimeout(showTime, 1000);
}

function showDate(lang = "en-US") {
    const date = new Date();
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }
    const currentDate = date.toLocaleDateString(lang, options);
    dateBox.textContent = currentDate;
}

function getTimeOfDay(lang = 'en-US') {
    const date = new Date();

    let hours = date.getHours();
    let greetings = {
        'en-US': ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
        'uk': ['Добрай раніцы', 'Добры дзень', 'Добры вечар', 'Дабранач'],
        'ru': ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи']
    }
    if (greetings[lang]) {
        if (hours >= 6 && hours < 12) {

            return greetings[lang][0];
        }
        if (hours >= 12 && hours < 18) {

            return greetings[lang][1];
        }
        if (hours >= 18 && `${hours}:${date.getMinutes()}` <= '23:59') {

            return greetings[lang][2];
        }
        if (hours >= 0 && hours < 6) {
            return greetings[lang][3];
        }
    }
}

function showGreeting(lang, gettingTimeOfDay) {
    greeting.textContent = gettingTimeOfDay(lang);
}

function setLocalStorage(name, value) {
    localStorage.setItem(name, value);
}

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        greetingInput.value = localStorage.getItem('name');
    }
}

function getNameCity() {
    let nameCity = city.value;

    if (nameCity.length > 0) {
        setLocalStorage('nameCity', nameCity);
        getWeather(nameCity)
    } else if (localStorage.getItem('nameCity') && nameCity.length === 0) {

        nameCity = localStorage.getItem('nameCity');
        getWeather(nameCity);
        city.value = nameCity;
        return
    }
    if (nameCity.length === 0) {
        nameCity = 'Minsk';
        city.value = 'Minsk'
        getWeather(nameCity)
    }
}
async function getWeather(city, lang = 'en') {

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city || 'Minsk'}&lang=${lang}&appid=d20ba9cced40c03fddd74ad024f5cff6&units=metric`);
    const data = await res.json();
    if (!(data.cod < 300 && data.cod >= 200)) {
        weatherError.textContent = 'ОЙ, что-то пошло не так'
        clearContentWeatherBlock(data)
        return false
    } else {
        addingContentWeatherBlock(data)
    }

}

function clearContentWeatherBlock() {
    weatherIcon.className = 'weather-icon owf'
    temperature.textContent = ''
    weatherDescription.textContent = ''
    wind.textContent = '';
    humidity.textContent = '';
}

function addingContentWeatherBlock(data) {
    weatherError.textContent = ''
    weatherIcon.className = `weather-icon owf owf-${data.weather[0].id}`;
    temperature.textContent = `${Math.floor(data.main.temp)}°C`
    weatherDescription.textContent = data.weather[0].description
    wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
}

async function getDataQuotes(lang = 'en') {

    let queotes = './assets/data.json';
    let res = await fetch(queotes);

    let data = await res.json();

    if (res.status >= 200 && res.status < 300) {
        addingContentToQuote(data, lang)
    }
}

function addingContentToQuote(data, lang) {
    let lengthData = data[lang].length;
    let quote = data[lang][generateRandomNumber(0, lengthData - 1)];
    author.textContent = quote.author;
    quoteBox.textContent = quote.text;
}


function generateRandomNumber(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function setBg() {

    let timeOfDay = getTimeOfDay().split(' ').slice(-1).join('');

    let bgNum = ('0' + randomNum.toString()).slice(-2);

    let urlBg = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;

    let img = new Image();
    img.src = urlBg;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${urlBg})`
    };
}

function getSlideNext() {
    if (randomNum !== 20) {
        randomNum++;
        console.log(randomNum)
        setBg()
        return
    }
    if (randomNum === 20) {
        console.log(randomNum)
        randomNum = 1;
        setBg()
    }
}

function getSlidePrev() {
    if (randomNum > 1) {
        randomNum--;
        setBg()
        return
    }
    if (randomNum === 1) {
        randomNum = 20;
        setBg()
    }
}

// аудиоплеер
function activationSong(songs) {
    let newPlayList = JSON.parse(JSON.stringify(playList))
    for (let obj of newPlayList) {
        delete obj.active;
    }
    newPlayList[playNum].active = true;
    songs(newPlayList)
    return newPlayList;

}


function conclusionData() {
    setTimeout(function f() {
        let totalTimeAudio = audio.duration;
        let totalMinute = Math.floor((totalTimeAudio / 60));
        let totalSeconds = Math.floor(((totalTimeAudio / 60) - totalMinute).toFixed(2) * 60);

        let currentMinute = Math.floor((audio.currentTime / 60));
        let currentSeconds = Math.floor(((audio.currentTime / 60) - currentMinute) * 60);

        if (isNaN(totalTimeAudio)) {
            return
        }
        if (!isNaN(audio.currentTime)) {
            rangeSliderAudio()

            playerCurrentTime.textContent = currentMinute + ':' + (0 + currentSeconds.toString()).slice(-2);
        }
        playerTotalTime.textContent = totalMinute + ':' + (0 + totalSeconds.toString()).slice(-2);
        let a = setTimeout(f, 1000);
    }, 1000);
}


function playAudio() {
    audio.src = playList[playNum].src;

    if (!isPlay) {
        isPlay = true;
        audio.play();
        activationSong(createListForSongs);
        toggleBtnPlayAudio();
        conclusionData();
        outNameSong()
    } else {
        audio.currentTime = 0;
        audio.pause()
        toggleBtnPlayAudio()
        isPlay = false;
    }
}

function toggleBtnPlayAudio() {
    btncontrolAudio.classList.toggle('pause');
}

function switchinSongs() {
    isPlay = true;
    audio.src = playList[playNum].src;
    audio.play()
    btncontrolAudio.classList.add('pause');

    conclusionData()
}


function createListForSongs(playList) {
    playListBox.innerHTML = ''
    let containerListSongs = document.createDocumentFragment();

    for (let i = 0; i < playList.length; i++) {
        let li = document.createElement('li');
        li.classList.add('play-item');
        if (playList[i].active) {
            li.classList.add('item-active');
        }
        li.textContent = playList[i].title;
        containerListSongs.appendChild(li);
    }

    playListBox.appendChild(containerListSongs)
}

function playPrev() {
    if (playNum > 0) {
        playNum--;
        switchinSongs()
        activationSong(createListForSongs);
        outNameSong();
        return
    }
    if (playNum === 0) {
        playNum = playList.length - 1;
        switchinSongs()
        activationSong(createListForSongs)
        outNameSong()
    }
}

function playNext() {
    isPlay = true;
    if (playNum < playList.length - 1) {
        playNum++
        switchinSongs();
        activationSong(createListForSongs);
        outNameSong()
        return
    }
    if (playNum == playList.length - 1) {
        playNum = 0;
        switchinSongs();
        activationSong(createListForSongs);
        outNameSong();
    }
}

function rewindAudio() {
    let lengthAudioTrack = Math.floor(audio.duration);
    if (!isNaN(lengthAudioTrack)) {
        audio.currentTime = playerSlider.value;
    }
}

function rangeSliderAudio() {
    playerSlider.max = Math.floor(audio.duration);
    playerSlider.value = Math.floor(audio.currentTime);
}

function outNameSong() {
    payerNameSong.textContent = playList[playNum].title;
}


function turnVolume() {
    if (volume.classList.contains('volume-on')) {
        volume.classList.remove('volume-on');
        volume.classList.add('volume-off');
        audio.muted = true;
    } else {
        volume.classList.add('volume-on');
        volume.classList.remove('volume-off');
        audio.muted = false;
    }
}

// аудиоплеер!