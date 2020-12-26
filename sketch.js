var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud;
var cactus;

var score;
// this are the gamestate
var PLAY = 1;
var OVER = 0;
var gameState=PLAY;
var message="this is a message";
function preload(){
  trexrunning = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
 
  gameoverImage=loadImage("game-over new one.png")
  restartImage=loadImage("restart.png")
  
  dieSound=loadSound("die.mp3");
  jumpSound=loadSound("jump.mp3");
  checkpointSound=loadSound("checkPoint.mp3");
  
  //the preload of the cloud
 cloudmoving =
  loadImage("cloud.png");
 
  //the preload of the obstacles
  obstacle1 =loadImage("obstacle1.png");
  obstacle2 =loadImage("obstacle2.png");
  obstacle3 =loadImage("obstacle3.png");
  obstacle4 =loadImage("obstacle4.png");
  obstacle5 =loadImage("obstacle5.png");
  obstacle6 =loadImage("obstacle6.png");
}

function setup() {

  createCanvas(600,200)
  
  
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  //trex.debug=true;
  trex.setCollider("circle",0,0,50);
  trex.addAnimation("running", trexrunning);
  trex.addAnimation("colliding",trex_collided);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameover=createSprite(300,30,100,30)
  gameover.addImage("game is over",gameoverImage);
  gameover.scale=0.3;
  
  restart=createSprite(300,80,80,30)
  restart.addImage("restarting",restartImage);
  restart.scale=0.4;
  
  //generate random numbers
  var rand =  Math.round(random(1,100))
  console.log(rand)
//the score start point
  count=0;
  //this are the new groups
  cactusGroup=new Group();
  cloudGroup=new Group();
}

function draw() {
  //set background color
  background("white");
  
  //console.log(message);
  //console.log("this is",gameState)
  //stop trex from falling down
  trex.collide(invisibleGround);
    
 //console.log(trex.y);
 
  
  if (gameState===PLAY) {
  //the text and the framecount of the cloud and trex
  text("score: "+count,10,20);
  count=count+Math.round(getFrameRate()/60); 
    
   if(count>0 && count%1000===0) {
      checkpointSound.play();}
    
    ground.velocityX = -6;
   // jumps when the space key is pressed and also plays sound
   if(keyDown("space")&& trex.y >= 160) {
    trex.velocityY = -14;
    jumpSound.play();
   } 
    trex.velocityY = trex.velocityY + 0.8 
    
    if (ground.x < 0){
    ground.x = ground.width/2;
  }
    
  //Spawn Clouds
  spawnClouds();
  //Spawn Cactus 
  spawnCactus();
  
  gameover.visible=false;
  restart.visible=false;  
    
  if(cactusGroup.isTouching(trex)) {
   gameState=OVER; 
    dieSound.play();
  } 
    
 } else if (gameState===OVER) {
   ground.velocityX=0; 
   cactusGroup.setVelocityXEach(0);
   cloudGroup.setVelocityXEach(0);
   cactusGroup.setLifetimeEach(-1);
   cloudGroup.setLifetimeEach(-1);
   trex.changeAnimation("colliding",trex_collided);
   
   gameover.visible=true;
  restart.visible=true;
   
  }
  //this coding says if the restart button is pressed to reset the game and start over again
  if(mousePressedOver(restart) && gameState===OVER){
    //console.log("restart the game");
    reset();
  }
  //this coding says if the space button is pressed to reset the game and start over again
   if(keyDown("space")&& gameState===OVER){
    //console.log("restart the game");
    reset();
  }
  drawSprites(); 
}

//function to spawn the clouds
function spawnClouds(){
  // the frame rate for the clouds to spawn
  if(frameCount %170 ===0){
 // to create sprite and add the image   
cloud=createSprite(600,70,10,100);
cloud.addImage(cloudmoving)
  //the scale and the velocity  
  cloud.scale=0.5;
  cloud.velocityX=-1;
  
cloud.y=Math.round(random(10,70));
//console.log(trex.depth);
//console.log(cloud.depth);
  // this coding make the trex depth equal to cloud and adds 1 to trex
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
  //this deletes the clouds that gets out of the screen
cloud.lifetime=600;

 //this is the cactus group
cloudGroup.add(cloud);
  }
}
//function to spawn cactus
function spawnCactus(){
  //limtes the frame rate of the cactus that spawn
  if(frameCount % 100===0){
  //the sprite for the cactus
 cactus=createSprite(590,159,70,40);
  //this code makes the computer choose the obstacles 1-6 randomly
 var rand=Math.round(random(1,6));
    //the scale and the velocity of the cactus
    cactus.scale=0.6 ;
    cactus.velocityX=-6;
    //this code deletes the cactus that gets out of the screen
    cactus.lifetime=150;
    
 //this are the code that add image for each obstacle
switch(rand){
  case 1 : cactus.addImage(obstacle1);
    break;
    
    case 2 : cactus.addImage(obstacle2);
    break;
    
    case 3 : cactus.addImage(obstacle3);
    break;
    
    case 4 : cactus.addImage(obstacle4);
    break;
    
    case 5 : cactus.addImage(obstacle5);
    break;
    
    case 6 : cactus.addImage(obstacle6);
    break;
  default : break;  
}
  //this is the cactus group 
 cactusGroup.add(cactus);
  }
  
  
}
//this code tells the computer what it need to do when the restart and space button is pressed
 function reset() {
  gameState=PLAY; 
 gameover.visible=false; 
 restart.visible=false;
   
 cactusGroup.destroyEach();
 cloudGroup.destroyEach();

 trex.changeAnimation("running", trexrunning);
   count=0;
 }