//collisions - platforms, spikes, goal
function collisions(){
  platformCollision(player);
  goalReached(player);
  hitSpike(player);//spike collision
  //reset player if out of bounds
  if (player.y > canvas.height) {
    player.y = 0;
    player.x = 0;
    player.yVel = 0;
    for(obj of objects){obj.x+=shift;}
    for(spike of spikes){
      spike.x1+=shift;spike.x2+=shift;spike.x3+=shift;
    }
    goal.x+=shift;
    shift = 0;
  }
}
//stop object from going through sides of platforms
//right side of platform
function rightCollision(obj) {
  push();
  for (p of objects) {
    if (settings.colliderToggle.toggled) {
      fill(color('yellow'));
      rect(p.x + p.w - 5, p.y + 10, 10, 25);
    }
    if (collideRectRect(p.x + p.w - 10, p.y + 10, 10, 25, obj.x - 5, obj.y, obj.w, obj.h)) {
      return true;
    }
  }
  pop();
}
//left side of platform
function leftCollision(obj) {
  push();
  for (p of objects) {
    if (settings.colliderToggle.toggled) {
      fill(color('yellow'));
      rect(p.x - 5, p.y + 10, 10, 25)
    }
    if (collideRectRect(p.x - 5, p.y + 10, 10, 25, obj.x, obj.y, obj.w, obj.h)) {
      return true;
    }
  }
  pop();
}
//if spike is collided with
function hitSpike(obj) {
  push();
  for (var i = 0; i < spikes.length; i++) {
    var s = spikes[i];
    if (settings.colliderToggle.toggled) {
      fill(color('orange'));
      rect(s.x1 + 8, s.y1 - 10, 15, 10);
    }
    if (collideRectRect(obj.x, obj.y, obj.w, obj.h, s.x1 + 8, s.y1 - 10, 15, 10)) {
      obj.x = 0;
      obj.y = 0;
      obj.yVel = 0;
    }
  }
  pop();
}
//stop object from going through bottom of platforms
function platformCollision(obj) {
  for (var i = 0; i < objects.length; i++) {
    var p = objects[i];
    if (collideRectRect(obj.x, obj.y, obj.w, 15, p.x, p.y + p.h - 15, p.w, 15)) {
      obj.y = p.y + p.h;
      obj.yVel = -2;
    }
  }
}
//if platform collides with object
function isGrounded(obj) {
  for (var i = 0; i < objects.length; i++) {
    var p = objects[i];
    //if bottom of player touches platform
    if (collideRectRect(obj.x, obj.y + obj.h - 15, obj.w, 15, p.x, p.y, p.w, 15)) {
      p.c = 'rgba(' + 133 + ',' + 176 + ',' + 190 + ',' + 1 + ')';
      obj.y = p.y - obj.h;
      return true;
    }
  }
  setTimeout(()=>{return false;},50); //delay fall by x milliseconds
}
//if goal is collided with
function goalReached(obj) {
  if (collideRectRect(obj.x, obj.y, obj.w, obj.h, goal.x, goal.y, goal.w, goal.h)) {
    if (level < levels.length) { level++; }
    objects = [];
    spikes = [];
    rowStart = 0;
    obj.x = 0;
    obj.y = 0;
    obj.yVel = 0;
    levelChange();
  }
}
// check if specified button is colliding with mouse pos, returns bool
function buttonCollision(button){
  if(collidePointRect(mouseX,mouseY,button.x,button.y,button.w,button.h)){
    return true;
  }
  return false;
}
//if button is clicked execute function and animation
function buttonClick(button,func){
  if(buttonCollision(button) && button.state !="click"){
    button.state = "click";
    let xp = button.w/100*15;
    let yp = button.h/100*15;
    button.x+=xp/2;
    button.y+=yp/2;
    button.w-=xp;
    button.h-=yp;
    setTimeout(()=>{
      button.x-=xp/2;
      button.y-=yp/2;
      button.w+=xp;
      button.h+=yp;
      button.state = "idle";
      },250);
      func();
  }
}
//if button is hovered on and not clicked
function buttonHover(button){
  if(buttonCollision(button) && button.state !="click"){
    button.state = "hover";
  }
  else{
    button.state = "idle";
  }
}