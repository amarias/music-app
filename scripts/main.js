
/* ~~~~~ Global Variables ~~~~~ */

let headerBtns = document.getElementsByClassName("header_container")[0].querySelectorAll("button");
let backBtn = document.getElementsByClassName("back_btn");
let playBtns = document.getElementsByClassName("sound_play-btn");
let soundTime = document.getElementsByClassName("sound_time");
let search = document.getElementsByName("sound_search-bar")[0];

/* ~~~~~ Loop and Functions ~~~~~ */

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

// Returns name of the second menu's container, header, and content based on given header btn
function getSecondMenuNames(btn) {

  let container;
  let header;
  let content;
  let btnName = btn.innerText.toLowerCase();

  switch (btnName) {
    case "settings":
      container = "settings_container";
      header = "settings_header";
      content = "settings_content";
      break;
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

function showSecondMenu(btn) {

  if (btn.innerText.toLowerCase() === "all") {
    let all = document.getElementsByClassName("sound_list");

    for (let i = 0; i < all.length; i++) {
      all[i].classList.add("active");
    }
  }

  let btnNameArray = getSecondMenuNames(btn);

  document.getElementsByClassName(btnNameArray[0])[0].classList.add("active");
  document.getElementsByClassName(btnNameArray[2])[0].classList.add("active");
}

function removeSecondMenu(btn) {

  if (btn.innerText.toLowerCase() === "all") {
    let all = document.getElementsByClassName("sound_list");

    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("active");
    }
  }

  let btnNameArray = getSecondMenuNames(btn);

  document.getElementsByClassName(btnNameArray[0])[0].classList.remove("active");
  document.getElementsByClassName(btnNameArray[2])[0].classList.remove("active");
}

// Either displays or removes second menu based on what button was pressed
function toggleSecondMenu() {

  // Search for a previously selected btn
  let prevSelected = document.querySelector("button.selected");

  if (prevSelected) {
    prevSelected.classList.remove("selected");
    removeSecondMenu(prevSelected);
  } else {
    this.classList.add("selected");
    showSecondMenu(this);
    return;
  }

  // Check the button type; that it isn't the same button pressed twice or the back btn
  if ((this != prevSelected) && (this.innerText != backBtn[0].innerText)) {
    this.classList.add("selected");
    showSecondMenu(this);
  }

}

search.addEventListener("change", filter);

// Filters through the currently displayed list of sounds based on user input
function filter() {

  let filter = search.value.toLowerCase();
  let soundList = document.getElementsByClassName("sound_container")[0].querySelectorAll("li");

  for (let i = 0; i < soundList.length; i++) {
    if (soundList[i].innerText.toLowerCase().indexOf(filter) === -1) {
      soundList[i].classList.add("hide");
    } else {
      soundList[i].classList.remove("hide");
    }
  }

}

for (let i = 0; i < playBtns.length; i++) {
  playBtns[i].addEventListener("click", handleSound);
  addTimeStamp(soundTime[i], playBtns[i]);
}

function getAudioElement(btn){
  let audioName = btn.nextElementSibling.children;
  let audio = document.getElementById(audioName[0].innerText.toLowerCase());

  return audio;
}

// returns a leading zero if the given number is less than 10
function pad(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}

// Handles play button
function handleSound() {
  let audio = getAudioElement(this);
  let btn = this;

  audio.addEventListener("pause", function(){
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

function addTimeStamp(timeStamp, btn) {
  let audio = getAudioElement(btn);
  let time = audio.duration;

  timeStamp.innerText = Math.trunc(time/60) + ":" + pad(Math.round((time%60)));
}

function dragstart_handler(e){
  e.currentTarget.style.opacity = 0.5;
  e.dataTransfer.setData("text", e.currentTarget.id);
  e.dataTransfer.effectAllowed = "copy";
}

function dragend_handler(e){
  e.currentTarget.style.opacity = "";
}

function dragover_handler(e){
  e.preventDefault();
  e.currentTarget.style.backgroundColor = "inherit";
}

function dragleave_handler(e){
  e.currentTarget.style.backgroundColor = "";
}

function drop_handler(e){
  e.preventDefault();
  let dataName = e.dataTransfer.getData("text");
  let data = document.getElementById(dataName).cloneNode(true);
  let player = data.firstElementChild.nextElementSibling;

  // Leave only the audio and its info
  player.removeChild(player.firstElementChild);
  player.removeChild(player.lastElementChild);

  // New styling
  data.style.opacity = "";
  data.classList.add("li-new-style");
  player.classList.add("sound_info-new-style");

  e.target.appendChild(data);
  e.currentTarget.style.backgroundColor = "";
}
