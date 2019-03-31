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
    soundEl.classList.add('is-filled--' + data.split('--')[0]);
    
    soundEl.draggable = true;
    soundEl.ondragstart = soundDragStart;
    soundEl.ondragend = onDragEnd;

    soundEl.id = 'filled-space--' + gridSpace;

    return soundEl;
}

function appendSoundGrid(audio, gridSpace){
    let trackRow = Math.floor(gridSpace/columns);
    let trackCol = gridSpace%columns;

    let isInSoundGrid = false;

    soundGrid.forEach(el => {
        if(el.includes(audio.id)){
            isInSoundGrid = true;
        }
    });

    if(!isInSoundGrid){
        audio.id += '--' + gridSpace;
        
    } else {
        let prevAudioId = audio.id.split('--');
        let prevGridSpace = prevAudioId[1];
        let prevTrackRow = Math.floor(prevGridSpace/columns);
        let prevTrackCol = prevGridSpace%columns;

        soundGrid[prevTrackRow][prevTrackCol] = -1;
        audio.id = prevAudioId[0] + '--' + gridSpace;
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

    let data = e.dataTransfer.getData('text');
    let gridSpace = e.target.id.split('--')[1];
    let el = document.getElementById(data);
    let audio;

    if(isEmptySpace(gridSpace)){

        if(e.dataTransfer.dropEffect === 'copy'){
            audio = el.children[0].cloneNode(true);
            e.target.appendChild(createSoundEl(data, audio, gridSpace));
        } else {
            audio = el.children[0];

            let oldElId = el.id.split('--');
            el.id = oldElId[0] + '--' + gridSpace;
            e.target.appendChild(el);
        }

        appendSoundGrid(audio, gridSpace);
    }

    e.currentTarget.style = '';
}