var ground;
var player;
var zombieGroup;
var zombiesKilled = 0;
var graveGroup;
var graveBord;
var bulletGroup;
var score;
var velocity = -7
var gameState = 'home1';
var shootCountdown = 0;
var timePlayed = 0;
var vaccine;

function preload() {
  zombieImg = loadImage("Images/zombie.png")
  graveImg = loadImage("Images/grave.png")
  playerJump = loadImage("Images/player3.png")
  continueButtonImg = loadImage("Images/continueButton.png")
  playButtonImg = loadImage("Images/playButton.png")
  playAgainButtonImg = loadImage("Images/playAgainButton.png")
  homeBackground1 = loadImage("Images/home1.png")
  homeBackground2 = loadImage("Images/home2.png")
  winBackground = loadImage("Images/winBackground.png")
  playBackground = loadImage("Images/playingBackground.png")
  vaccineImg = loadImage("Images/vaccine.png")
  playerRunning = loadAnimation("Images/player1.png", "Images/player2.png",
    "Images/player3.png", "Images/player4.png")
}

function setup() {
  createCanvas(1366, 625);

  setInterval(shootCountdownDecrement, 1000)
  setInterval(timePlayedIncrement, 1000)

  ground = createSprite(683, 624, 1366, 2)
  ground.visible = false;
  player = createSprite(100, 533, 10, 10)
  player.addAnimation("run", playerRunning)
  player.addAnimation("jump", playerJump)
  player.scale = 0.4
  vaccine = createSprite(1400, 500, 10, 10)
  vaccine.addImage("vaccine", vaccineImg)
  vaccine.scale = 0.3
  vaccine.visible = false;
  continueButton = createSprite(1250, 580, 10, 10)
  continueButton.addImage("continue", continueButtonImg)
  continueButton.scale = 0.4
  playButton = createSprite(1250, 500, 10, 10)
  playButton.addImage("play", playButtonImg)
  playButton.scale = 0.4
  graveBord = createSprite(683, 556, 1366, 2)
  graveBord.visible=false;
  zombieGroup = createGroup()
  graveGroup = createGroup()
  bulletGroup = createGroup()

}

function draw() {

  console.log(gameState)

  if (gameState != 'playing') {
    frameCount = frameCount - frameCount;
  }

  if(score>=1000){
    velocity=-8
  }

  if(score>=2000){
    velocity=-9
  }

  if(score>=3000){
    velocity=-10
  }

  if(score>=4000){
    velocity=-10.5
  }

  if(score>=5000){
    velocity=-11
  }


  home1();
  home2();
  playing();
  win();
  lose();

}

function home1() {
  if (gameState == 'home1') {
    background(homeBackground1)

    continueButton.display()

    if (mousePressedOver(continueButton)) {
      gameState = 'home2'
    }
  }
}

function home2() {
  if (gameState == 'home2') {
    background(homeBackground2)
    continueButton.destroy()
    playButton.display()
    if (mousePressedOver(playButton)) {
      gameState = 'playing'
    }
  }
}

function playing() {
  if (gameState == 'playing') {

    background(playBackground)

    continueButton.destroy()
    playButton.destroy()

    if (keyDown("space") && player.y >= 533) {
      player.velocityY = -19;
      player.changeAnimation("jump", playerJump)
    }
    else {
      player.velocityY = player.velocityY + 1
    }

    if (player.isTouching(ground)) {
      player.changeAnimation("run", playerRunning)
    }

    if (shootCountdown == 0) {
      shootCountdown = 'Can Shoot'
    }

    if (score == 5000) {
      vaccine.visible = true
      vaccine.velocityX = -15
    }

    player.collide(ground)
    zombieGroup.collide(ground)
    graveGroup.collide(graveBord)

    if (bulletGroup.isTouching(zombieGroup)) {
      zombieGroup.destroyEach()
      bulletGroup.destroyEach()
      zombiesKilled = zombiesKilled + 1
    }

    score = int(frameCount / 3)

    if (vaccine.isTouching(player)) {
      gameState = 'win'
    }

    spawnGrave()
    spawnZombie()
    bullet()
    texts()

    if(player.isTouching(zombieGroup)||player.isTouching(graveGroup)){
      gameState='lose'
   }

    drawSprites()

  }
}

function win() {
  if (gameState == 'win') {
    background(winBackground)
    player.destroy()
    vaccine.destroy()
    ground.destroy()
    bulletGroup.destroyEach()
    zombieGroup.destroyEach()
    graveGroup.destroyEach()
    var playAgainButton = createSprite(1250, 550, 10, 10)
    playAgainButton.addImage("playAgain", playAgainButtonImg)
    playAgainButton.scale = 0.4
    playAgainButton.display()

    fill("black")
    textSize(60)    
    text("Results",1020,90)
    textSize(30)
    text("Score: 5000",920,150)
    text("Time Played: "+timePlayed,920,210)
    text("Zombies Killed: "+zombiesKilled,920,270)

    if (mousePressedOver(playAgainButton)) {
      location.reload()
    }

  }
}

function lose(){
  if(gameState=='lose'){
    background("red")
    var playAgainButton = createSprite(1250, 550, 10, 10)
    playAgainButton.addImage("playAgain", playAgainButtonImg)
    playAgainButton.scale = 0.4
    playAgainButton.display()
    if (mousePressedOver(playAgainButton)) {
      location.reload()
    }
    textSize(150)
    fill("black")
    text("You Lose",350,350)
  }
}

function spawnGrave() {
  if (frameCount % 150 == 0 && frameCount != 0) {
    var grave = createSprite(1500, 660, 0, 0)
    grave.scale = 0.11
    grave.addImage(graveImg, "grave")
    grave.velocityY = -2
    grave.velocityX = velocity
    grave.lifetime=240

    console.log(grave.y)

    if (grave.y>590) {
      
    }

    graveGroup.add(grave)

  }

}

function spawnZombie() {

  if (frameCount % 200 === 0 && frameCount != 0) {
    var zombie = createSprite(1500, -300, 0, 0)
    zombie.lifetime = 240
    zombie.scale = 0.7
    zombie.addImage(zombieImg, "zombie")
    zombie.velocityX = velocity
    zombie.velocityY = 20
    zombieGroup.add(zombie)
  }

}

function bullet() {
  if (keyDown("S") && player.y >= 533 && shootCountdown == 'Can Shoot') {
    var bullet = createSprite(160, player.y - 32, 20, 1);
    bullet.shapeColor = "red";
    bullet.velocityX = 15;
    bullet.lifetime = 85;
    bulletGroup.add(bullet);

    if (shootCountdown == 'Can Shoot') {
      shootCountdown = 3;
    }

  }
}

function shootCountdownDecrement() {
  if (shootCountdown > 0 && shootCountdown != 'Can Shoot')
    shootCountdown = shootCountdown - 1
}

function timePlayedIncrement() {
  if (gameState == 'playing')
    timePlayed = timePlayed + 1
}

function texts() {
  fill("white")
  textSize(20)
  if (shootCountdown != 'Can Shoot') {
    text("Shoot Countdown: " + shootCountdown + " seconds", 10, 30)
  }
  else {
    text("Shoot Countdown: " + shootCountdown, 10, 30)
  }
  text("Time Played: " + timePlayed + " seconds", 10, 60)
  text("Zombies Killed: " + zombiesKilled, 10, 90)
  text("Score: " + score + "/5000", 10, 120)
}