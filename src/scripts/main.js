
/* ===== Global Variables ===== */

var tracksGridContainer = document.getElementsByClassName('tracks__grid-container')[0];
// Based on the columns and rows of tracks__grid-container
var columns = 12;
var rows = 3;
var soundGrid = [];

var instrumentsIndex = 0;
var instrumentGridCols = 3;
var instrumentsPosition = [1, 2, 3, 4, 5, 6];
var instruments = document.getElementsByClassName('instruments')[0];
var instrumentIcons = document.getElementsByClassName('instrument-icon');
var arrows = document.getElementsByClassName('arrow');

var libraryHeader = document.getElementsByClassName('library__header')[0];
var instrumentsContainer = document.getElementsByClassName('instruments-container')[0];
var sounds = document.getElementsByClassName('sounds');
var currentInstrument, currentSounds;

var playBtns = document.getElementsByClassName('sounds__play-btn');

var search = document.getElementsByName('search-bar')[0];

var tracksBtn = document.getElementsByClassName('tracks__btn')[0];
var skipToStartBtn = document.getElementsByClassName('skip-to-start-btn')[0];

// Keep track of audio and audio time
var currentBufferSources = [];
var currentAudioBuffers = []; 
var timeAtStart, offset;
var unpause = false;

var AudioContext = window.AudioContext || window.webkitAudioContext; // Cross browser variant
var audioContext = new AudioContext(); // is suspended at startup

var notificationBox = document.getElementsByClassName('notification')[0];



/* ===== Initialize Page ===== */

setTracksGridContainer();

