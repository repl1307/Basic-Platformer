//create grid that fills casn 
function createGrid(tileSize){
    for (var i = 0; i < canvas.width; i += tileSize) {
    grid.push([]);
    for (var j = 0; j < canvas.height; j += tileSize) {
      grid[i / tileSize].push(new Block(i, j, tileSize, tileSize, "lightgrey"));
      delete grid[i / tileSize][j / tileSize].gravity;
      delete grid[i / tileSize][j / tileSize].yVel;
      delete grid[i / tileSize][j / tileSize].isGrounded;
    }
  }
}
//create platforms
function createPlatforms(count) {
  for (var i = 0; i < count; i++) {
    objects.push(new Block(50 * i, 50, 50, 50, 'rgba(	173, 216, 230,1)'));
  }
}
//adjust platforms into rows
function createRow(length, yPos, xPos) {
  for (var i = 0; i < length; i++) {
    objects[rowStart].y = yPos;
    objects[rowStart].x = xPos + (objects[rowStart].w * i);
    rowStart++;
  }
}
//create a spike on top of platform
//standard spike has base of 20 and height of 20
function createSpike(platform,spikeCount = 1) {
  let p = platform;
  let centerX = p.x+p.w/2;
  let x1,x2,x3;
  if(spikeCount %2 == 0){
    x1 = centerX-20;
    x2 = centerX-10;
    x3 = centerX;
  }
  else{
    x1 = centerX-10;
    x2 = centerX;
    x3 = centerX+10;
  }
  for(var i = 0; i < spikeCount; i++){
  spikes.push(new Triangle(p.x + 10, p.y, centerX, p.y - 20, p.x + p.w - 10, p.y));
  }
}