var tree = [];
var walker;
var walker_speed;
var r = 16;

function preload() {}

function setup() {
  canvas = createCanvas(600, 300);
  canvas.parent("sketch");
  background(0);

  tree[0] = createVector(width / 2, height / 2);
  walker = createVector(random(width), random(height));
  walker_speed = createVector(random(-5, 5), random(-5, 5));
}

function draw() {
  background(0);

  strokeWeight(r);
  stroke(255);

  ellipse(walker.x, walker.y, 100, 100);
  walker = walker.add(walker_speed);

  if (walker.y > height) {
    walker.y = 0;
  }
  if (walker.y < 0) {
    walker.y = height;
  }

  if (walker.x > width) {
    walker.x = 0;
  }
  if (walker.x < 0) {
    walker.x = width;
  }
}
