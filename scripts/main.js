let headerBtns = document.getElementsByClassName("header_container")[0].querySelectorAll("button");
let backBtn = document.getElementsByClassName("back_btn");

let search = document.getElementsByName("sound_search-bar")[0];
search.addEventListener("change", filter);

/* Adds event listeners to all btns in header and the back btns */
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

/* Returns name of the second menu's container, header, and content based on given header btn */
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

/* Displays second menu based on given header btn */
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

/* Removes display of second menu based on given btn */
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

/* Either displays or removes second menu based on what button was pressed */
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
