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