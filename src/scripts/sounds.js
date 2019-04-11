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