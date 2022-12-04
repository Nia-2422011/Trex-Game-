//TREX GAme using JS

//Declare variables for game objects and behaviour indicators(FLAGS)
var trex, trexRun, trexDead;
var ground, groundImg, invGround;
var cloud, cloudImage, cloudsGroup;
var cactus, cactiGroup, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var gameOver, reset, resetImg, gameOverImg;
var score, hiScore, displayHS;
var PLAY, END, gameState;
var jumpSound, die, checkPoint;

//Create Media library and load to use it during the course of the software
//executed only once at the start of the program
function preload() {
  trexRun = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexDead = loadImage("trex_collided.png");

  groundImg = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  resetImg = loadImage("restart.png");
}

//define the intial environment of the software(before it is used)
//by defining the declared variables with default values
//executed only once at the start of the program
function setup() {
  createCanvas(windowWidth, windowHeight);
  //create a trex sprite
  trex = createSprite(50, height - 30, 20, 50);
  trex.addAnimation("trexRun", trexRun);
  trex.addAnimation("trexDead", trexDead);
  trex.scale = 0.4;
  trex.debug = true;
  trex.setCollider("rectangle", 0, 0, 150, 150);

  //creating the ground sprite
  ground = createSprite(width / 2, height - 40, width, 4);
  ground.addImage("moving", groundImg);
  ground.x = ground.width / 2;
  ground.debug = false;
  //creating the invisible ground sprite
  invGround = createSprite(50, height - 21, 200, 4);
  invGround.visible = false;

  //variables for score, highscore values
  score = 0;
  hiScore = 0;
  //indicator to check if highscore should be displayed or not
  displayHS = false;

  //default value of Gamestate
  PLAY = 1;
  END = 0;
  gameState = PLAY;

  //create empty group objects
  cactiGroup = new Group();
  cloudsGroup = createGroup();

  //create gameover message sprite
  gameOver = createSprite(width - 300, height - 200, 50, 10);
  gameOver.addImage("gameOverImg", gameOverImg);
  gameOver.scale = 0.65;
  gameOver.visible = false;
  //create reset game icon sprite
  reset = createSprite(width - 300, height - 250, 20, 20);
  reset.addImage("resetImg", resetImg);
  reset.scale = 0.75;
  reset.visible = false;

}

//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw.
//All commands to be executed and checked continously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {
  background("lavender");
  console.log ("Width: " + width);
  console.log ("windowWidth: " + windowWidth);
  console.log ("displayWidth:  " + displayWidth);
  // text(score,550,200);

  // text styling 
  stroke("black");
  strokeWeight(5);
  fill ("white");
  textSize(15);
  if (gameState == PLAY) {


    // Display Score 
    fill("white");
    textSize(20);
    text('Score: ' + score, width - 160, height / 2);
    //Score Calculation
    score = score + round(getFrameRate() / 30);

    //checking the flag to identify if the reset button has been clicked.
    if (displayHS == true) {
      // display highscore
      fill("white");
      textSize(15);
      text('HiScore: ' + hiScore, width - 260, height / 2);
    }

    //trex active behaviour
    if ((touches.length == 1 || keyDown("space")) && trex.y > height - 160) {
      trex.velocityY = -13;
      // jumpSound.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.5;

    //ground active behaviour
    ground.velocityX = - (4 + score/100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }






    //function call to create and move clouds
    spawnClouds();

    //function call to create and move obstacles
    spawnCacti();


    //detecting the collision when the trex and cacti are active
    if (cactiGroup.isTouching(trex)) {
      gameState = END;//assignment operator, = x = 5  -- - store 5 in variable x
      //trex.velocityY = -13;


    }
  }
  else if (gameState == END)//equality operator, == or ===  (x == 5)-----if x is equal to 5
  {
    background("red");
    //write down all the chnages that must take place when the gamestate is equal to END
    //all the characters, their behaviours, their appreances, their postions, and everything else
    // whatever changes create a list and add it here...


    // Display Score 
    fill("white");
    textSize(15);
    text('Score: ' + score, width - 160, height  / 2);
    // display highscore
    fill("white");
    textSize(15);
    text('HiScore: ' + hiScore, width - 260, height / 2);

    //calculation of hiscore
    if (hiScore < score) {
      hiScore = score;
    }
    // 1. The game should stop and it should also stop creating sprites.
    // 2. We should stop creating the sprites of the cloud, cactus and 
    //moving the ground and trex.

    ground.velocityX = 0;
    trex.velocityY = 0;

    cactiGroup.setVelocityXEach(0);
    cactiGroup.setLifetimeEach(-1);

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);


    // 3. The score should also pause on the value it was on when the trex hits the cactus.
    // 4. The "Game Over" text should appear on the screen.
    // 5. There should also be a reset button on the screen.
    gameOver.visible = true;
    reset.visible = true;
    // 6. If we look carefully then the trex changes the way it looks.
    // 7. The trex sprite changes when the game ends.
    trex.changeAnimation("trexDead");

    // 8. If you beat your older high score than your high score number should be replaced by the new highscore.


    //write down all the chnages that must take place when the THE PLAYER CLICKS ON RESTART ICON
    if (mousePressedOver(reset)) {
      //all the characters, their behaviours, their appreances, their postions, and everything else
      // whatever changes create a list and add it here...
      // 1. First thing when we press the restart button the "Game Over" text and the reset button image should dissapear.
      gameOver.visible = false;
      reset.visible = false;
      // 2. The score should restart only the highscore should remain same.
      score = 0;
      // 3. The ground, cactus, trex and cloud sprites should start moving again.
      // 4. The trex sprite changes to the normal form.
      gameState = PLAY;
      trex.changeAnimation("trexRun");
      // 5. The cactus sprites which were already created and presented on the screen will 
      //    dissapear and then the game will again continue as normal and new cactus sprites will be created. 
      cactiGroup.destroyEach();
      cloudsGroup.destroyEach();
      // 6. Updating the flag to identify if the reset button has been clicked.
      displayHS = true;
    }

  }




  trex.collide(invGround);
  drawSprites();
}

//function definition to create and move clouds
function spawnClouds() {
  if (frameCount % 30 == 0) {
    // here, % is modulus operator which divides and gives the remainder not the quotient as the answer
    //create cloud objects after every 60 frames
    //to attain this we have to divide the framecount by 60 and check if the remainder is equal to zero
    //if framecount is divisible by given number then a cloud object will be created


    //create and define a cloud sprite object in declare variable
    cloud = createSprite(width, height - 200, 10, 10);

    //velocity of cloud which makes it move from left to right
    cloud.velocityX = -4;

    //random is a function used to egnerate any number between given range.
    cloud.y = random(height - 275, height - 200);

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.debug = false;

    cloud.addImage("cloudImage", cloudImage);
    cloud.scale = 0.5;


    //generating lifetime to solve the problem of memory overload
    //by dividing the distance to be crossed by the object with the speed of the object.
    //here width = width of canvas(600) and speed is velocity of cloud(-4)
    //as velocity is negative, we need to make the lifetime as positive by muliplying the answer with -1;
    cloud.lifetime = ((-1) * (width / cloud.velocityX)) + 50;


    //Adding each cactus to Group
    //1. to detect collisons between trex and the group
    //2. to manage and track all cactus objects
    //3. because it it not possible to modify or control any individual cactus

    //Group.add(sprite)
    cloudsGroup.add(cloud);
  }
}

//function definition to create and move cacti 
function spawnCacti() {
  if (frameCount % 65 == 0) {
    // here, % is modulus operator which divides and gives the remainder not the quotient as the answer
    //create cloud objects after every 30 frames
    //to attain this we have to divide the framecount by 30 and check if the remainder is equal to zero
    //if framecount is divisible by given number then a cloud object will be created


    //create and define a cactus sprite object in declared variable
    cactus = createSprite(width + 20, height - 50, 30, 50);
    cactus.debug = true;
    //velocity of cactus which makes it move from left to right
    cactus.velocityX = - (4 + score/100);

    //generating lifetime to solve the problem of memory leak
    //by dividing the distance to be crossed by the object with the speed of the object.
    //here width = width of canvas(400) and speed is velocity of cactus(-6)
    //as velocity is negative, we need to make the lifetime as positive by muliplying the answer with -1;
    cactus.lifetime = ((-1) * (width / cactus.velocityX)) + 50;

    //random is a function used to egnerate any number between given range.
    //Math.round function is used to round and convert any decimal number to its nearest whole integer.
    //generate a random number between 1 to 6 and save it in variable caseNumber.

    //random is a function used to egnerate any number between given range.
    var caseNumber = Math.round(random(1, 6));
    console.log(caseNumber);

    //switch case passes a single variable to match with cases
    switch (caseNumber) {
      case 1:
        cactus.addImage("cactus1", cactus1);
        //adjust the size of animation for cactus sprite by keeping the width and height ratio stable
        cactus.scale = 0.7;
        break;
      case 2:
        cactus.addImage("cactus2", cactus2);
        //adjust the size of animation for cactus sprite by keeping the width and height ratio stable
        cactus.scale = 0.7;
        break;
      case 3:
        cactus.addImage("cactus3", cactus3);
        cactus.scale = 0.6;
        break;
      case 4:
        cactus.addImage("cactus4", cactus4);
        //adjust the size of animation for cactus sprite by keeping the width and height ratio stable
        cactus.scale = 0.55;
        break;
      case 5:
        cactus.addImage("cactus5", cactus5);
        //adjust the size of animation for cactus sprite by keeping the width and height ratio stable
        cactus.scale = 0.5;
        break;
      case 6:
        cactus.addImage("cactus6", cactus6);
        cactus.scale = 0.5;
        break;
      default:
        cactus.addImage("cactus6", cactus6);
        cactus.scale = 0.5;
        break;
    }
    //Adding each cactus to Group
    //1. to detect collisons between trex and the group
    //2. to manage and track all cactus objects
    //3. because it it not possible to modify or control any individual cactus

    //Group.add(sprite)
    cactiGroup.add(cactus);

  }
}