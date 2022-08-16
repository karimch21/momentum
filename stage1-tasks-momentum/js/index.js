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
const playerVolumeRange = document.querySelector('.player__volume-range');
const settingBg = document.querySelector('.setting__bg');
const bgQuery = document.querySelector('.bg-query');
const blockManagement = document.querySelector('.block-management');
const settingClose = document.querySelector('.setting-close');
const settingBtn = document.querySelector('.setting__open');
const todo = document.querySelector('.todo');
const todoInput = document.querySelector('.todo__input');
const boxTodoList = document.querySelector('.todo__list');
const todoToday = document.querySelector('.todo__today');
const todoDone = document.querySelector('.todo__done');
const todoClearAll = document.querySelector('.todo__clear-all');
const todoDeleteLast = document.querySelector('.todo__delete-last');
const todoOpenBtn = document.querySelector('.todo-open-btn');

let todoList = [{
        id: Math.random().toFixed(7),
        text: 'Lorem ipsum dolor sit amet.',
        done: false
    },
    {
        id: Math.random().toFixed(7),
        text: '2 Lorem ipsum dolor sit amet.',
        done: false
    },
    {
        id: Math.random().toFixed(7),
        text: '3 Lorem ipsum dolor sit amet.',
        done: false
    }
]
let newTodoList = createNewTodoList(todoList);


let randomNum = generateRandomNumber(1, 20);
let isPlay = false;
let playNum = 0;
let queryBg = '';
let state = {
    language: 'en',
    backgroundSource: 'git',
    blocks: {
        "time": 'on',
        "date": 'on',
        "player": 'on',
        "quotes-box": 'on',
        "weather": 'on',
        "greeting-container": 'on'
    }
}
import playList from './playList.js';

window.addEventListener('beforeunload', () => {
    setLocalStorage('name', greetingInput.value);
    setLocalStorage('state', JSON.stringify(state))
});
window.addEventListener('load', getLocalStorage);
window.addEventListener('load', () => {
    getDataQuotes()
    showTime()
    getNameCity()
    changeDataSettings()
    randomNum = generateRandomNumber(1, 20);
    changeBgImage()
    createListForSongs(playList);
    handlerVisibilityBlocks(localStorage.getItem('state'));
    appendingTasksTodo(newTodoList);
    window.addEventListener('click', clickWindowHadler);
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
playerVolumeRange.addEventListener('input', volumeControl);
settingBg.addEventListener('input', getSourseBg);
bgQuery.addEventListener('change', gettingQueryBg);
blockManagement.addEventListener('click', blockManagementHandler);

settingBtn.addEventListener('click', () => {
    document.querySelector('.setting__inner').classList.remove('setting__inner--hide')
});
todoInput.addEventListener('keydown', (event) => {
    getTaskTodo(event, newTodoList);
})
boxTodoList.addEventListener('click', (e) => {
    handlerBoxTodoList(e, newTodoList);
});
todoToday.addEventListener('click', switchListTodoToday);
todoDone.addEventListener('click', switchListTodoDone);
todoClearAll.addEventListener('click', crealContentTodo);
todoDeleteLast.addEventListener('click', deleteLastTaskTodo);
todoOpenBtn.addEventListener('click', openTodo);
// window.addEventListener('click', windowClickHandlerl)

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate("en-US")
    showGreeting("en-US", getTimeOfDay)
    setTimeout(showTime, 1000);
}

function showDate(lang = 'en-US') {
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
        "en-US": ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
        "uk": ['Добрай раніцы', 'Добры дзень', 'Добры вечар', 'Дабранач'],
        "ru": ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи']
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

function setBg(url) {
    let urlBg = url;

    let img = new Image();
    img.src = urlBg;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${urlBg})`
    };
}

function createBgByGit() {
    let timeOfDay = getTimeOfDay().split(' ').slice(-1).join('');
    let bgNum = ('0' + randomNum.toString()).slice(-2);
    return `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
}

function getSlideNext() {
    if (randomNum !== 20) {
        randomNum++;

        changeBgImage()
        return
    }
    if (randomNum === 20) {

        randomNum = 1;
        changeBgImage()
    }
}

function getSlidePrev() {
    if (randomNum > 1) {
        randomNum--;
        changeBgImage()
        return
    }
    if (randomNum === 1) {
        randomNum = 20;
        changeBgImage()
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
    console.dir(audio)
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

function volumeControl() {
    let valueVolume = +(playerVolumeRange.value / 100).toFixed(1);
    audio.volume = valueVolume;
}
// аудиоплеер!

// api img

async function generateUnsplashImg(query) {
    try {
        let fet = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=${query}&client_id=4cx9FQaptDE64NF-hrMhs_RrvBks_hz_IvjYdtwnxm0`);
        let res = await fet.json();
        if (fet.status >= 200 && fet.status < 400) {
            let urlBg = res.links.download;
            setBg(urlBg)
            return urlBg;
        }
    } catch (err) {
        console.log('sorry( ' + err)
    }
}

function gettingQueryBg() {
    let timeOfDay = getTimeOfDay().split(' ').slice(-1).join('');
    if (bgQuery.value.length === 0) {
        return timeOfDay;
    }
    if (bgQuery.value.search(/\d/gi) !== -1) {
        bgQuery.value = ''
        bgQuery.placeholder = 'enter text without numbers'
    }
    let bgQuerVal = (bgQuery.value).trim();
    queryBg = bgQuerVal;
    changeBgImage(bgQuerVal)
}

function getSourseBg() {
    state.backgroundSource = settingBg.value;
    setLocalStorage('state', state);
    changeBgImage()
}

function changeBgImage(query) {
    settingBg.value = state.backgroundSource;
    bgQuery.style.opacity = 1;
    query = queryBg;
    if (bgQuery.value.length === 0) {
        let timeOfDay = getTimeOfDay().split(' ').slice(-1).join('');
        query = timeOfDay;
    }
    if (settingBg.value == 'unsp') {
        generateUnsplashImg(query);
    }
    if (settingBg.value == 'flickr') {
        generateFlickrImg(query);
    }
    if (settingBg.value == 'git') {
        let urlBgGit = createBgByGit();
        bgQuery.value = ''
        bgQuery.style.opacity = 0.5;
        setBg(urlBgGit)
    }

    // changeDataSettings()



}

async function generateFlickrImg(bgQuery) {
    try {
        let url = ` https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=accabe44b1149859ef68199ecb16670c&tags=${bgQuery}&extras=url_l&format=json&nojsoncallback=1`

        let fet = await fetch(url);
        let res = await fet.json();
        let urls = [];
        if (fet.status >= 200 && fet.status < 400) {
            let urlBg = res.photos.photo;
            urlBg.forEach(obj => {
                if (obj['url_l']) {
                    urls.push(obj['url_l']);
                }
            })

            setBg(urls[randomNum]);
            return urlBg;
        }
    } catch (err) {
        console.log('sorry( ' + err);
        setBg(urls[randomNum]);
    }
}

function blockManagementHandler(e) {
    let boxForShow = e.target.closest('.box-inp');

    if (boxForShow) {
        if (e.target.tagName == 'INPUT') {
            let boxName = e.target.name;
            if (!e.target.checked) {
                state.blocks[boxName] = 'off';

            } else {
                state.blocks[boxName] = 'on';
            }
            document.querySelector('.' + boxName).classList.toggle('hidden-block');
        }
    }
}

function handlerVisibilityBlocks(state) {
    if (state) {
        state = JSON.parse(state);
    } else {
        return
    }

    for (let nameBlock in state.blocks) {
        if (state.blocks[nameBlock] == 'on') {
            document.querySelector('.' + nameBlock).classList.remove('hidden-block');
            let input = document.querySelector(`input[name=${nameBlock}]`);
            input.checked = true;

        } else {
            console.log(document.querySelector('.' + nameBlock))
            if (document.querySelector('.' + nameBlock)) {
                document.querySelector('.' + nameBlock).classList.add('hidden-block');
                let input = document.querySelector(`input[name=${nameBlock}]`);
                input.checked = false;
            }
        }
    }
}

function changeDataSettings() {
    if (localStorage.getItem('state')) {
        state = JSON.parse(localStorage.getItem('state'));
    }
}

function clickWindowHadler(e) {
    closeTodoList(e)
    closeSetting(e)
}

function closeSetting(e) {
    let target = e.target;
    if (!target.closest('.setting') && !target.closest('.setting__open')) {
        document.querySelector('.setting__inner').classList.add('setting__inner--hide')
    }

};

function closeTodoList(e) {
    let elemnts = e.path;
    let arrEl = [];

    for (let el of elemnts) {
        arrEl.push(el)
    }
    let obj = arrEl.reduce((objNew, el) => {
        objNew[el.className] = el
        return objNew
    }, {})
    if (!obj['todo todo--active'] && !e.target.closest('.todo-open-btn')) {
        todo.classList.remove('todo--active')
    }
}

function openTodo() {
    todo.classList.toggle('todo--active');
}

function createNewTodoList(todoList) {
    return todoList.reduce((newObj, task) => {
        newObj[task.id] = task;
        return newObj
    }, {});
}

function getTaskTodo(e, newtodoList) {
    let taskId = Math.random().toFixed(7);

    if (e.key.toLowerCase() === 'enter') {
        if (todoInput.value.length > 0 && todoInput.value.trim().length > 0) {
            newtodoList[taskId] = {
                id: taskId,
                text: todoInput.value.trim(),
                done: false
            }

            todoInput.value = '';
            appendingTasksTodo(newtodoList)
        }
    }
}


function createItemTaskTodo(todoList) {

    let todoItem = document.createElement('li');
    let todoListBox = document.createElement('div');
    let taskTodo = document.createElement('span');
    let todoDoneInp = document.createElement('input');

    todoDoneInp.type = 'checkbox';
    if (todoList.done) {
        todoDoneInp.checked = true;
    }
    todoItem.dataset.id = todoList.id;

    todoItem.classList.add('todo__item', 'today');
    todoListBox.classList.add('todo__list-box');
    todoDoneInp.classList.add('todo__done-inp');

    taskTodo.textContent = todoList.text;
    todoItem.appendChild(todoListBox);
    todoListBox.appendChild(todoDoneInp);
    todoListBox.appendChild(taskTodo);

    return todoItem;
}

function appendingTasksTodo(newTodoList) {

    let fragmentTasksToday = document.createDocumentFragment();
    let fragmentTasksDone = document.createDocumentFragment();

    for (let taskId in newTodoList) {
        let task = newTodoList[taskId];

        if (!task.done) {
            fragmentTasksToday.appendChild(createItemTaskTodo(task));
        } else {
            fragmentTasksDone.appendChild(createItemTaskTodo(task));
        }
    }
    if (boxTodoList.classList.contains('todo__list--done')) {
        boxTodoList.innerHTML = '';
        boxTodoList.appendChild(fragmentTasksDone);
        return
    }
    if (boxTodoList.classList.contains('todo__list--today')) {
        console.log(134432)
        boxTodoList.innerHTML = '';
        boxTodoList.appendChild(fragmentTasksToday);
        return
    }
}


function handlerBoxTodoList(e, newTodoList) {
    let itemTask = e.target.closest('.todo__item');
    if (!itemTask) return;
    let inpTask = itemTask.querySelector('.todo__done-inp')
    console.log(inpTask.checked)
    if (inpTask.checked) {
        let taskItemId = itemTask.getAttribute('data-id');
        newTodoList[taskItemId].done = true;
        appendingTasksTodo(newTodoList);
        return
    } else if (!inpTask.checked) {
        let taskItemId = itemTask.getAttribute('data-id');
        newTodoList[taskItemId].done = false;
        appendingTasksTodo(newTodoList)
    }

}

function switchListTodoToday() {
    todoInput.classList.remove('todo__input--hide');
    todoToday.classList.add('todo__today--active')
    todoDone.classList.remove('todo__done--acitve');
    boxTodoList.classList.add('todo__list--today');
    boxTodoList.classList.remove('todo__list--done');
    appendingTasksTodo(newTodoList)
}

function switchListTodoDone() {
    todoInput.classList.add('todo__input--hide');
    todoDone.classList.add('todo__done--acitve')
    todoToday.classList.remove('todo__today--active')
    boxTodoList.classList.remove('todo__list--today');
    boxTodoList.classList.add('todo__list--done');
    appendingTasksTodo(newTodoList);
}

function crealContentTodo(e) {
    boxTodoList.innerHTML = '';
    let todoTabItem = document.querySelector('.todo__today--active') || document.querySelector('.todo__done--acitve');

    if (todoTabItem.classList.contains('todo__today--active')) {
        for (let key in newTodoList) {
            if (!newTodoList[key].done) {
                delete newTodoList[key]
            }
        }
    } else if (todoTabItem.classList.contains('todo__done--acitve')) {
        for (let key in newTodoList) {
            if (newTodoList[key].done) {
                delete newTodoList[key];
            }
        }
    }
    appendingTasksTodo(newTodoList)
}

function deleteLastTaskTodo() {
    let lastTask = boxTodoList.querySelector('li:last-of-type');
    if (lastTask) {
        console.log(newTodoList)
        let idLastTask = lastTask.getAttribute('data-id');
        delete newTodoList[idLastTask]
        appendingTasksTodo(newTodoList)
    }
}