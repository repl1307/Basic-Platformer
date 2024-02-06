//global vars
var canvas;
var player;
var goal;
var level = 1; //delete later and uncomment line below
// var level = localStorage.getItem('level') == null ? 1 : Number(localStorage.getItem('level'));
var objects = [];
var spikes = [];
var grid = [];
var rowStart = 0;
var settingsButton, returnButton, playButton, restartButton, titleText;
var settings;
var scene = "title", prevScene; //as of now, scenes are game,settings, and title
var levels = [];
var popup = true;
var gear, arrow, restart;
var tileSize = 50;
var dragged = false;//true when mouse is dragged
var del = false; //
var shift = 0; //variable to keeep track of translating
var particle;
//save data to local storage right before window is closed
window.onbeforeunload = () => {
  localStorage.setItem('level', level.toString());
  //localStorage.setItem('')
}
//load images and fonts
function preload() {
  gear = loadImage("images/gear.png");
  arrow = loadImage("images/arrow.png");
  restart = loadImage('images/restart.png');
}
//setup
function setup() {
  frameRate(60);
  canvas = createCanvas(1350, 600);
  //settings
  {
    let w = 500, h = 300;
    settings = new Block(canvas.width / 2 - w / 2, canvas.height / 2 - h / 2, w, h);
    settings.colliderToggle = new Toggle(settings.x + settings.w - 80, settings.y + 20, 60, 30);
    settings.gridToggle = new Toggle(settings.colliderToggle.x, settings.y + 70, 60, 30);
    settings.gridToggle.toggled = true;
    settings.gridToggle.icon.x += settings.gridToggle.icon.w;
    settings.lineToggle = new Toggle(settings.gridToggle.x, settings.y + 120, 60, 30);
    settings.lineToggle.toggled = true;
    settings.lineToggle.icon.x += settings.lineToggle.icon.w;
  }
  player = new Block(0, 0, 20, 50, 'red');
  goal = new Block(700, 280, 20, 20, 'yellow');
  //storing levels and loading first level
  storeLevels();
  createGrid(tileSize);//create grid
  grid.editCount = 9999999; // set to zero later
  levelChange();
  //buttons
  settingsButton = new Button(canvas.width - 50, canvas.height - 50, 50, 50, gear, "image");
  returnButton = new Button(0, canvas.height - 50, 50, 50, arrow, "image");
  playButton = new Button(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 100, "Play");
  playButton.r = 20;
  restartButton = new Button(50, canvas.height - 50, 50, 50, restart, "image");
  titleText = new Button(canvas.width / 2 - 225, canvas.height / 2 - 75, 450, 100, "Platformer");
  titleText.r = 20;
  // canvas.mouseClicked(() => {
  //   //open in new tab pop up
  //   if (document.URL.toString() != "https://actual-platformer.repl1307.repl.co/" && popup)    {
  //     if (confirm("Open in new tab? (Recommended)"))
  //      {window.open("https://actual-platformer.repl1307.repl.co/");}
  //     popup = false;
  //   }
  // });
  convertToLevel(stdr); //delete later
  particle = createGraphics(canvas.width, canvas.height);
  particle.noFill();
  let smallTile = tileSize / 2;
  for (var i = 0; i < grid.length * 2; i++) {
    for (var j = 0; j < grid[0].length * 2; j++) {
      let x = i * smallTile;
      let y = j * smallTile;
      particle.rect(x, y, smallTile, smallTile);
    }
  }
}
// draw loop
function draw() {
  background(color('lightgrey')); //reset canvas
  if (settings.gridToggle.toggled) { image(particle, 0, 0); }//background delete later
  else{
    push();
    fill(color('gray'));
    for(row of grid){for(cell of row){
    rect(cell.x,cell.y,cell.w,cell.h)}}
    pop();
  }
  if (scene == "game") { movement(player); }
  displayFrameRate();
  tileHover();
  drawLevel();
  drawPlayer();
  levelText();
  drawMouse();
  //button stuff
  buttonHover(settingsButton);
  buttonHover(returnButton);
  buttonHover(restartButton);
  collisions();
  if (scene == 'title') { title(); }
  drawSettings(); //rename later
  settingsButton.draw();
  if (scene != "title" && prevScene != 'title') {
    returnButton.draw();
    restartButton.draw();
  }
}
//key release
function keyReleased(event) {
  // var e = event.keyCode;
  // console.log(event.key.charCodeAt(0));
  // console.log(event.key);
}
//mouseclick
function mousePressed() {
  if (scene == "game") { dragged = false; del = true; }
  else if (scene == "settings") {
    settings.colliderToggle.onClick();
    settings.gridToggle.onClick();
    settings.lineToggle.onClick();
  }
  //if settings button is pressed
  buttonClick(settingsButton, () => {
    console.log(scene, buttonCollision(settingsButton));
    if (scene == "settings") { scene = prevScene; }
    else {
      prevScene = scene;
      scene = "settings";
    }
  });
  //if return button is pressed
  buttonClick(returnButton, () => {
    if (scene != "title") { setTimeout(() => { scene = "title"; }, 500); }
  });
  //if restart button is pressed
  buttonClick(restartButton, () => {
    setTimeout(() => {
      if (confirm("Go Back to Level 1?")) {
        level = 1;
        levelChange();
        player.x = 0;
        player.y = 0;
        player.yVel = 0;
      }
    }, 500);
  });
  //if play button is pressed
  buttonClick(playButton, () => {
    if (scene == "title") {
      scene = "game";
      if (level == levels.length) { level = 1; }
      player.x = 0; player.y = 0; player.yVel = 0;
      levelChange();
    }
  });
}
function mouseDragged() {
  dragged = true;
  if (dragged && scene == "game") { del = false; editPlatform2(); }
}
function mouseReleased() {
  del = true;
  if (scene == "game" && !dragged) { editPlatform2(); }
  dragged = false;
}
//end of p5js functions
//shiftDir: direction of shift
function canShift(shiftDir){
  let isShift = false;
    for(let i = 0; i < objects.length; i++){
          if(objects[i].x + objects[i].w > canvas.width && shiftDir.toLowerCase() == "right")
            isShift = true;
          else if(objects[i].x < 0 && shiftDir.toLowerCase() == "left")
            isShift = true;
      }
      if(shift < 0 && shiftDir.toLowerCase() == "right")
        isShift = true;
      else if(shift > 0 && shiftDir.toLowerCase() == "left")
        isShift = true;

  return isShift;
}
//shift camera's x-axis
function shiftCamera(shiftVal){
  shift+=shiftVal;
  goal.x-=shiftVal;
  objects.forEach(p => p.x-=shiftVal);
  spikes.forEach(s => {
          s.x1-=shiftVal; s.x2-=shiftVal; s.x3-=shiftVal;
        });
}
function movement(obj) {
  //left and right
  //d/right arrow
  if ((keyIsDown(68) || keyIsDown(39)) && !leftCollision(player)) {
        //checking if any blocks are offscreen to the right of the canvas
    //move normally if not near right edge or no objects are offscreen to the right
    if(obj.x+obj.w+200 <canvas.width || (!canShift("right")&&obj.x+obj.w<canvas.width)){obj.x += 5;}
    else{
      if(canShift("right")){
        shiftCamera(5);
      }
  }
  }
    //a/left arrow
  else if ((keyIsDown(65) || keyIsDown(37)) && !rightCollision(player)){ 
    //move normally if not near edge or no objects are offscreen to the left
    if(obj.x-200 > 0 || (!canShift("left")&&obj.x>0)){obj.x -= 5;}
    else{
      if(canShift("left")){
        shiftCamera(-5);
      }
    }
  }
  //jump
  if ((keyIsDown(87) || keyIsDown(38)) && obj.yVel <= 0 && (isGrounded(obj) || collideRectRect(mouseX, mouseY, 10, 10, obj.x, obj.y, obj.w, obj.h)))
    obj.yVel = 30;
  //apply y velocity
  if ((obj.yVel < 0 && !isGrounded(obj)) || obj.yVel >= 0){
    obj.y -= obj.yVel;
  }
  //gravity
  if (!isGrounded(obj)) {
    if (obj.yVel > 0) { obj.yVel -= obj.gravity * 4; }
    else { obj.yVel -= obj.gravity; }
  }
  else {
    obj.yVel = 0;
  }
}

function levelChange() {
  //createrow is y,x because too lazy to change
  var a = levels[level - 1];
  //objects = a.platforms;
  objects = [];
  spikes = [];
  for (let i = 0; i < a.platforms.length; i++) { objects.push(a.platforms[i]); }
  for (let i = 0; i < a.spikes.length; i++) { spikes.push(a.spikes[i]); }
  goal.x = a.platforms[a.platforms.length - 1].x + 20;
  goal.y = a.platforms[a.platforms.length - 1].y - 50;
  //console.log(levels[levels-1]);
}
//draw/delete platform on click
function editPlatform() {
  if (grid.editCount > 0) { grid.editCount--; } else { return; } // limit edits 
  //loop through grid to check for collisions
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      //check if mouse collides with grid cell
      if (collidePointRect(mouseX, mouseY, i * tileSize, j * tileSize, tileSize, tileSize)) {
        if (i == grid.length - 1 && j == grid[i].length - 1) { return; } // ignore bottom right cell
        if (i == 0 && j == grid[i].length - 1) { return; } // ignore bottom left cell
        if (i == 1 && j == grid[i].length - 1) { return; }//ignore cell one right from bottom left
        //search through objects to see if object is already there
        for (var k = 0; k < objects.length; k++) {
          var p = objects[k];
          //check if object is in collided grid cell
          if (collideRectRect(p.x, p.y, p.w, p.h, i * tileSize, j * tileSize, tileSize, tileSize) && collidePointRect(mouseX, mouseY, p.x, p.y, p.w, p.h)) {
            objects.splice(k, 1);
            console.log(k);
            return;
          }
        }
        //if the grid cell is empty
        objects.push(new Block(i * tileSize, j * tileSize, tileSize, tileSize, 'rgba(	173, 216, 230,1)'));
        return;
      }
    }
  }
}
//delete later, function to make placing platforms more flexible
function editPlatform2() {
  if (grid.editCount > 0) { grid.editCount--; } else { return; } // limit edits 
  //loop through grid to check for collisions
  for (var i = 0; i < grid.length * 2; i++) {
    for (var j = 0; j < grid[0].length * 2; j++) {
      //check if mouse collides with grid cell
      if (collidePointRect(mouseX, mouseY, i * tileSize / 2, j * tileSize / 2, tileSize / 2, tileSize / 2)) {
        if (i == grid.length * 2 - 1 && j == grid[i].length * 2 - 1) { return; } // ignore bottom right cell
        if (i == 0 && j == grid[i].length * 2 - 1) { return; } // ignore bottom left cell
        if (i == 1 && j == grid[i].length * 2 - 1) { return; }//ignore cell one right from bottom left
        //search through objects to see if object is already there
        for (var k = 0; k < objects.length; k++) {
          var p = objects[k];
          //check if object is in collided grid cell
          if (collideRectRect(p.x, p.y, p.w, p.h, i * tileSize / 2, j * tileSize / 2, tileSize, tileSize) && collidePointRect(mouseX, mouseY, p.x, p.y, p.w, p.h) && del) {
            objects.splice(k, 1);
            console.log(k);
            return;
          }
          if (dragged && collideRectRect(p.x+1, p.y+1, p.w-1, p.h-1, i * tileSize / 2 + 1, j * tileSize / 2 + 1, tileSize-1, tileSize-1) && collidePointRect(mouseX, mouseY, i * tileSize / 2, j * tileSize / 2, tileSize-1, tileSize-1)) {
            return;
          }
        }
        //if the grid cell is empty
        objects.push(new Block(i * tileSize / 2, j * tileSize / 2, tileSize, tileSize, 'rgba(	173, 216, 230,1)'));
        return;
      }
    }
  }
}
//display settings, fix later
function drawSettings() {
  if (scene == "settings") {
    //tint background
    push();
    fill(color('rgba(0,0,0,0.3)'));
    rect(0, 0, canvas.width, canvas.height);
    pop();
    //settings box
    fill(color('lightgrey'));
    rect(settings.x, settings.y, settings.w, settings.h);
    settings.colliderToggle.draw();
    settings.gridToggle.draw();
    settings.lineToggle.draw();
    //collider toggle text
    push();
    textAlign(LEFT, TOP);
    fill(color('white'));
    textSize(30);
    text("Show colliders", settings.x + 20, settings.colliderToggle.y);
    text("Show Grid", settings.x + 20, settings.gridToggle.y);
    text("Show Lines", settings.x + 20, settings.lineToggle.y);
    pop();
  }
}
//display title
function title() {
  push();
  //title 
  titleText.draw();
  //play button
  buttonHover(playButton);
  playButton.draw();
}
//reset lists and createrow function
function levelReset() {
  objects = [];
  spikes = [];
  rowStart = 0;
}
//store levels in levels list
function storeLevels() {
  var l;
  //level 1
  createPlatforms(15);
  createRow(5, 200, 250);
  createRow(5, 90, 0);
  createRow(5, 310, 480);
  levels[0] = { platforms: objects, spikes: spikes, goal: goal };
  objects[7].x=-300;
  levelReset();
  //level 2
  createPlatforms(18);
  createRow(3, 100, 0);
  createRow(2, 250, 140);
  createRow(2, 175, 230);
  createRow(5, 100, 350);
  createRow(3, 200, 650);
  createRow(3, 500, 1000)
  l = objects.length;
  goal.x = objects[l - 1].x + 20;
  goal.y = objects[l - 1].y - 40;
  console.log(goal.x, goal.y);
  levels[1] = { platforms: objects, spikes: spikes, goal: goal };
  levelReset();
  //level 3
  createPlatforms(60);
  createRow(20, 225, 350); //middle row
  createRow(20, 400, 0); //bottom row
  createRow(20, 50, 0); //top row
  //spike in middle row
  for (var i = 0; i < 10; i += 2) { createSpike(objects[i]); }
  for (var i = 30; i < 40; i += 2) { createSpike(objects[i]); }
  objects.push(objects[39]);
  objects.splice(39, 1);
  l = objects.length;
  goal.x = objects[39].x + 20;
  goal.y = objects[39].y - 40;
  levels[2] = { platforms: objects, spikes: spikes, goal: goal };
  levelReset();
  //level 4
  createPlatforms(15);
  levels[3] = { platforms: objects, spikes: spikes, goal: goal };
  levelReset();
}
//converts string to level
//0 : no block, empty tile
//1 : block w/o spike
//2 : block w/ spikes
//TODO: make it possible to have a spike on any side of block
function convertToLevel(string) {
  levels.push({ platforms: [], spikes: [], goal: goal });
  var l = levels[levels.length - 1];
  var test = string.split('\n');
  console.log(test); //delete later
  for (var i = 0; i < grid[0].length; i++) {
    for (var j = 0; j < grid.length; j++) {
      if (Number(test[i][j]) == 1) {
        l.platforms.push(new Block(j * 50, i * 50, 50, 50, 'lightblue'));
      }
      else if (Number(test[i][j]) == 2) {
        l.platforms.push(new Block(j * 50, i * 50, 50, 50, 'lightblue'));
        createSpike(l.platforms[l.platforms.length - 1]);
        l.spikes.push(spikes[0]);
        spikes = [];
      }
    }
  }
}

var stdr =
  `000000000000000000000000000
121222121212000000000000000
000000000000000000000000000
000000000000000000000000000
000000000022111111111111111
000000000000000000000000000
001111110000000000000000000
000000000000000000000000000
000000000000000000000000000
000000000000000000000000000
000111000000000000000000000
000000000000000000000000000`;

