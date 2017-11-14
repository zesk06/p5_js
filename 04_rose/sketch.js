function preload() {}

let slider_n;
let slider_d;
function setup() {
  canvas = createCanvas(500, 500);
  canvas.parent("sketch");
  slider_n = createSlider(1, 10, 4, 0.1);
  slider_d = createSlider(1, 10, 1, 0.1);
}

function draw() {
  let K = slider_n.value() / slider_d.value();
  background(0);
  translate(width / 2, height / 2);
  noFill();
  stroke(255);
  strokeWeight(3);
  beginShape();
  // ellipse(width / 2, height / 2, 100, 100);
  for (let a = 0; a < slider_d.value() * TWO_PI * 2; a += 0.01) {
    let r = 200 * cos(K * a);
    let x = r * cos(a);
    let y = r * sin(a);
    point(x, y);
    vertex(x, y);
  }
  endShape();
}
