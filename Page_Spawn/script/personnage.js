// Valeurs Globales constantes
const SCALE = 1 // Taille du sprite 
const SCALE_FIRE = 0.3
const SCALE_GOLD = 1
const WIDTH = 50 // Largeur du Sprite
const HEIGHT = 37 // Hauteur  du Sprite
const FIRE_WIDTH = 125
const FIRE_HEIGHT = 208 
const GOLD_WIDTH = 32
const GOLD_HEIGHT = 32
const SCALED_WIDTH = SCALE * WIDTH
const SCALED_HEIGHT = SCALE * HEIGHT
const SCALED_WIDTH_FIRE = SCALE_FIRE * FIRE_WIDTH
const SCALED_HEIGHT_FIRE = SCALE_FIRE * FIRE_HEIGHT
const SCALED_WIDTH_GOLD = SCALE_GOLD * GOLD_WIDTH
const SCALED_HEIGHT_GOLD = SCALE_GOLD * GOLD_HEIGHT
const CYCLE_LOOP = [0, 1, 2, 3] // Tableau pour 4 éléements dans le sprite
const CYCLE_LOOP_JUMP = [0, 1, 2, 3, 4] // Tableau pour 8 éléements dans le sprite  /!\/!\/!\ Seulement 5 sprites sont prises en compte
const CYCLE_LOOP_SLIDE = [0, 1, 2, 3, 4] // Tableau pour 5 éléements dans le sprite
const CYCLE_LOOP_PRIMARTY_ATTACK = [0, 1, 2, 3, 4, 5, 6, 7] // Tableau pour attaquer à droite
const CYCLE_LOOP_PRIMARTY_ATTACK_LEFT = [7, 6, 5, 4, 3, 2, 1, 0] // reverse du tableau pour attaquer à gauche
const CYCLE_LOOP_FIRE = [5, 6, 7, 8, 9]
const CYCLE_LOOP_GOLD = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const FACING_RIGHT = 0 // Action droite
const FACING_LEFT = 1 // Action courir gauche
const STAND_STILL = 2 // Action IDLE
const FACING_UP_RIGHT = 3 // Action Sauter à gauche
const FACING_UP_LEFT = 4
const FACING_DOWN_RIGHT = 5
const FACING_DOWN_LEFT = 6
const FACING_PRIMARY_ATTACK = 7
const FACING_PRIMARY_ATTACK_LEFT = 8
const STAND_STILL_LEFT = 9
const MOVEMENT_SPEED = 2 // Vitesse de déplacement
const DECAL_CHAR_X = 15
const CHARWIDTH = 20
const LIFE = 3

let frameCountGold = 0
let currentGoldLoopIndex = 0
let frameCountFire = 0
let currentFireLoopIndex = 0
let charX
let charY 
let lookingLeft = false
let lookingRight = false
let frameLimit = 12 // Vitesse de changement entre chaque frame
let hasAttacked = false
let primaryAttack = false
let hasSlided = false // à glisser
let isSliding = false // Glisse 
let hasJumped = false // à sauter
let onGround = true;
let msJump = 0 // Vitesse de saut
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let keyPresses = {}
let currentDirection = STAND_STILL
let currentLoopIndex = 0 // à mettre {...}
let frameCount = 0 // Compte les frames (jusqu'à 12 sur ce code)
let positionX = 60
let positionY = 134
let img = new Image()
let imgFire = new Image()
let imgGold = new Image()
let vy = 0;
let vx = 0;
let audioMusic = new Audio()
audioMusic.loop = true
audioMusic.volume = 0.3
audioMusic.src = "./dev/assets/sounds/loop.wav"
audioMusic.play()


class Plateform{                        // Orienté objet pôur la création de la plateform
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 165, 0, 0)'                // Couleurs de la platerformes (invisible ici)
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Fire{
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    draw() { 
        ctx.fillStyle = 'rgba(255, 165, 0, 0)'  
        drawFrameFire(CYCLE_LOOP_FIRE[currentFireLoopIndex], 0, this.x, this.y)       
    }
}
class Gold{
    constructor(x, y) {
        this.x = x
        this.y = y
        this.pickupGold = false
    }
    draw() { 
        ctx.fillStyle = 'rgba(255, 165, 0, 0)'  
        drawFrameGold(CYCLE_LOOP_GOLD[currentGoldLoopIndex], 0, this.x, this.y)       
    }
}

let golds = []   // Ajout des Golds
golds.push(new Gold(595, 110))  
golds.push(new Gold(635, 180)) 
golds.push(new Gold(685, 240))                     

let fires = []   // Ajout du feu
fires.push(new Fire(262, 174))                      
fires.push(new Fire(262, 405))

let plateforms = []     // Ajout de plateformes
plateforms.push(new Plateform(0, 171, 269, 73))
plateforms.push(new Plateform(269, 220, 26, 24))
plateforms.push(new Plateform(293, 171, 250, 73))
plateforms.push(new Plateform(0, 405, 269, 60))
plateforms.push(new Plateform(294, 405, 510, 60))
plateforms.push(new Plateform(800, 205, 100, 250))
plateforms.push(new Plateform(0, 85, 70, 90))



window.addEventListener('keydown', keyDownListener)

function keyDownListener(event) {
    keyPresses[event.key] = true
}

window.addEventListener('keyup', keyUpListener)

function keyUpListener(event) {
    keyPresses[event.key] = false
}

document.onclick = function () {
    if (!hasJumped && !hasSlided && !hasAttacked && lookingRight) {
        moveCharacter(0, 0, FACING_PRIMARY_ATTACK)
        currentLoopIndex = 0
        primaryAttack = true
        hasAttacked = true
        setTimeout(() => {
            hasAttacked = false
        }, 700)
    } else if (!hasJumped && !hasSlided && !hasAttacked && lookingLeft) {
        moveCharacter(0, 0, FACING_PRIMARY_ATTACK_LEFT)
        currentLoopIndex = 0
        primaryAttack = true
        hasAttacked = true
        setTimeout(() => {
            hasAttacked = false
        }, 700)
    }
}


function loadImage() {
    img.src = 'runAnimation.png' // source de l'image du personnage principale
    img.onload = function () {
        window.requestAnimationFrame(gameLoop)
    }
}

function drawFrame(frameX, frameY, canvasX, canvasY) { // Ne pas toucher, fonction pour afficher le perso
    ctx.drawImage(img,
        frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
        canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT)
}




function loadImageFire() {
    imgFire.src = './Fire/Firesheet.png' // source de l'image du feu
    imgFire.onload = function () {
    }
}

function drawFrameFire(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(imgFire,
        frameX * FIRE_WIDTH, frameY * FIRE_HEIGHT, FIRE_WIDTH, FIRE_HEIGHT,
        canvasX, canvasY, SCALED_WIDTH_FIRE, SCALED_HEIGHT_FIRE)
        
}



function loadImageGold() {
    imgGold.src = './Gold/Gold.png' // source de l'image du gold
    imgGold.onload = function () {
    }
}

function drawFrameGold(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(imgGold,
        frameX * GOLD_WIDTH, frameY * GOLD_HEIGHT, GOLD_WIDTH, GOLD_HEIGHT,
        canvasX, canvasY, SCALED_WIDTH_GOLD, SCALED_HEIGHT_GOLD)
        
}


loadImageGold()
loadImageFire()
loadImage()

function gameLoop() { // Fonction principale s'occupe des dessins, animations et actions
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(!checkPlayerCollision(0,-2)) {
        positionY -= msJump // {...} Permet d'arreter le saut
    }
    else {
        if(msJump<0) positionY -= msJump
        else msJump = 0
    }

    charX = positionX + DECAL_CHAR_X                // Création de la plateform
    charY = positionY 
    plateforms.forEach(function (plateform){
        plateform.draw()
    }) 

    let hasMoved = false

    positionY=Math.round(positionY)
    if(!hasJumped && checkPlayerCollision(0, 1)) onGround = true
    else onGround = false
    if(!checkPlayerCollision(0,-2) && hasJumped && checkPlayerCollision(0, Math.floor(-msJump))) {
        console.log(parseInt(positionY+HEIGHT))
        console.log(parseInt(positionY+HEIGHT))
        //onGround = true
        hasJumped = false
        currentLoopIndex = 0
        msJump = 0
    }
    

    //console.log("")

    //console.log(onGround+" "+parseInt(positionY + HEIGHT))

    if (onGround) msJump = 0
    else if (!onGround) { // Ajout de la gravité 
        /* msJump *= .99 */
        //console.log("test2")
        msJump = Math.floor(msJump*10)/10
        msJump -= .1
    }

    /* vy = msJump;
    vx = 0; */

    // KEYPRESS // 

    if (keyPresses.z && !hasJumped && keyPresses.d) { // Empeche de slider après un saut ou un slide de 1.5secondes
        currentLoopIndex = 0
        msJump = 3.5
        hasJumped = true
        isSliding = false
        hasSlided = true
        let jumpSoundRight = new Audio()
        jumpSoundRight.src = "./dev/assets/sounds/jump.wav"
        jumpSoundRight.play()
        setTimeout(() => {
            hasSlided = false
        }, 1500);
    } else if (keyPresses.z && !hasJumped && keyPresses.q) {
        currentLoopIndex = 0
        msJump = 3.5
        hasJumped = true
        isSliding = false
        hasSlided = true
        jumpingLeft = true
        let jumpSoundLeft = new Audio()
        jumpSoundLeft.src = "./dev/assets/sounds/jump.wav"
        jumpSoundLeft.play()
        setTimeout(() => {
            hasSlided = false
        }, 1500);
    }


    if (keyPresses.q && !isSliding) { // Courir vers la gauche
        // On regarde si il y aura une collision, si oui on effectue l'animation mais on ne déplace pas le personnage
        if(!checkPlayerCollision(-MOVEMENT_SPEED, 0)) moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT)
        else moveCharacter(0, 0, FACING_LEFT)
        hasMoved = true
        lookingLeft = true
        lookingRight = false
    } else if (keyPresses.d && !isSliding) {
        // On regarde si il y aura une collision, si oui on effectue l'animation mais on ne déplace pas le personnage
        if(!checkPlayerCollision(MOVEMENT_SPEED, 0)) moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT) // Courir vers la droite
        else moveCharacter(0, 0, FACING_RIGHT)
        hasMoved = true
        lookingLeft = false
        lookingRight = true
    }

    if (keyPresses.d && keyPresses.s && !hasSlided && !isSliding) { // Permetde slide vers la droite si le perso ne slide pas et n'a pas déjà slider
        moveCharacter(0, 0, FACING_DOWN_RIGHT)
        currentLoopIndex = 0
        isSliding = true
        let slideSoundRight = new Audio()
        slideSoundRight.src = "./dev/assets/sounds/slide.wav"
        slideSoundRight.play()
    } else if (keyPresses.q && keyPresses.s && !hasSlided && !isSliding) {
        moveCharacter(0, 0, FACING_DOWN_LEFT)
        currentLoopIndex = 0
        isSliding = true
        isSlidingLeft = true
        let slideSoundLeft = new Audio()
        slideSoundLeft.src = "./dev/assets/sounds/slide.wav"
        slideSoundLeft.play()
    }


    if (!hasMoved && lookingRight) { // Animation IDLE (n'est pas un keypress meme si il est dans le commentaire keypress)
        moveCharacter(0, 0, STAND_STILL)
    } else if (lookingLeft && !hasMoved) {
        moveCharacter(0, 0, STAND_STILL_LEFT)
    }

    if (checkFireCollision(charX, charY)) {
        positionX = 60
        positionY = 130
    }

    checkGoldCollision(charX, charY)
    

    // CYCLES //

    if (!hasJumped && !isSliding && !primaryAttack) { // Cycle des frames de base 
        frameCount++
        if (frameCount >= frameLimit) {
            frameCount = 0
            currentLoopIndex++
            if (currentLoopIndex >= CYCLE_LOOP.length) {
                currentLoopIndex = 0
            }
        }
    } else if (hasJumped) { // Cycle des frames pour le saut 
        if (lookingRight) {
            currentDirection = FACING_UP_RIGHT
        } 
        if (lookingLeft) {
            currentDirection = FACING_UP_LEFT
        }
        frameCount++
        if (frameCount >= frameLimit) {
            frameCount = 0
            currentLoopIndex++
            if (currentLoopIndex >= CYCLE_LOOP_JUMP.length) {
                currentLoopIndex = 0
            }
        }
    } else if (isSliding) { // Cycle des frames pour le slide     
        if (lookingRight) {
            if(!checkPlayerCollision(MOVEMENT_SPEED, 0)) moveCharacter(MOVEMENT_SPEED, 0, FACING_DOWN_RIGHT)
            else moveCharacter(0, 0, FACING_DOWN_RIGHT)
            currentDirection = FACING_DOWN_RIGHT
        } else if (lookingLeft) {
            if(!checkPlayerCollision(-MOVEMENT_SPEED, 0)) moveCharacter(-MOVEMENT_SPEED, 0, FACING_UP_LEFT)
            else moveCharacter(0, 0, FACING_UP_LEFT)
            currentDirection = FACING_DOWN_LEFT
        }
        frameCount++
        if (frameCount >= frameLimit) {
            frameCount = 0
            currentLoopIndex++
            if (currentLoopIndex >= CYCLE_LOOP.length) {
                currentLoopIndex = 0
                hasSlided = true
                isSliding = false
                setTimeout(() => {
                    hasSlided = false
                }, 1000)
            }
        }
    } else if (primaryAttack) { // Cycle des frames pour l'attaque
        frameCount++
        let frameLimit = 6
        if (lookingRight) {
        currentDirection = FACING_PRIMARY_ATTACK
        }   else if (lookingLeft) {
            currentDirection = FACING_PRIMARY_ATTACK_LEFT
        } 
        if (frameCount >= frameLimit) {
            frameCount = 0
            currentLoopIndex++
            if (currentLoopIndex >= CYCLE_LOOP_PRIMARTY_ATTACK.length) {
                currentLoopIndex = 0
                primaryAttack = false
            }
        }
    }

                             
    frameCountFire++    // Cycle des frames du feu 
    if (frameCountFire >= frameLimit) {
        frameCountFire = 0
        currentFireLoopIndex++
        if (currentFireLoopIndex >= CYCLE_LOOP_FIRE.length) {
            currentFireLoopIndex = 0
        }
    }

    frameCountGold++    // Cycle des frames du gold 
    if (frameCountGold >= frameLimit) {
        frameCountGold = 0
        currentGoldLoopIndex++
        if (currentGoldLoopIndex >= CYCLE_LOOP_GOLD.length) {
            currentGoldLoopIndex = 0
        }
    }

    if (charY > canvas.height - HEIGHT) {
        charY = canvas.height - HEIGHT
    }

    /* plateforms.forEach(function (plateform){                                      // Gestion de la hitbox de la plateform
        if(charX < plateform.x + plateform.width &&
            charX + CHARWIDTH > plateform.x &&
            charY < plateform.y + plateform.height &&
            HEIGHT + charY > plateform.y) {
        }
    })  */
    
    if (!hasJumped && !isSliding && !primaryAttack) {
        drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY) // Appelle de Drawframe pour l'affichage des frames de base
    } else if (hasJumped) {
        drawFrame(CYCLE_LOOP_JUMP[currentLoopIndex], currentDirection, positionX, positionY) // Appelle de Drawframe pour l'affichage des frames de saut
    } else if (isSliding) {
        drawFrame(CYCLE_LOOP_SLIDE[currentLoopIndex], currentDirection, positionX, positionY) // Appelle de Drawframe pour l'affichage des frames de slide
    } else if (lookingRight) {
        drawFrame(CYCLE_LOOP_PRIMARTY_ATTACK[currentLoopIndex], currentDirection, positionX, positionY)
    } else if (lookingLeft) {
        drawFrame(CYCLE_LOOP_PRIMARTY_ATTACK_LEFT[currentLoopIndex], currentDirection, positionX, positionY)
    }
    
    fires.forEach(function (fire){     
        fire.draw()  
    })
    golds.forEach(function (gold){     
        if (!gold.pickupGold)
        gold.draw()  
        console.log(gold.pickupGold)
    })
    window.requestAnimationFrame(gameLoop)
    // console.log(currentLoopIndex) // Pour vérifier la valeur actuelle de la frame en cas de problème
}

function checkGround(y) {
    testX = charX
    testY = charY + y
    let ground = false
    if(testX < 0 || testX + CHARWIDTH > canvas.width || testY < 0 || testY + HEIGHT > canvas.height) {
        //if(testY + HEIGHT > canvas.height) 
        ground = true
    }
    plateforms.forEach(function (plateform){
        if(testX < plateform.x + plateform.width &&
            testX + CHARWIDTH > plateform.x &&
            testY < plateform.y + plateform.height &&
            HEIGHT + testY > plateform.y) {
                //if(testY + HEIGHT > plateform.y) 
                ground = true
        }
    })
    //console.log(ground)
    return ground
}

function checkPlayerCollision(x, y) {
    testX = charX + x
    testY = charY + y
    let collide = false
    if(testX < 0 || testX + CHARWIDTH > canvas.width || testY < 0 || testY + HEIGHT > canvas.height) {
        collide = true
    }
    plateforms.forEach(function (plateform){
        if(testX < plateform.x + plateform.width &&
            testX + CHARWIDTH > plateform.x &&
            testY < plateform.y + plateform.height &&
            HEIGHT + testY > plateform.y) {
                collide = true
        }
    })
    return collide
}

function checkFireCollision(x, y) {
    let hasDied = false
    fires.forEach(function (fire){
        if(x < fire.x + FIRE_WIDTH * SCALE_FIRE &&
            x + CHARWIDTH > fire.x &&
            y < fire.y + FIRE_HEIGHT * SCALE_FIRE &&
            HEIGHT + y > fire.y) {
                hasDied = true
        }
    })
    return hasDied
}

function checkGoldCollision(x, y) {
    golds.forEach(function (gold){
        if(x < gold.x + GOLD_WIDTH * SCALE_GOLD &&
            x + CHARWIDTH > gold.x &&
            y < gold.y + GOLD_HEIGHT * SCALE_GOLD &&
            HEIGHT + y > gold.y) {
                gold.pickupGold = true
        }
    })
}

function moveCharacter(deltaX, deltaY, direction) { // Déplacement du personnage && gestion de la hitbox du personnage (plus petite que la width du sprite)
    if (charX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
        positionX += deltaX
        //vx += deltaX
    }
    if (charY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
        positionY += deltaY
    }
    currentDirection = direction
}

// canvas.addEventListener("mousedown", function(event) { // PositionX + PositionY 
//     let rect = canvas.getBoundingClientRect(); 
//         let x = event.clientX - rect.left; 
//         let y = event.clientY - rect.top; 
//         console.log("Coordinate x: " + x,  
//                     "Coordinate y: " + y); 
// }); 

