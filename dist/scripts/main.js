
/* ===== Global Variables ===== */

var tracksGridContainer = document.getElementsByClassName('tracks__grid-container')[0];
// Based on the columns and rows of tracks__grid-container
var columns = 12;
var rows = 3;
var soundGrid = [];

var instrumentsIndex = 0;
var instrumentGridCols = 3;
var instrumentsPosition = [1, 2, 3, 4, 5, 6];
var instruments = document.getElementsByClassName('instruments')[0];
var instrumentIcons = document.getElementsByClassName('instrument-icon');
var arrows = document.getElementsByClassName('arrow');

var libraryHeader = document.getElementsByClassName('library__header')[0];
var instrumentsContainer = document.getElementsByClassName('instruments-container')[0];
var sounds = document.getElementsByClassName('sounds');
var currentInstrument, currentSounds;

var playBtns = document.getElementsByClassName('sounds__play-btn');

var search = document.getElementsByName('search-bar')[0];

var tracksBtn = document.getElementsByClassName('tracks__btn')[0];
var skipToStartBtn = document.getElementsByClassName('skip-to-start-btn')[0];

// Keep track of audio and audio time
var currentBufferSources = [];
var currentAudioBuffers = []; 
var timeAtStart, offset;
var unpause = false;

var AudioContext = window.AudioContext || window.webkitAudioContext; // Cross browser variant
var audioContext = new AudioContext(); // is suspended at startup

var notificationBox = document.getElementsByClassName('notification')[0];



/* ===== Initialize Page ===== */

setTracksGridContainer();


/* ===== Library Event Listeners ===== */

arrows[0].addEventListener("click", showLeftInstruments);
arrows[1].addEventListener("click", showRightInstruments);

for (let i = 0; i < instrumentIcons.length; i++) {
  instrumentIcons[i].addEventListener("click", showSounds);
}


for (let i = 0; i < playBtns.length; i++) {
  playBtns[i].addEventListener("click", handleSound);
}

search.addEventListener("change", filter);




/* ===== Library Functions ===== */

// Left Arrow = 0; Right Arrow = 1
function showLeftInstruments() {

    for (let i = 0; i < instrumentIcons.length; i++) {
      if ((i + 1) != instrumentIcons.length) {
        let temp = instrumentsPosition[i];
        instrumentsPosition[i] = instrumentsPosition[i + 1];
        instrumentsPosition[i + 1] = temp;
      }
  
      instrumentIcons[i].style.order = instrumentsPosition[i];
    }
  }
  
  
  function showRightInstruments() {
  
    if (arrows[0].classList.contains("is-hidden")) {
  
      removeSounds();
  
    } else {
  
      for (let i = instrumentIcons.length - 1; i >= 0; i--) {
  
        if ((i - 1) != -1) {
          let temp = instrumentsPosition[i];
          instrumentsPosition[i] = instrumentsPosition[i - 1];
          instrumentsPosition[i - 1] = temp;
        }
  
        instrumentIcons[i].style.order = instrumentsPosition[i];
      }
  
    }
  }
  
  
  function showSounds() {
  
    currentInstrument = this;
  
    // Check h3 to see which instrument was clicked and set currentSounds
    switch (currentInstrument.children[1].innerText) {
      case "Guitar":
        currentSounds = sounds[0];
        break;
      case "Piano":
        currentSounds = sounds[1];
        break;
      case "Bass":
        currentSounds = sounds[2];
        break;
      case "Percussion":
        currentSounds = sounds[3];
        break;
      case "Brass":
        currentSounds = sounds[4];
        break;
      default:
        currentSounds = sounds[5];
    }
  
    libraryHeader.children[1].classList.remove("is-fading-out");
    currentSounds.classList.remove("is-fading-out");
  
    setLibraryAnimations();
  
    setInstrumentsLayout();
  
    setTimeout(function() {
      setSoundsAndSearchBar();
    }, 2000);
  }
  
  
  function removeSounds() {
  
    libraryHeader.children[1].classList.add("is-fading-out");
    currentSounds.classList.add("is-fading-out");
  
    setLibraryAnimations();
  
    setTimeout(function() {
      setSoundsAndSearchBar();
    }, 1000);
  
    setInstrumentsLayout();
  }
  


function setLibraryAnimations() {

    libraryHeader.children[0].classList.toggle("is-fading-out");
    arrows[0].classList.toggle("is-fading-out");
  
    for (let i = 0; i < instrumentIcons.length; i++) {
      if (instrumentIcons[i] != currentInstrument) {
        instrumentIcons[i].classList.toggle("is-fading-out");
      }
    }
  }
  
  
  function setSoundsAndSearchBar() {
    libraryHeader.children[1].classList.toggle("is-hidden");
    currentSounds.classList.toggle("is-hidden");
  }
  
  
  function setInstrumentsLayout() {
    setTimeout(function() {
      // Non-selected instrument icons
      for (let i = 0; i < instrumentIcons.length; i++) {
        if (instrumentIcons[i] != currentInstrument) {
          instrumentIcons[i].classList.toggle("is-hidden");
        }
      }
  
      arrows[0].classList.toggle("is-hidden");
      libraryHeader.children[0].classList.toggle("is-hidden");
  
      // New layout for the library
      currentInstrument.classList.toggle("instrument-icon--is-larger");
      instrumentsContainer.classList.toggle("instruments-container--is-smaller");
    }, 1000);
  }

  
// Handles the play buttons of the Library's sounds
function handleSound() {
    let audio = this.parentNode.children[0];
    let btn = this;
  
    audio.addEventListener("pause", function() {
      btn.innerText = "Play";
    });
  
    // Check if audio is currently playing
    if (!audio.ended && !audio.paused) {
      btn.innerText = "Play";
      audio.pause();
      audio.currentTime = 0;
    } else {
      btn.innerText = "Stop";
      audio.play();
    }
  }


// Filters through the currently displayed list of sounds based on user input
function filter() {

    let filter = search.value.toLowerCase();
  
    // Find the current list of sounds based on its layout; the chosen instrument has a bigger icon
    let instrument = currentInstrument.children[1].innerText.toLowerCase();
    let soundList = document.getElementsByClassName("sounds__" + instrument)[0].querySelectorAll("li");
  
    for (let i = 0; i < soundList.length; i++) {
      if (soundList[i].children[2].innerText.toLowerCase().indexOf(filter) === -1) {
        soundList[i].classList.add("is-hidden");
      } else {
        soundList[i].classList.remove("is-hidden");
      }
    }
  }
/* ===== Notification Functions ===== */

function notification(message){
    notificationBox.innerHTML = message;
    notificationBox.classList.add('is-fading-in');
    notificationBox.classList.remove('is-fading-out');
    notificationBox.classList.toggle('is-hidden');
    
    setTimeout(() => {        
        notificationBox.classList.remove('is-fading-in');
        notificationBox.classList.add('is-fading-out');      
        setTimeout(() => {
            notificationBox.classList.toggle('is-hidden');
        }, 1000);  
    }, 5000);
}
/* ===== Sounds Functions ===== */

function playTrackAudio(){
    if(!unpause){        
        timeAtStart = audioContext.currentTime;
        setAudioBufferSourceNodes();
    } else {
        time = audioContext.currentTime;
        offset = audioContext.currentTime - timeAtStart;
        if (!offset){
            time = 0;
            offset = 0;
        }
        setAudioBufferSourceNodes(time, offset);
        unpause = false;
    }
  }

function pauseTrackAudio(){    
    currentBufferSources.forEach(source => {
        source.stop();
    });        
    audioContext.suspend();
}

function skipToStartTrackAudio(){
    currentBufferSources[0].onended = false;
    timeAtStart = NaN;

    pauseTrackAudio();
    if(tracksBtn.value === 'playing'){
        audioContext.resume().then(playTrackAudio());   
    }
  }

// Color variables found in styles.scss
function getSoundColor(soundType){
    switch(soundType){
        case 'guitar':
            return 'blue';
        case 'piano':
            return 'yellow';
        case 'bass':
            return 'red';
        case 'percussion':
            return 'purple';
        case 'brass':
            return 'orange';
        case 'sounds':
            return 'green';
        default:
            return -1;
    }
}

function createSoundEl(data, gridSpace){
    let name = document.getElementById(data).children[2].cloneNode(true);
    let soundEl = document.createElement('div');

    soundEl.appendChild(name);
    
    soundEl.classList.add('track-filled-space');
    soundEl.classList.add('is-filled--' + data.split('--')[0]);
    
    soundEl.draggable = true;
    soundEl.ondragstart = soundDragStart;
    soundEl.ondragend = onDragEnd;

    soundEl.id = 'filled-space--' + gridSpace;

    return soundEl;
}

// Returns the column number of the farthest right sound
function getEndPlaybackColumn(){
    for(let col = columns - 1; col >= 0; col--) {
        for(let row = 0; row < rows; row++){
            let gridSpace = (row * columns) + col;
            if(!isEmptySpace(gridSpace)){
                return col;
            }
        }
    }
    return 0;
}

function getAudioFilePath(audioEl){
    let source = audioEl.children[0];
    return source.getAttribute('src');
}

function getEmptyAudioBuffer(){
    // Create a 5 second buffer
    let emptyAudioBuffer = audioContext.createBuffer(2, audioContext.sampleRate * 5, audioContext.sampleRate);
    return emptyAudioBuffer;
}

async function getAudioBuffer(filepath){
    const audioResponse = await fetch(filepath);
    const audioData = await audioResponse.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    return audioBuffer;
}

function getAudioBufferArray(){
    let audioBufferArray = [];
    let endPlaybackColumn = getEndPlaybackColumn();

    for (let i = 0; i < rows; i++) {
        let tempAudioBuffer = audioContext.createBuffer(2, audioContext.sampleRate * ((endPlaybackColumn + 1) * 5), audioContext.sampleRate);
        let tempFloat32Array = tempAudioBuffer.getChannelData(0);
        let length = 0; // increments of 5 seconds
          
        for (let j = 0; j < columns; j++) {
            let audioBuffer = soundGrid[i][j];
            
            if((audioBuffer === -1) && (j <= endPlaybackColumn)){
                if (length === 0){
                    tempFloat32Array.set(getEmptyAudioBuffer().getChannelData(0));
                } else {
                    tempFloat32Array.set(getEmptyAudioBuffer().getChannelData(0), length);
                }
            } else if (audioBuffer != -1){
                if (length === 0){
                    tempFloat32Array.set(audioBuffer.getChannelData(0));
                } else {
                    tempFloat32Array.set(audioBuffer.getChannelData(0), length);
                }
            }
            length = length + (audioContext.sampleRate * 5);          
        }
          
        tempAudioBuffer.getChannelData(0).set(tempFloat32Array);
        audioBufferArray.push(tempAudioBuffer);
    }

    return audioBufferArray;
  }

function setAudioBufferSourceNodes(time = 0, offset = 0){
    currentBufferSources = [];
    currentAudioBuffers = getAudioBufferArray();
    currentAudioBuffers.forEach(audioBuffer => {
        let source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(time, offset);
        currentBufferSources.push(source);
        currentBufferSources[0].onended = handleEnd;
    });
}

function handleEnd(){
    if ((tracksBtn.value === 'playing') && !unpause){
        tracksBtn.value = 'paused';
        tracksBtn.innerHTML = 'Play';
    }
}

async function appendSoundGrid(audioFilePath, gridSpace){
    let trackRow = Math.floor(gridSpace/columns);
    let trackCol = gridSpace%columns;
    soundGrid[trackRow][trackCol] = await getAudioBuffer(audioFilePath);
}

function setSoundGridIndex(oldIndex, newIndex){
    let prevTrackRow = Math.floor(oldIndex/columns);
    let prevTrackCol = oldIndex%columns;
    
    let newTrackRow = Math.floor(newIndex/columns);
    let newTrackCol = newIndex%columns;
    
    let temp = soundGrid[prevTrackRow][prevTrackCol];
    soundGrid[prevTrackRow][prevTrackCol] = -1;
    soundGrid[newTrackRow][newTrackCol] = temp;
}

function isEmptySpace(gridSpace){
    let trackRow = Math.floor(gridSpace/columns);
    let trackCol = gridSpace%columns;

    return (soundGrid[trackRow][trackCol] === -1) ? true : false;
}

/* ~~~~~  Drag and Drop Functions ~~~~~ */

// Handler for elements on the grid
function soundDragStart(e){
    e.currentTarget.style.opacity = 0.5;
    e.dataTransfer.setData('text', e.currentTarget.id);
    e.dataTransfer.effectAllowed = 'move';
}

function onDragStart(e){
    e.currentTarget.style.opacity = 0.5;
    e.dataTransfer.setData('text', e.currentTarget.id);
    e.dataTransfer.effectAllowed = 'copy';
}

function onDragEnd(e) {
    e.currentTarget.style = '';
}

function onDragOver(e){
    let data = e.dataTransfer.getData('text');

    if(data.includes('filled-space')){
        let el = document.getElementById(data);

        el.classList.forEach(name => {
            if(name.includes('is-filled')){
                data = name.split('--')[1];
            }
        });
    } else {
        data = data.split('--')[0];
    }

    let color = getSoundColor(data);

    if(color != -1){ 
        e.preventDefault();

        e.currentTarget.style.backgroundColor = color;
        e.dataTransfer.dropEffect = 'copyMove';
    }
}

function onDragLeave(e){
    e.currentTarget.style = '';
}

function onDrop(e) {
    e.preventDefault();

    if (tracksBtn.value === 'paused') {

        let data = e.dataTransfer.getData('text');
        let gridSpace = e.target.id.split('--')[1];
        let el = document.getElementById(data);
        let audio;

        if(isEmptySpace(gridSpace)){

            if(e.dataTransfer.dropEffect === 'copy'){
                audio = el.children[0];
                let audioFilePath = getAudioFilePath(audio);
                appendSoundGrid(audioFilePath, gridSpace);
                e.target.appendChild(createSoundEl(data, gridSpace));

            } else {
                let oldElId = el.id.split('--');
                el.id = oldElId[0] + '--' + gridSpace;
                e.target.appendChild(el);            
                setSoundGridIndex(oldElId[1], gridSpace);
            }
        }
    } else {
        notification('Drop Function Unavailable During Playback'); 
    }

    e.currentTarget.style = '';
}
/* ===== Tracks Event Listeners ===== */

tracksBtn.addEventListener("click", function(){ 
  if(tracksBtn.value === 'paused'){
    tracksBtn.value = 'playing';
    tracksBtn.innerHTML = 'Pause';
    audioContext.resume().then(() => { playTrackAudio(); });
  } else {
    tracksBtn.value = 'paused';
    tracksBtn.innerHTML = 'Play';
    unpause = true;
    pauseTrackAudio();
  }
});

skipToStartBtn.addEventListener("click", skipToStartTrackAudio);



/* ===== Tracks Functions ===== */


function setTracksGridContainer() {
  
  let emptySpaceCount = 0;

    for (let i = 0; i < rows; i++) {
      soundGrid[i] = []; // Make soundGrid a 2D array
      for (let j = 0; j < columns; j++) {
  
        let trackEmptySpace = document.createElement("div");
        trackEmptySpace.ondragover = onDragOver;
        trackEmptySpace.ondragleave = onDragLeave;
        trackEmptySpace.ondrop = onDrop;
        trackEmptySpace.classList.add("track-empty-space");
        trackEmptySpace.id = "empty-space--" + emptySpaceCount++;
  
        tracksGridContainer.appendChild(trackEmptySpace);

        // Adds a -1 instead of an empty audio buffer 
        // to help keep track of empty spaces
        soundGrid[i][j] = -1;
      }
    }
  }
/* ===== Sound Visualization Functions ===== */

// Use AnalyserNode (Web Audio API)
// then pass output to a <canvas>