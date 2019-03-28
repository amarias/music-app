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