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