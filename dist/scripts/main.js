
/* ===== Global Variables ===== */

var tracksGridContainer = document.getElementsByClassName("tracks__grid-container")[0];
// Based on the columns and rows of tracks__grid-container
var columns = 12;
var rows = 3;
var soundGrid = [];

var instrumentsIndex = 0;
var instrumentGridCols = 3;
var instrumentsPosition = [1, 2, 3, 4, 5, 6];
var instruments = document.getElementsByClassName("instruments")[0];
var instrumentIcons = document.getElementsByClassName("instrument-icon");
var arrows = document.getElementsByClassName("arrow");

var libraryHeader = document.getElementsByClassName("library__header")[0];
var instrumentsContainer = document.getElementsByClassName("instruments-container")[0];
var sounds = document.getElementsByClassName("sounds");
var currentInstrument, currentSounds;

var playBtns = document.getElementsByClassName("sounds__play-btn");

var search = document.getElementsByName("search-bar")[0];

// Keeps track of audio
var isPlaying = false;
var isPaused = false;
var isStopped = false;

var AudioContext = window.AudioContext || window.webkitAudioContext; // Cross browser variant
var audioContext = new AudioContext();


/* ===== Initialize Page ===== */

setTracksGridContainer();



/*=====================
         Old Code
  =====================/*

/* ~~~~~ Global Variables ~~~~~ */

/*let headerBtns = document.getElementsByClassName("header_container")[0].querySelectorAll("button");
let backBtn = document.getElementsByClassName("back_btn");
let soundTime = document.getElementsByClassName("sound_time");

let tracks = document.getElementsByClassName("editor_track");
let isDone = [true, true, true]; // Whether each track is done playing audio
let currentAudioPlaying = []; // Currently playing audio on each of the tracks

// Keeps track of audio
let isPlaying = false;
let isPaused = false;
let isStopped = false;

let editorControlBtns = document.getElementsByClassName("editor_controls-container")[0].querySelectorAll("button");
let playTrackBtn = editorControlBtns[0];
let pauseTrackBtn = editorControlBtns[1];
let stopTrackBtn = editorControlBtns[2];

let trashSound = document.getElementsByClassName("editor_sound-trash-container")[0];
let soundOnTrack = 0; // Number of sounds that have ever been on the track
let refNode;*/

/* ~~~~~ Loop and Functions ~~~~~ */

// Returns name of the second menu's container, header, and content based on given header btn
/*function getSecondMenuNames(btn) {

  let container;
  let header;
  let content;
  let btnName = btn.innerText.toLowerCase();

  switch (btnName) {
    case "settings":
      container = "settings_container";
      header = "settings_header";
      content = "settings_content";
      brea// module.exports = Sounds;k;
    case "contact":
      container = "contact_container";
      header = "contact_header";
      content = "contact_content";
      break;
    default:
      container = "sound_container";
      header = "sound_header";
      content = "sound_list " + btnName;
  }

  return [container, header, content];
}


for (let i = 0; i < headerBtns.length; i++) {
  if (headerBtns[i].innerText.toLowerCase() === "tutorial") {
    // Add tutorial listener
    continue;
  } else {
    headerBtns[i].addEventListener("click", toggleSecondMenu);
  }

  if (i < backBtn.length) {
    backBtn[i].addEventListener("click", toggleSecondMenu);
  }
}

*/

/* ~~~~~ sound_list Items: drag and drop handlers ~~~~~ */

/*function onDragStart(e){
  e.currentTarget.style.opacity = 0.5;
  e.dataTransfer.setData("text", e.currentTarget.id);
  e.dataTransfer.effectAllowed = "copy";
}

function onDragEnd(e) {
  e.currentTarget.style = "";
  trashSound.classList.add("hide");
}*/

/* ~~~~~ Sound Nodes: drag and drop handlers ~~~~~ */

// Returns true if mouse is more towards the left of the element than the right
/*function isLeft(e) {

  let third = e.currentTarget.offsetWidth / 3;

  if (e.offsetX <= third ) {
    return true;
  }

  if (e.offsetX >= (third * 2)) {
    return false;
  }
}

function onSoundInfoDragStart(e){
  e.currentTarget.style.opacity = 0.5;
  e.dataTransfer.setData("text", e.currentTarget.id);
  e.dataTransfer.effectAllowed = "move";

  trashSound.classList.remove("hide");
}

function onSoundInfoDragOver(e){
  e.preventDefault();
  if (isLeft(e)) {
    e.currentTarget.style.borderLeft = "1px solid #eee";
    refNode = e.currentTarget;
  } else {
    e.currentTarget.style.borderRight = "1px solid #eee";
    refNode = e.currentTarget.nextElementSibling;
  }
}*/

/* ~~~~~ Tracks: drag and drop handlers ~~~~~ */

/*function onDragOver(e){
  e.preventDefault();
  e.currentTarget.style.backgroundColor = "inherit";
  e.dataTransfer.dropEffect = "copyMove";
}

function onDragLeave(e){
  e.currentTarget.style = "";
}

function onDrop(e) {
  e.preventDefault();
  e.currentTarget.style = "";
  trashSound.classList.add("hide");

  // Check if drag and drop is currently allowed
  let currentState = getTrackAudioState();
  if((currentState === 1) || (currentState === 2) || (currentState === 3)){ return;}

  let draggedData;

  if (e.dataTransfer.dropEffect === "copy") {

    draggedData = document.getElementById(e.dataTransfer.getData("text")).cloneNode(true);
    let soundInfo = draggedData.firstElementChild.nextElementSibling;

    soundInfo.removeChild(soundInfo.firstElementChild);
    soundInfo.removeChild(soundInfo.lastElementChild);

    draggedData.style.opacity = "";
    draggedData.classList.add("li-on-track");
    soundInfo.classList.add("sound_info-on-track");

    draggedData.addEventListener("dragstart", function(event){ onSoundInfoDragStart(event); }, false);
    draggedData.addEventListener("dragover", function(event){ onSoundInfoDragOver(event); }, false);
    draggedData.addEventListener("dragleave", function(event){ onDragLeave(event); }, false);

    draggedData.querySelector("audio").addEventListener("ended", next);

    soundOnTrack += 1;
    draggedData.id = "sound_on-track-" + soundOnTrack;

    if (refNode != undefined && e.currentTarget.contains(refNode)) {
      e.currentTarget.insertBefore(draggedData, refNode);
    } else {
      e.currentTarget.appendChild(draggedData);
    }

  } else {

    draggedData = document.getElementById(e.dataTransfer.getData("text"));

    if (refNode != undefined && e.currentTarget.contains(refNode)) {
      e.currentTarget.insertBefore(draggedData, refNode);
    } else {
      e.currentTarget.appendChild(draggedData);
    }
  }

}*/

/* ~~~~~ Trash: drag and drop handlers ~~~~~ */

/*function onTrashDragOver(e){
  e.preventDefault();
  e.currentTarget.style.backgroundColor = "red";
  e.currentTarget.style.color = "#f7f7f7";
}

function onTrashDrop(e) {
  e.preventDefault();

  // Check if drag and drop is currently allowed
  let currentState = getTrackAudioState();
  if ((currentState === 1) || (currentState === 2) || (currentState === 3)) {
    return;
  }

  if (e.dataTransfer.dropEffect === "move") {
    let draggedData = document.getElementById(e.dataTransfer.getData("text"));

    if (tracks[0].contains(draggedData)) {
      tracks[0].removeChild(draggedData);
    } else if (tracks[1].contains(draggedData)) {
      tracks[1].removeChild(draggedData);
    } else {
      tracks[2].removeChild(draggedData);
    }
  }

  e.currentTarget.style = "";
  trashSound.classList.add("hide");
}*/

/* ~~~~~ Editor Control Functions ~~~~~ */

/*function getTrackAudioState(){

  // State 0: Startup
  if(!isPlaying && !isPaused && !isStopped){ return 0;}

  // State 1: Audio is currently playing
  if(isPlaying && !isPaused && !isStopped){ return 1;}

  // State 2: Audio is paused
  if(isPlaying && isPaused && !isStopped) { return 2;}

  // State 3: Audio is stopped
  //if(isPlaying && (!isPaused || isPaused) && isStopped){ return 3;}

  // State 4: All audio is done playing
  if(!isPlaying && !isPaused && isStopped){ return 4;}

  // Error
  return -1;
}

function next() {

  let nextAudio = this.parentNode.nextElementSibling; // Currently at next audio's parent node (LI Element)
  let currentTrack = this.parentNode.parentNode; // DIV Element

  // Either play next audio or set that track to done
  switch (currentTrack) {
    case tracks[0]:
      if (nextAudio != undefined) {
        currentAudioPlaying[0] = nextAudio.firstElementChild;
        currentAudioPlaying[0].play();
      } else {
        isDone[0] = true;
        currentAudioPlaying[0] = undefined;
      }
      break;
    case tracks[1]:
      if (nextAudio != undefined) {
        currentAudioPlaying[1] = nextAudio.firstElementChild;
        currentAudioPlaying[1].play();
      } else {
        isDone[1] = true;
        currentAudioPlaying[1] = undefined;
      }
      break;
    default:
      if (nextAudio != undefined) {
        currentAudioPlaying[2] = nextAudio.firstElementChild;
        currentAudioPlaying[2].play();
      } else {
        isDone[2] = true;
        currentAudioPlaying[2] = undefined;
      }
      break;
  }

  // Check if everything is done playing
  if ((isDone[0] === true) && (isDone[1] === true) && (isDone[2] === true)) {
    isPlaying = false;
    isPaused = false;
    isStopped = true;
  }

}

function playSoundsOnTrack() {

  switch (getTrackAudioState()) {
    case 0:
    case 4: // Play from the beginning
      for (let i = 0; i < tracks.length; i++) {
        currentAudioPlaying[i] = tracks[i].querySelectorAll("audio ")[0];
        if (currentAudioPlaying[i] != undefined) {
          currentAudioPlaying[i].play();
          isDone[i] = false;
        }
      }
      break;
    case 2: // Unpause
      for (let i = 0; i < currentAudioPlaying.length; i++) {
        if (currentAudioPlaying[i] != undefined) {
          currentAudioPlaying[i].play();
        }
      }
      isPaused = false;
      break;
    default: // Do nothing
      return;
  }

  isPlaying = true;
  isStopped = false;
}

function pauseSoundsOnTrack(){

  if (getTrackAudioState() === 1) {
    for (let i = 0; i < currentAudioPlaying.length; i++) {
      if (currentAudioPlaying[i] != undefined) {
        currentAudioPlaying[i].pause();
      }
    }
    isPaused = true;
  }

}

function stopSoundsOnTrack(){

  let currentState = getTrackAudioState();

  // Stop currently playing/paused audio
  if ((currentState === 1) || (currentState === 2)) {
    for (let i = 0; i < currentAudioPlaying.length; i++) {
      if (currentAudioPlaying[i] != undefined) {
        currentAudioPlaying[i].pause();
        currentAudioPlaying[i].currentTime = 0;
        isDone[i] = true;
      }
    }
    isPlaying = false;
    isPaused = false;
    isStopped = true;
  }

}

playTrackBtn.addEventListener("click", playSoundsOnTrack);
pauseTrackBtn.addEventListener("click", function(){ pauseSoundsOnTrack(); });
stopTrackBtn.addEventListener("click", function(){ stopSoundsOnTrack(); });*/

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

  
// Handles the play buttons of the Sounds section
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
/* ===== Sounds Functions ===== */

// Colors found in styles.scss
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

function createSoundEl(data, audio, gridSpace){
    let name = document.getElementById(data).children[2].cloneNode(true);
    
    let soundEl = document.createElement('div');
    soundEl.appendChild(audio);
    soundEl.appendChild(name);
    
    soundEl.classList.add('track-filled-space');
    soundEl.classList.add('is-filled--' + data.split('_')[0]);
    
    soundEl.draggable = true;
    soundEl.ondragstart = soundDragStart;
    soundEl.ondragend = onDragEnd;

    soundEl.id = 'filled-space-' + gridSpace;

    return soundEl;
}

function appendSoundGrid(audio, gridSpace){
    let trackRow = Math.floor(gridSpace/columns);
    let trackCol = gridSpace%columns;

    if(!soundGrid.includes(audio.id)){
        audio.id += '-' + gridSpace;
    } else {
        let prevAudioId = audio.id.split('-');
        let prevGridSpace = prevAudioId[1];
        let prevTrackRow = Math.floor(prevGridSpace/columns);
        let prevTrackCol = prevGridSpace%columns;

        soundGrid[prevTrackRow][prevTrackCol] = -1;
        audio.id = prevAudioId[0] + '-' + gridSpace;
    }

    soundGrid[trackRow][trackCol] = audio.id;
}

function isEmptySpace(gridSpace){
    let trackRow = Math.floor(gridSpace/columns);
    let trackCol = gridSpace%columns;

    return (soundGrid[trackRow][trackCol] === -1) ? true : false;
}

/* ~~~~~  Drag and Drop Functions ~~~~~ */

// Handlers with the word "sound" in front are for elements on the grid

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
        data = data.split('_')[0];
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
    
    let data = e.dataTransfer.getData('text');
    let gridSpace = e.target.id.split('-')[2];
    let el = document.getElementById(data);
    let audio;

    if(isEmptySpace(gridSpace)){

        if(e.dataTransfer.dropEffect === 'copy'){
            audio = el.children[0].cloneNode(true);
            e.target.appendChild(createSoundEl(data, audio, gridSpace));
        } else {
            audio = el.children[0];

            let oldElId = el.id.split('-');
            el.id = oldElId[0] + "-" + oldElId[1] + '-' + gridSpace;
            e.target.appendChild(el);
        }

        e.currentTarget.style = '';
        appendSoundGrid(audio, gridSpace);
    }
}

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
        trackEmptySpace.id = "empty-space-" + emptySpaceCount++;
  
        tracksGridContainer.appendChild(trackEmptySpace);

        soundGrid[i][j] = -1; // currently has no sound
      }
    }
  }

  
function getTrackAudioState() {

    // State 0: Startup
    if (!isPlaying && !isPaused && !isStopped) {
      return 0;
    }
  
    // State 1: Audio is currently playing
    if (isPlaying && !isPaused && !isStopped) {
      return 1;
    }
  
    // State 2: Audio is paused
    if (isPlaying && isPaused && !isStopped) {
      return 2;
    }
  
    // State 3: Audio is stopped
    //if(isPlaying && (!isPaused || isPaused) && isStopped){ return 3;}
  
    // State 4: All audio is done playing
    if (!isPlaying && !isPaused && isStopped) {
      return 4;
    }
  
    // Error
    return -1;
  }
/* ===== Sound Visualization Functions ===== */

// Use AnalyserNode (Web Audio API)
// then pass output to a <canvas>