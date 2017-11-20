var cities = [];
var citiesNb = 10;

function preload() {}

function setup() {
  canvas = createCanvas(600, 300);
  canvas.parent("sketch");
  background(0);

  for (let i = 0; i < citiesNb; i++) {
    cities.push(createVector(random(width), random(height)));
  }
  text("toto", 20, 20);
}

function draw() {
  strokeWeight(3);
  noFill();
  stroke(255);
  beginShape();
  cities.forEach(city => vertex(city.x, city.y));
  endShape();

  noStroke();
  fill(255);
  cities.forEach(city =>
    text(round(city.x) + ":" + round(city.y), city.x, city.y)
  );
}
