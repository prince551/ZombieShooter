var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie,zombieImg;
var heart1,heartImg;
var heart2;
var heart3;
var zombieGroup;
var gameState="play"
var score = 0;
var win, lose;
var bullet, bulletGroup;
var bullets=20;
var Restart,RestartImg;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  zombieImg=loadImage("assets/zombie.png");
  bgImg = loadImage("assets/bg.jpeg")
  heartImg = loadImage("assets/heart_1.png");
  win=loadSound("assets/win.mp3");
  lose=loadSound("assets/lose.mp3");
  RestartImg=loadImage("assets/reset.png");
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-999, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

   heart1 = createSprite( displayWidth-100,30,40,40)
    heart1.addImage(heartImg);
    heart1.scale=0.2;
    heart2 = createSprite( displayWidth-150,30, 40,40)
    heart2.addImage(heartImg);
    heart2.scale=0.2;
    heart3 = createSprite(displayWidth-200,30,40,40)
    heart3.addImage(heartImg);
    heart3.scale=0.2;

    zombieGroup = new Group(); 
    bulletGroup=new Group();

    Restart = createSprite(displayWidth/2,displayHeight/2+170,50,50);
    Restart.addImage(RestartImg);
    Restart.scale=0.1;
    
}

function draw() {
  background(0); 
  drawSprites();
  textSize(20);
  fill("red");

  text("Bullets left: "+bullets,50,50);
  text("Killed: "+score,200,50);
  if(gameState === "play"){

    Restart.visible=false;

    //moving the player up and down and making the game mobile compatible using touches
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30
    }
    if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+30
    }
    if(keyDown("Left_Arrow")||touches.length >0)
    {
      player.x=player.x-30
    }
    if(keyDown("right_Arrow")||touches.length>0)
    {
      player.x = player.x+30
    }

    //release bullets and change the image of shooter to shooting position when space is pressed
    if(bullets>=0){

      if(keyWentDown("space")){
        bullet = createSprite(displayWidth-1150,player.y-30,20,10)
        bullet.velocityX = 20
        
        bulletGroup.add(bullet);
        player.depth = bullet.depth;
        player.depth = player.depth+2;
        player.addImage(shooter_shooting)
        bullets = bullets-1
      
      }
      //player goes back to original standing image once we stop pressing the space bar
      else if(keyWentUp("space")){
        player.addImage(shooterImg)
        
      }
    }
    

    Spawnzombies();

    if(zombieGroup.isTouching(bulletGroup)){
      score=score+1;
      for(var i=0;i<zombieGroup.length;i++){     
          
        if(zombieGroup[i].isTouching(bulletGroup)){
              zombieGroup[i].destroy()
              bulletGroup.destroyEach()
              bullets=bullets-1;
            win.play();
        } 
      
      }
    }

    if(bullets<=15){
      heart3.visible=false;
    }
    if(bullets<=7){
      heart2.visible=false;
    }
    if(bullets<=0){
      heart1.visible=false;
    }

    if(player.isTouching(zombieGroup)){

      for(var i=0;i<zombieGroup.length;i++){     
          
        if(zombieGroup[i].isTouching(player)){
            zombieGroup[i].destroy();
        } 
      
      }
        
      
      
    }
    if(bullets<=0){
      gameState = "End";
    }
  }

  else if(gameState==="End"){
    lose.play();
    player.visible = false;
    textSize (50);
    fill("green");
    text("GAME OVER",500,500);
    zombieGroup.destroyEach();
    Restart.visible=true;

    if(mousePressedOver(Restart))
    {
      reset();
    }
  }


}

  function reset()
 {
    gameState="play";
    player.visible= true; 
    lose.stop();
    bullets =20;
    score=0;
    heart1.visible = true;
    heart2.visible = true;
    heart3.visible = true;

 }

function Spawnzombies()
{
  if(frameCount % 60 == 0)
  {
    zombie=createSprite(random(500,displayWidth),random(100,600),60,30);
    zombie.addImage(zombieImg);
    zombie.velocityX=-(3+ bullets/2);
    zombie.scale=0.2;
    zombie.lifetime=500;
    zombieGroup.add(zombie)
  
    
  }
}