
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