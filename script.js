// global constants
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const loseSound = new Audio('https://cdn.glitch.global/1369dbfc-7547-47db-86db-1796cd7f36e7/mixkit-retro-arcade-lose-2027.wav?v=1650675027205');
const winSound = new Audio('https://cdn.glitch.global/1369dbfc-7547-47db-86db-1796cd7f36e7/mixkit-huge-crowd-cheering-victory-462.wav?v=1650675028682');

//Global Variables
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var cluePauseTime = 333; //how long to pause in between clues
var pattern = [1,2,3,1,3,1,3,2,3,4,4,3,2,4,3,4,5,3,5,3,5,4,5,6,6,5,4,6,5,1,2,3,4,5,6,6,2,3,4,5,6,7,7,3,4,5,6,7,8,8,7,6,4,7,5,8,5,3,2,1,2,3,4,5,6,7,8,5,8];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence()
}

function stopGame(){
    //initialize game variables
    gamePlaying = false;
    // swap the Start and Stop buttons
    document.getElementById("stopBtn").classList.add("hidden");
    document.getElementById("startBtn").classList.remove("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 293.66,
  3: 329.6,
  4: 349.23,
  5: 392,
  6: 440,
  7: 493.88,
  8: 533.26
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function loseGame(){
  stopGame();
  loseSound.play();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  winSound.play();
  alert("Game Over. You won.");  
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if (btn==pattern[guessCounter] && guessCounter==progress && guessCounter==pattern.length-1){
    winGame()
  }else if (btn!=pattern[guessCounter]){
    loseGame()
  }else if (guessCounter!=progress){
    guessCounter++
  }else if (guessCounter!=pattern.length-1){
    progress += 3
    guessCounter = 0
    playClueSequence()
    clueHoldTime -= 50
    cluePauseTime -= 33
  }
}
