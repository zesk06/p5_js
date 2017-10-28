var myFont;
var vehicules = [];
var stopped_vehicules = [];
var NO_FORCE;
var DISPLAY_SPEED = false;
var DEFAULT_TEXT = "FLEE YOU FOOL";
var fontSize = 150;

// bah ugly javascript
var slider;
var current_text;

function preload() {
  //   myFont = loadFont("droid.otf");
  myFont = loadFont("Heading-Pro-Smallcase-Extrabold-trial.ttf");
}

function setup() {
  canvas = createCanvas(900, 300);
  canvas.parent("sketch");
  background(0);
  noStroke();
  fill(255);
  textFont(myFont);
  textSize(fontSize);

  NO_FORCE = createVector(0, 0);

  // GUI
  let p = createP("Text: ");
  p.id("text_id");
  p.parent("form");
  input_text = createInput(DEFAULT_TEXT);
  input_text.input(inputTextEvent);
  input_text.parent("text_id");

  p = createP("Font size: ");
  p.id("fontsize_id");
  p.parent("form");
  slider = createSlider(20, 200, fontSize, 10);
  slider.parent("fontsize_id");

  p = createP("Show Speed: ");
  p.id("speed_id");
  p.parent("form");
  checkbox = createCheckbox("", false);
  checkbox.changed(showSpeedCheckbox);
  checkbox.parent("speed_id");

  setText(DEFAULT_TEXT);
}

function draw() {
  if (slider.value() != fontSize) {
    fontSize = slider.value();
    setText(current_text);
  }
  background(51);
  vehicules.forEach(function(vehicule) {
    vehicule.behaviors();
    vehicule.update();
    vehicule.show();
  });
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

function setText(newText) {
  current_text = newText;
  let point_size = map(fontSize, 200, 20, 0.1, 0.3);
  var array = myFont.textToPoints(newText, 10, 200, fontSize, {
    sampleFactor: point_size
  });
  // vehicules shall not contains more that the number of points
  if (vehicules.length > array.length) {
    vehicules.splice(0, vehicules.length - array.length);
  }
  // insert some randomness in the letters
  shuffle(vehicules);
  //
  for (var i = 0; i < array.length; i++) {
    let element = array[i];
    if (i < vehicules.length) {
      // change to vehicule target to new location
      vehicules[i].target = createVector(element.x, element.y);
    } else {
      //not enough vehicules, create new ones
      vehicules.push(new Vehicule(element.x, element.y));
    }
  }
}

function inputTextEvent() {
  setText(this.value());
}

function showSpeedCheckbox() {
  DISPLAY_SPEED = this.checked();
}

function Vehicule(x, y) {
  this.pos = createVector(random(width), random(height));
  this.target = createVector(x, y);
  this.vel = p5.Vector.random2D(); //createVector();
  this.acc = createVector();
  this.r = 8;
  this.maxspeed = 5;
  this.maxforce = 0.3;
}

Vehicule.prototype.update = function() {
  this.vel.add(this.acc);
  this.acc.mult(0);
  this.pos.add(this.vel);
};

Vehicule.prototype.show = function() {
  let distance = p5.Vector.sub(this.target, this.pos).mag();
  const hue = 360;
  const lum = round(map(distance, 500, 0, 50, 100));
  stroke("hsl(" + hue + ",100%," + lum + "%)");
  let point_size = map(fontSize, 200, 20, 8, 2);
  strokeWeight(point_size);
  point(this.pos.x, this.pos.y);
  // Draw VEL in magnified size
  //   magVel.mult(5000);
  if (DISPLAY_SPEED) {
    strokeWeight(3);
    stroke(255, 0, 0);
    let magVel = this.vel.copy();
    magVel.mult(5);
    line(this.pos.x, this.pos.y, this.pos.x + magVel.x, this.pos.y + magVel.y);
  }
};

Vehicule.prototype.behaviors = function() {
  var arrive = this.arrive(this.target);
  this.applyForce(arrive);

  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  // apply some weight on the behaviors
  arrive.mult(1);
  flee.mult(5);

  this.applyForce(flee);
};

Vehicule.prototype.applyForce = function(f) {
  this.acc.add(f);
};

Vehicule.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var distance = desired.mag();
  // implement the slow down
  // The closer we are to the target,
  // the slower we must desire
  var speed = this.maxspeed;
  if (distance < 100) {
    speed = map(distance, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);

  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
};

Vehicule.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var distance = desired.mag();
  if (distance > 100) {
    return NO_FORCE;
  }
  var speed = map(distance, 50, 0, 200, 0);
  desired.setMag(speed);
  desired.mult(-1);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
};
