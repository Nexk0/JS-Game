


const SCALE = 1
const WIDTH = 50
const HEIGHT = 37
const SCALED_WIDTH = SCALE * WIDTH
const SCALED_HEIGHT = SCALE * HEIGHT
const CYCLE_LOOP = [0, 1, 2, 3]
const CYCLE_LOOP_JUMP = [0, 1, 2, 3, 4, 5, 6, 7]
const CYCLE_LOOP_SLIDE = [0, 1, 2, 3, 4]
const FACING_DOWN = 4
const FACING_UP = 3
const FACING_LEFT = 1
const FACING_RIGHT = 0
const STAND_STILL = 2
const FRAME_LIMIT = 12
const MOVEMENT_SPEED = 1

let hasSlided = false
let isSliding = false
let compteurSlide = 0
let hasJumped = false
let msJump = 0
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let keyPresses = {}
let currentDirection = FACING_DOWN
let currentLoopIndex = 0
let frameCount = 0
let positionX = 0
let positionY = canvas.height - HEIGHT
let img = new Image()

window.addEventListener('keydown', keyDownListener)
function keyDownListener(event) {
    keyPresses[event.key] = true
}

window.addEventListener('keyup', keyUpListener)
function keyUpListener(event) {
    keyPresses[event.key] = false
}

function loadImage() {
  img.src = 'runAnimation.png'
  img.onload = function() {
    window.requestAnimationFrame(gameLoop)
  }
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(img,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT)
}

loadImage()

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let hasMoved = false
  let compteurSlideBool = false

  positionY -= msJump
  if ( positionY > canvas.height - HEIGHT && hasJumped == true) {
      hasJumped = false
      msJump = 0
      currentLoopIndex = 0
  }
  if (msJump !== 0 ) {
    msJump *= .99
    msJump -= .1
  }

  if (keyPresses.z && !hasJumped) {
    currentLoopIndex = 0
    msJump = 3.5
    hasJumped = true
    isSliding = false
    hasSlided = true
    setTimeout(() => {
      hasSlided = false
    }, 1500);
   } 

  if (keyPresses.q && !isSliding) {
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT)
    hasMoved = true
  } else if (keyPresses.d && !isSliding) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT)
    hasMoved = true
  }

  if (keyPresses.d && keyPresses.s && !hasSlided && !isSliding) {
    moveCharacter(0, 0, FACING_DOWN)
    currentLoopIndex = 0
    isSliding = true
  }

  if (!hasMoved) {
    moveCharacter(0, 0, STAND_STILL)
  }

  if (!hasJumped && !isSliding) {
    frameCount++
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0
      currentLoopIndex++
      if (currentLoopIndex >= CYCLE_LOOP.length) {
        currentLoopIndex = 0
      }
    }
  } else if (hasJumped) {
    currentDirection = FACING_UP
    frameCount++
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0
      currentLoopIndex++
      if (currentLoopIndex >= CYCLE_LOOP_JUMP.length) {
        currentLoopIndex = 0
      }
    }
  } else if (isSliding) {
      moveCharacter(MOVEMENT_SPEED, 0, FACING_DOWN)
      currentDirection = FACING_DOWN
      frameCount++
      if (frameCount >= FRAME_LIMIT) {
        frameCount = 0
        currentLoopIndex++
        if (currentLoopIndex >= CYCLE_LOOP.length) {
            currentLoopIndex = 0
            hasSlided = true
            isSliding = false
            setTimeout(() => {
              hasSlided = false
            }, 1000);
        }
      }
    }
 


  //  if (compteurSlideBool == true) {
  //   compteurSlide++
  //   console.log(compteurSlide,'salope')
  //     if (compteurSlide == 8) {
  //     }
  //   }


  if (positionY > canvas.height - HEIGHT) {
      positionY = canvas.height - HEIGHT
  }

  if (!hasJumped && !isSliding) {
  drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY)
  } else if (hasJumped) { 
    drawFrame(CYCLE_LOOP_JUMP[currentLoopIndex], currentDirection, positionX, positionY)
  } else{
    drawFrame(CYCLE_LOOP_SLIDE[currentLoopIndex], currentDirection, positionX, positionY)
  }
  window.requestAnimationFrame(gameLoop)
  // console.log(currentLoopIndex)
}

function moveCharacter(deltaX, deltaY, direction) {
  if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
    positionX += deltaX
  }
  if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
    positionY += deltaY
  }
  currentDirection = direction
}
