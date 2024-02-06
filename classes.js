//classes
class Block {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.gravity = 1;
    this.yVel = 0;
    this.isGrounded = false;
  }
}
class Triangle {
  constructor(x1, y1, x2, y2, x3, y3) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
  }
}
class Toggle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.toggled = false;
    this.c = 'blue';
    this.icon = {
      x: x,
      y: y,
      w: w / 2,
      h: h
    }
  }
  draw() {
    push();
    if (this.x < this.icon.x) { fill(color('rgba(0,0,255,0.5)')) }
    else { fill(color('gray')); }
    rect(this.x, this.y, this.w, this.h, 50);
    fill(color(this.c));
    rect(this.icon.x, this.icon.y, this.icon.w, this.icon.h, 50);
    pop();
  }
  onClick() {
    if (!collidePointRect(mouseX, mouseY, this.x, this.y, this.w, this.h)) { return; }
    this.toggled = !this.toggled;
    if (Math.floor(this.icon.x) == Math.floor(this.x))
      this.icon.x += this.icon.w;
    else
      this.icon.x -= this.icon.w
  }
}
class Button{
  constructor(x,y,w,h,content,type = "text"){
    this.x =x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = 'rgb(100,100,100)'
    this.type = type;
    this.content = content;
    this.s = 0;
    this.r = 0;
    this.state = "idle"; // change state to hover,clicked, later
    if(type == "text"){
      textSize(this.s);
      while(this.w > textWidth(this.content)){this.s++; textSize(this.s)}
      while(this.h-(this.h/100*17) < this.s){this.s--;}
    }
  }
  draw(){
    push();
    fill(color(this.c));
    rect(this.x,this.y,this.w,this.h,this.r);
    if(this.type == "text"){
      textAlign(CENTER,CENTER);
      fill(color('white'));
      textSize(this.s);
      text(this.content,this.x+this.w/2,this.y+this.h/2);
    }
    else{
      image(this.content,this.x,this.y,this.w,this.h);
    }
    if(this.state == "hover"){
      fill(color('rgba(0,0,0,0.2)'));
      rect(this.x,this.y,this.w,this.h,this.r);
    }
    pop();
  }
}