
/* ===== Global Variables ===== */

var tracksGridContainer = document.getElementsByClassName('tracks__grid-container')[0];
// Based on the columns and rows of tracks__grid-container
var columns = 12;
var rows = 3;
var soundGrid = [];

var instrumentsIndex = 0;
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
var sources = [];
var currentAudioBuffers = []; 
var analysers = [];
var timeAtStart, offset;
var unpause = false;

var AudioContext = window.AudioContext || window.webkitAudioContext; // Cross browser variant
var audioContext = new AudioContext(); // is suspended at startup

var notificationBox = document.getElementsByClassName('notification')[0];

var canvas = document.getElementsByClassName('canvas')[0];
var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
var animationTimer;
var colorTimer; 
var colorLocation;

var visualsBtn = document.getElementsByClassName('visuals-btn')[0];


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

function notifyUser(message){
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
        setNodes();
    } else {
        time = audioContext.currentTime;
        offset = audioContext.currentTime - timeAtStart;
        if (!offset){
            time = 0;
            offset = 0;
        }
        setNodes(time, offset);
        unpause = false;
    }

    if(gl){
        setVisualizations();
    }
  }

function pauseTrackAudio(){    
    sources.forEach(source => {
        source.stop();
    });        
    audioContext.suspend();
    if(gl){
        pauseVisualizations();
    }
}

function skipToStartTrackAudio(){
    sources[0].onended = false;
    timeAtStart = NaN;

    pauseTrackAudio();
    if(gl){
        endVisualizations();
    }
    if(tracksBtn.value === 'playing'){
        audioContext.resume().then(playTrackAudio());   
    }
  }

  /**
   * Returns the color representing the given sound/instrument.
   * 
   * @param {*} soundType The id of a sound element. 
   * The id must be of the following conventions: 
   * instrument--number or filled-space--number.
   * @param {*} getRGBA If set to true, the function will return
   * an array of float color values,
   * @returns {*} Color value. Will return -1 if no color value is found.
   */
function getSoundColor(soundType, getRGBA = false){

    if(soundType.includes('filled-space')){
        let el = document.getElementById(soundType);

        if (el){
            el.classList.forEach(name => {
                if(name.includes('is-filled')){
                    soundType = name.split('--')[1];
                }
            });
        }
    } else {
        soundType = soundType.split('--')[0];
    }

    // Color variables also found in styles.scss
    switch(soundType){
        case 'guitar':
            return getRGBA ? [0, 0, 0, 1.0] : 'blue';
        case 'piano':
            return getRGBA ? [1.0, 1.0, 0, 1.0] : 'yellow';
        case 'bass':
            return getRGBA ? [0, 0, 0, 1.0] : 'red';
        case 'percussion':
            return getRGBA ? [0, 0, 0, 1.0] : 'purple';
        case 'brass':
            return getRGBA ? [0, 0, 0, 1.0] : 'orange';
        case 'sounds':
            return getRGBA ? [0, 0, 0, 1.0] : 'green';
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

/**
 * Returns the column number of the farthest right sound.
 * Is used for finding the track with the longest audio length.
 */
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
/**
 *  Returns a 5 second, empty audio buffer
 */
function getEmptyAudioBuffer(){
    let emptyAudioBuffer = audioContext.createBuffer(2, audioContext.sampleRate * 5, audioContext.sampleRate);
    return emptyAudioBuffer;
}

/**
 * Creates and returns an audio buffer from the given filepath
 * @async
 * @param {*} filepath Audio src
 */
async function getAudioBuffer(filepath){
    const audioResponse = await fetch(filepath);
    const audioData = await audioResponse.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    return audioBuffer;
}

/**
 * Combines audio to form one single audio buffer per track, 
 * each the same length of time. 
 * 
 * @returns An array of audio buffers, one audio buffer per track
 */
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
          
        tempAudioBuffer.getChannelData(0).set(tempFloat32Array); // left
        tempAudioBuffer.getChannelData(1).set(tempFloat32Array); // right
        audioBufferArray.push(tempAudioBuffer);        
    }

    return audioBufferArray;
  }

function setNodes(time = 0, offset = 0){
    sources = [];
    analysers = [];
    currentAudioBuffers = getAudioBufferArray();

    currentAudioBuffers.forEach(audioBuffer => {
        let source = audioContext.createBufferSource();
        let analyser = audioContext.createAnalyser();

        source.buffer = audioBuffer;
        source.onended = handleEnd;
    
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        sources.push(source);
        analysers.push(analyser);

        source.start(time, offset);
    });
}

/**
 * Handler for the audio buffer source node. 
 * Runs when the audio ends.
 */
function handleEnd(){
    if ((tracksBtn.value === 'playing') && !unpause){
        tracksBtn.value = 'paused';
        tracksBtn.innerHTML = 'Play';
        if(gl){
            endVisualizations();
        }
    }
}

/**
 * Saves the given audio to the soundGrid array.
 * Audio is saved as an audio buffer.
 * 
 * @async
 * @param {*} data id of the dragged element
 * @param {*} audioFilePath Audio src
 * @param {*} gridSpace Represents a position on the soundGrid based on the number of columns and rows. See setTracksGridContainer().
 */
async function appendSoundGrid(data, audioFilePath, gridSpace){
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
                appendSoundGrid(data, audioFilePath, gridSpace);
                e.target.appendChild(createSoundEl(data, gridSpace));

            } else {
                let oldElId = el.id.split('--');
                el.id = oldElId[0] + '--' + gridSpace;
                e.target.appendChild(el);            
                setSoundGridIndex(oldElId[1], gridSpace);
            }
        }
    } else {
        notifyUser('Drop Function Unavailable During Playback'); 
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

/**
 * Sets elements (trackEmptySpace) on the track, 
 * and initializes soundGrid[][] with -1.
 * 
 * In other functions, the emptySpaceCount variable, used to create the trackEmptySpace id,
 * is referred to as gridSpace.
 */
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
/* ===== Sound Visualization Event Listeners ===== */

visualsBtn.addEventListener('click', function(){
    if(!gl){
        notifyUser('Unable to initialize sound visualizations. Your browser or machine might not support WebGL');
        return;
    }

    visualsBtn.classList.toggle('primary-btn--is-selected');
    if(visualsBtn.classList.contains('primary-btn--is-selected')){
        addCanvas();
    } else {
        removeCanvas();
    }
});



/* ===== Sound Visualization Functions ===== */

function addCanvas(){
    var library = document.getElementsByClassName('library')[0];
    library.classList.toggle('library--is-smaller');
    
    setTimeout(() => {
        var body = document.getElementsByTagName('body')[0];
        body.classList.toggle('body--new-grid-columns');

        canvas.parentElement.classList.remove('is-fading-out');
        canvas.parentElement.classList.add('is-fading-in');
        canvas.parentElement.classList.toggle('visualization');
        canvas.classList.remove('is-hidden');
        setCanvas();
    }, 1000);
}

function removeCanvas(){
    canvas.parentElement.classList.remove('is-fading-in');
    canvas.parentElement.classList.add('is-fading-out');

    var body = document.getElementsByTagName('body')[0];
    body.classList.toggle('body--new-grid-columns');

    setTimeout(function() {
        canvas.parentElement.classList.toggle('visualization');
        canvas.classList.add('is-hidden');

        var library = document.getElementsByClassName('library')[0];
        library.classList.toggle('library--is-smaller');
    }, 1000);
}

function setCanvas(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
}

/**
 * Will return true if canvas is hidden by the user (visuals btn is not toggled) 
 */
function canvasIsHidden(){
    if(canvas.classList.contains('is-hidden')){
        return true;
    }
    return false;
}

/**
 * Sets the color for the audio visualizations.
 * Color changes every 5 seconds.
 */
function setColor(track){

    // Get the column the audio is currently playing at
    let col = (offset > 0) ? (offset/5) : 0;
    let gridspace = (track * columns) + col;

    let elId = 'filled-space--' + gridspace;
    let color = getSoundColor(elId, true);

    if(color === -1){
        color = [0, 0, 0, 1];
    }

    gl.uniform4fv(colorLocation, new Float32Array(color));
}

/**
 * Creates and returns a WebGlShader of the given type using 
 * the given GLSL source code. 
 * Compiles the GLSL shader into binary data to be used by a WebGlProgram.
 * 
 * @param {*} src A string of GLSL source code
 * @param {*} type The type of shader to create. Must be either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @returns {WebGLShader}
 */
function createShader(src, type){
    var shader = gl.createShader(type);
    
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    // Notify the user if the shader failed
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        notifyUser('Unable to compile the shader program. See console for more info');
        console.log(gl.getProgramInfoLog(shader));
        return;
    }   

    return shader;
}

/**
 * Creates and returns a WebGlProgram. 
 * Attaches a vertex and fragment shader to the program 
 * based on the given strings and links the program to the WebGl rendering context.
 * 
 * @param {*} vstr A vertex shader string written in GLSL
 * @param {*} fstr A fragment shader string written in GLSL
 * @returns {WebGLProgram} A WebGlProgram
 */
function createProgram(vstr, fstr){
    var program = gl.createProgram();
    
    var vertexShader = createShader(vstr, gl.VERTEX_SHADER);
    var fragmentShader = createShader(fstr, gl.FRAGMENT_SHADER);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    // Notify the user if the shader program failed
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        notifyUser('Unable to initiliaze the shader program. See console for more info');
        console.log(gl.getProgramInfoLog(program));
        return;
    }   

    return program;
}

/**
 * Set up the audio visualizations
 */
function setVisualizations(){
    if(canvasIsHidden()){
        return;
    }

    // In case of canvas resizing
    setCanvas();

    var vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);

    // Shaders
    var vs = `
        attribute vec2 vertexPosition;

        void main() {
            gl_Position = vec4(vertexPosition, 0, 1);
        }
    `;

    var fs = `
        precision mediump float;
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }
    `;

    var program = createProgram(vs, fs);

    program.vertexPosAttrib = gl.getAttribLocation(program, 'vertexPosition');
    colorLocation = gl.getUniformLocation(program, 'color');

    gl.enableVertexAttribArray(program.vertexPosAttrib);
    gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    draw();
}


function draw(){
    animationTimer = requestAnimationFrame(draw);
    
    // In case of canvas resizing
    setCanvas();

    for (let track = 0; track < analysers.length; track++) {
        setColor(track);
        
        // Write to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, getCoordinates(track), gl.STATIC_DRAW);

        gl.drawArrays(gl.LINE_STRIP, 0, analysers[track].fftSize);
    }
}

/**
 * Returns a Float32Array filled with data representing x and y coordinates. 
 * All data is between -1 and 1 (clipspace).
 * Even indices are the x-coordinates and odd indices are the y-coordinates. 
 * The y-coordinate represents audio waveform (time domain) data.
 * 
 * @param {*} track The track (row) whose coordinates we want
 * @returns {Float32Array}
 */
function getCoordinates(track){
    var bufferLength = analysers[track].fftSize;
    var waveform = new Float32Array(bufferLength);
    analysers[track].getFloatTimeDomainData(waveform);

    let coordinates = new Float32Array(bufferLength*2);
    var width = 2/bufferLength; // width of each x-coordinate from 0.0 -> 2.0

    for (let i = 0, j = 0; i < coordinates.length; i++) {
        if (i % 2 === 0) {
            coordinates[i] = i*width - 1; // Set each x-coordinate from -1 -> 1
        } else {
            coordinates[i] = waveform[j++]; // y-coordinate
        }
    }    

    return coordinates;
}

function pauseVisualizations(){
    if(canvasIsHidden()){
        return;
    }
    cancelAnimationFrame(animationTimer);
}

/**
 * Called when track audio ends. See handleEnd().
 */
function endVisualizations(){
    if(canvasIsHidden()){
        return;
    }
    pauseVisualizations();
    gl.clearColor(0, 0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

