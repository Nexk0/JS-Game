let img = new Image();
img.src = 'animation.png';
img.onload = function() {
  init();
};

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
const scale = 2;
const width = 50;
const height = 38;
const scaledWidth = scale * width;
const scaledHeight = scale * height;

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
                  frameX * width, frameY * height, width, height,
                  canvasX, canvasY, scaledWidth, scaledHeight);
  }
  
  function init() {
    drawFrame(0, 0, 0, 0);
    drawFrame(1, 0, scaledWidth, 0);
    drawFrame(0, 0, scaledWidth * 2, 0);
    drawFrame(2, 0, scaledWidth * 3, 0);
  }
  

  window.requestAnimationFrame(step);

function step() {
  // do something
  window.requestAnimationFrame(step);
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
drawFrame(0, 0, 0, 0);
// repeat for each frame

const cycleLoop = [0, 1, 0, 2];
let currentLoopIndex = 0;
let frameCount = 0;
let currentDirection = 0;

function step() {
  frameCount++;
  if (frameCount < 15) {
    window.requestAnimationFrame(step);
    return;
  }
  frameCount = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFrame(cycleLoop[currentLoopIndex], currentDirection, 0, 0);
  currentLoopIndex++;
  if (currentLoopIndex >= cycleLoop.length) {
    currentLoopIndex = 0;
    currentDirection++; // Next row/direction in the sprite sheet
  }
  // Reset to the "down" direction once we've run through them all
  if (currentDirection >= 4) {
    currentDirection = 0;
  }
  window.requestAnimationFrame(step);
}
