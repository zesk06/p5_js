function setup() {
    createCanvas(400, 400);
}

var factor = 0.01;
function draw() {
    background(220);
    var pnoise = noise(factor*(mouseX + mouseY));
    var size = map(pnoise, 0,1,0,50);
    ellipse(mouseX, mouseY, size, size);
}
