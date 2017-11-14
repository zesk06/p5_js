function preload() {}

function setup() {
  canvas = createCanvas(600, 300);
  canvas.parent("sketch");
  background(0);
}

function draw() {
  ellipse(width / 2, height / 2, 100, 100);
}
