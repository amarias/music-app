/* ===== Sounds Functions ===== */

// Colors found in styles.scss
function getSoundColor(soundId){
    switch(soundId.split('_')[0]){
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
      default:
        return 'green';
    }
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
    e.preventDefault();

    let color = getSoundColor(e.dataTransfer.getData('text'));

    e.currentTarget.style.backgroundColor = color;
    e.dataTransfer.dropEffect = 'copyMove';
}

function onDragLeave(e){
    e.currentTarget.style = '';
}

function onDrop(e) {
    e.preventDefault();
    let data = e.dataTransfer.getData('text');
    let audio = document.getElementById(data).children[0].cloneNode(true);
    let name = document.getElementById(data).children[2].cloneNode(true);

    let soundEl = document.createElement('div');
    soundEl.appendChild(audio);
    soundEl.appendChild(name);
    soundEl.classList.add('track-filled-space');
    soundEl.classList.add('is-filled--' + data.split('_')[0]);

    e.target.appendChild(soundEl);
}