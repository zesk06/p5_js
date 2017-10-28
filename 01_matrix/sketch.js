var streams;
//constants
var symbolSize = 25;
var MAX_SPEED = 10;
var FPS = 60;

var BASE_COLOR;

function setup() {
  BASE_COLOR = color(0, 255, 80);
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  textSize(symbolSize);
  streams = [];
  for (var i = 0; i < width / symbolSize; i++) {
    x = i * symbolSize;
    y = round(random(-1000, 0));
    stream = new Stream(x, y);
    stream.createSymbols();
    streams.push(stream);
  }
  frameRate(FPS);
}

function draw() {
  // put drawing code here
  background(0, 150);

  streams.forEach(function(stream) {
    stream.render();
  });
}

function Symbol(x, y, speed, baseColor) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.switchInterval = round(random(80, 200));
  this.value;
  this.baseColor = baseColor;

  this.setValue = function() {
    if (frameCount % this.switchInterval == 0) {
      this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
    }
  };

  this.rain = function() {
    this.y = this.y + this.speed > height ? 0 : this.y + this.speed;
  };

  this.render = function() {
    this.setValue();
    if (frameCount % this.switchInterval == 0) {
      fill(255);
    } else {
      fill(this.baseColor);
    }
    text(this.value, this.x, this.y);
  };
}

function Stream(x, y) {
  console.debug("create stream");
  this.symbols = [];
  this.x = x;
  this.y = y;
  this.speed = round(random(5, MAX_SPEED));

  this.createSymbols = function() {
    var total = round(random(5, 15));
    for (var i = 0; i < total; i++) {
      var baseColor = BASE_COLOR;
      // sometime, change the color of the first symbol of stream
      // with a more glowish one
      if (i == 0 && round(random(1, 5)) == 1) {
        baseColor = color(180, 255, 180);
        // baseColor = color("#f44336");
      }
      symbol = new Symbol(this.x, this.y, this.speed, baseColor);
      symbol.setValue();
      this.symbols.push(symbol);
      // add 5 to give more inter-symbol space
      this.y -= symbolSize + 5;
    }
  };

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      symbol.render();

      symbol.rain();
    });
  };
}
