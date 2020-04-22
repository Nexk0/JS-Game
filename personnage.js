// Valeurs Globales constantes
const SCALE = 1    // Taille du sprite 
const WIDTH = 50  // Largeur du Sprite
const HEIGHT = 37   // Hauteur  du Sprite
const SCALED_WIDTH = SCALE * WIDTH
const SCALED_HEIGHT = SCALE * HEIGHT
const CYCLE_LOOP = [0, 1, 2, 3] // Tableau pour 4 éléements dans le sprite
const CYCLE_LOOP_JUMP = [0, 1, 2, 3, 4]  // Tableau pour 8 éléements dans le sprite  /!\/!\/!\ Seulement 5 sprites sont prises en compte
const CYCLE_LOOP_SLIDE = [0, 1, 2, 3, 4]  // Tableau pour 5 éléements dans le sprite
const FACING_RIGHT = 0  // Action droite
const FACING_LEFT = 1 // Action courir gauche
const STAND_STILL = 2   // Action IDLE
const FACING_UP_RIGHT = 3   // Action Sauter à gauche
const FACING_UP_LEFT = 4
const FACING_DOWN_RIGHT = 5 
const FACING_DOWN_LEFT = 6  
const FRAME_LIMIT = 12  // Vitesse de changement entre chaque frame
const MOVEMENT_SPEED = 1 // Vitesse de déplacement

let jumpingLeft = false
let isSlidingLeft = false  
let hasSlided = false // à glisser
let isSliding = false // Glisse 
let hasJumped = false // à sauter
let msJump = 0  // Vitesse de saut
let canvas = document.querySelector('canvas')  
let ctx = canvas.getContext('2d') 
let keyPresses = {}
let currentDirection = FACING_DOWN_RIGHT 
let currentLoopIndex = 0    // à mettre {...}
let frameCount = 0        // Compte les frames (jusqu'à 12 sur ce code)
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
  img.src = 'runAnimation.png'      // <--  source de l'image 
    img.onload = function() {
    window.requestAnimationFrame(gameLoop)
  }
}

function drawFrame(frameX, frameY, canvasX, canvasY) {        // Ne pas toucher, fonction pour afficher le perso
  ctx.drawImage(img,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT)
}

loadImage()

function gameLoop() {                                 // Fonction principale 
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let hasMoved = false

  positionY -= msJump         // {...} Permet d'arreter le saut 
  if ( positionY > canvas.height - HEIGHT && hasJumped == true) {
      hasJumped = false
      msJump = 0
      currentLoopIndex = 0
  }
  if (msJump !== 0 ) {    // Ajout de la gravité 
    msJump *= .99
    msJump -= .1
  }

  if (keyPresses.z && !hasJumped && keyPresses.d ) {   // Empeche de slider après un saut ou un slide de 1.5secondes
    currentLoopIndex = 0
    msJump = 3.5
    hasJumped = true
    isSliding = false
    hasSlided = true
    setTimeout(() => {
      hasSlided = false
    }, 1500);
   } else if (keyPresses.z && !hasJumped && keyPresses.q){
    currentLoopIndex = 0
    msJump = 3.5
    hasJumped = true
    isSliding = false
    hasSlided = true
    jumpingLeft = true
    setTimeout(() => {
      hasSlided = false
    }, 1500);
   }

   
  if (keyPresses.q && !isSliding) {               // Courir vers la gauche
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT)
    hasMoved = true
  } else if (keyPresses.d && !isSliding) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT)        // Courir vers la droite
    hasMoved = true
  }

  if (keyPresses.d && keyPresses.s && !hasSlided && !isSliding) {       // Permetde slide vers la droite si le perso ne slide pas et n'a pas déjà slider
    moveCharacter(0, 0, FACING_DOWN_RIGHT)
    currentLoopIndex = 0
    isSliding = true
  } else if (keyPresses.q && keyPresses.s && !hasSlided && !isSliding) {       
    moveCharacter(0, 0, FACING_DOWN_LEFT)
    currentLoopIndex = 0
    isSliding = true
    isSlidingLeft = true
  }


  if (!hasMoved) {                      // Animation IDLE 
    moveCharacter(0, 0, STAND_STILL)
  }

  if (!hasJumped && !isSliding) {         // Cycle des frames de base 
    frameCount++
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0
      currentLoopIndex++
      if (currentLoopIndex >= CYCLE_LOOP.length) {
        currentLoopIndex = 0
      }
    }
  } else if (hasJumped) {         // Cycle des frames pour le saut 
    if (jumpingLeft == false) {
      currentDirection = FACING_UP_RIGHT
    } else if (jumpingLeft == true) {
      currentDirection = FACING_UP_LEFT
    }
    frameCount++
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0
      currentLoopIndex++
      if (currentLoopIndex >= CYCLE_LOOP_JUMP.length) {
        currentLoopIndex = 0
        jumpingLeft = false
      }
    }
  } else if (isSliding) {                               // Cycle des frames pour le slide     
      if (isSlidingLeft == false) {
      moveCharacter(MOVEMENT_SPEED, 0, FACING_DOWN_RIGHT)
      currentDirection = FACING_DOWN_RIGHT 
      } else if (isSlidingLeft == true) {
        moveCharacter(-MOVEMENT_SPEED, 0, FACING_UP_LEFT)
        currentDirection = FACING_DOWN_LEFT 
        }
        frameCount++
      if (frameCount >= FRAME_LIMIT) {
        frameCount = 0
        currentLoopIndex++
        if (currentLoopIndex >= CYCLE_LOOP.length) {
            currentLoopIndex = 0
            hasSlided = true
            isSliding = false
            isSlidingLeft = false
            setTimeout(() => {
              hasSlided = false
            }, 1000);
        }
      }
    }

  if (positionY > canvas.height - HEIGHT) {
      positionY = canvas.height - HEIGHT
  }

  if (!hasJumped && !isSliding) {   
  drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY)           // Appelle de Drawframe pour l'affichage des frames de base
  } else if (hasJumped) { 
    drawFrame(CYCLE_LOOP_JUMP[currentLoopIndex], currentDirection, positionX, positionY)      // Appelle de Drawframe pour l'affichage des frames de saut
  } else{
    drawFrame(CYCLE_LOOP_SLIDE[currentLoopIndex], currentDirection, positionX, positionY)     // Appelle de Drawframe pour l'affichage des frames de slide
  }
  window.requestAnimationFrame(gameLoop)
  // console.log(currentLoopIndex)  // Pour vérifier la valeur actuelle de la frame en cas de problème
}

function moveCharacter(deltaX, deltaY, direction) {                                    // Déplacement du personnage
  if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
    positionX += deltaX
  }
  if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
    positionY += deltaY
  }
  currentDirection = direction
}
