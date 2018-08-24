let musicMenuBtns = document.getElementsByClassName("header_music-menu")[0].querySelectorAll("button");
let backArrowBtn = document.getElementsByClassName("sound_search-bar")[0].querySelector("button");
let soundContainer = document.getElementsByClassName("sound_container");
let i;

for (i = 0; i < musicMenuBtns.length; i++) {
  musicMenuBtns[i].addEventListener("click", toggleSoundMenu);
  backArrowBtn.addEventListener("click", toggleSoundMenu);
}

function toggleSoundMenu() {

  let previousSelected = document.getElementsByClassName("header_music-menu")[0].querySelector("button.selected");

  let soundList = document.getElementsByClassName("sound_list " + this.innerText.toLowerCase());

// check if this button clicked is the same as the previous one (trying to unselect)
  if (this === previousSelected) {
    this.classList.remove("selected");
    soundContainer[0].classList.remove("active");
    soundList[0].classList.remove("active");
  } else {
    // check if we have clicked another button previously
    if (previousSelected) {
      previousSelected.classList.remove("selected");
      let previousSoundList = document.getElementsByClassName("sound_list " + previousSelected.innerText.toLowerCase());
      previousSoundList[0].classList.remove("active");
    }
    // check if we are clicking the back arrow
    if (this === backArrowBtn) {
      soundContainer[0].classList.remove("active");
    } else {
      this.classList.add("selected");
      soundContainer[0].classList.add("active");
      soundList[0].classList.add("active");
    }
  }

}
