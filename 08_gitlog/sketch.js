var logs;
var full_logs;

function preload() {
  full_logs = loadJSON("logs.json");
}
function setup() {
  canvas = createCanvas(600, 300);
  canvas.parent("sketch");
  background(200);
  console.log("logs are ", full_logs.logs);
  logs = full_logs.logs;

  frameRate(5);
}

var index = 0;
function draw() {
  background(0);
  stroke(255);
  fill(255);
  text(logs[index].author, width / 2, height / 2);
  index = (index + 1) % logs.length;
}
