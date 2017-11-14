function preload() {}

function setup() {
  canvas = createCanvas(600, 300);
  canvas.parent("sketch");
  angleMode(DEGREES);
  // color now is hue /saturation/lumi
  colorMode(HSB);
  background(0);
}

let index = 0;
const MAGIC_ANGLE = 137.5;
const C = 5;
function draw() {
  translate(width / 2, height / 2);
  var angle = index * MAGIC_ANGLE;
  let r = C * sqrt(index);
  let x = r * cos(angle);
  let y = r * sin(angle);
  fill((angle - r) % 255, 255, 255);
  ellipse(x, y, 8, 8);
  index++;
}
