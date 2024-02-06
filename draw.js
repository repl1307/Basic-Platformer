function displayFrameRate(){
  push();
  textSize(30);
  if (frameRate() > 50)
    fill(color('green'));
  else if (frameRate() > 30)
    fill(color('rgb(200,200,0)'));
  else if (frameRate() > 10)
    fill(color('orange'));
  else
    fill(color('red'));

  text(floor(frameRate()), 0, 25);
  pop();
}
//draw player
function drawPlayer(){
  push();
  if(!settings.lineToggle.toggled){noStroke();}//disable lines
  fill(color(player.c));
  rect(player.x, player.y, player.w, player.h);
  //player hitboxes if setting is enabled
  if (settings.colliderToggle.toggled) {
    fill(color('purple'));
    rect(player.x, player.y + player.h - 15, player.w, 15);
    fill(color('green'));
    rect(player.x, player.y, player.w, 15);
  }
  pop();
}
//draw level
function drawLevel(){
  //draw goal
  push();
  fill(color(goal.c));
  rect(goal.x, goal.y, goal.w, goal.h);
  drawSpikes()//draw spikes
  drawPlatforms(); // draw platforms
  pop();
}
//keep track of mouse pos
function drawMouse(){
  push();
  fill(color('yellow')); // delete later
  circle(mouseX, mouseY, 10); //delete later
  pop();
}
//draw platforms
function drawPlatforms() {
  push();
  if(!settings.lineToggle.toggled){noStroke();}//disable lines
  for (var i = 0; i < objects.length; i++) {
    var p = objects[i];
    fill(color(p.c));
    rect(p.x, p.y, p.w, p.h);
    //visualizing hitboxes
    if (settings.colliderToggle.toggled) {
      fill(color('purple'));
      rect(p.x, p.y, p.w, 15);
      fill(color('green'));
      rect(p.x, p.y + p.h - 15, p.w, 15);
    }
    else {
      var topPlatform = true;
      for (platform of objects) {
        if (collideRectRect(p.x + 5, p.y - 5, p.w - 5, 5, platform.x + 10, platform.y + 5, platform.w - 10, platform.h)) {
          topPlatform = false;
        }
      }
      if (topPlatform) {
        fill(color('rgba(0,0,0,0.2)'));
        rect(p.x, p.y, p.w, 15);
      }
    }
    p.c = 'rgba(' + 173 + ',' + 216 + ',' + 230 + ',' + 1 + ')';
  }
  pop();
}
//draw grid and tint hov
function tileHover() {
  push();
  if (!settings.gridToggle.toggled) { noStroke(); } else {  stroke(color("gray"));}
  noFill();
  let smallTile = tileSize/2; //half of tile size
  for(var i = 0; i < grid.length*2;i++){
    for(var j = 0; j < grid[0].length*2;j++){
      let x = i*smallTile;
      let y = j*smallTile;
      //if mouse collides with tile, tint tile that is hovered over      
    if(collidePointRect(mouseX,mouseY,x,y,smallTile,smallTile)){
      push();
        fill(color("rgba(255,0,0,0.5)"))
        rect(x, y, tileSize, tileSize);
      pop();
      }
    }
  }
  if (!settings.gridToggle.toggled) { noStroke(); } else {stroke(color("black"));}                                                                     
  noFill();
  // for (var i = 0; i < grid.length; i++) {
  //   for (var j = 0; j < grid[i].length; j++) {
  //     rect(i * tileSize, j * tileSize, tileSize, tileSize);
  //   }
  // }
  pop();
}
//level text
function levelText(){
  push();
  textSize(22);
  fill(color('white'));
  var a = text("Level " + level, canvas.width - textWidth(a), 20);
  pop();
}
//draw spikes
function drawSpikes() {
  push();
  if(!settings.lineToggle.toggled){noStroke();} //disable lines
  for (spike of spikes) {
    fill(color('black'));
    triangle(spike.x1, spike.y1, spike.x2, spike.y2, spike.x3, spike.y3);
  }
  pop();
}