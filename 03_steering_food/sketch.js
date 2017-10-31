let vehicules = [];
let dead_vehicules = [];
let NO_FORCE;
const MAX = 50;
let foods = [];
let poisons = [];

let generation = 0;

function preload() {}

function setup() {
  canvas = createCanvas(400, 300);
  canvas.parent("sketch");
  background(0);
  noStroke();
  fill(255);

  NO_FORCE = createVector(0, 0);

  for (let i = 0; i < MAX; i++) {
    vehicules.push(new Vehicule(random(width), random(height)));
  }
  for (let i = 0; i < MAX; i++) {
    foods.push(createVector(random(width), random(height)));
    poisons.push(createVector(random(width), random(height)));
  }
  // GUI
  textSize(16);
}

function draw() {
  background(51, 30);
  fill(51);
  rect(0, 0, 100, 100);
  noStroke();
  fill(255);
  text("gen: " + generation, 10, 50);
  stroke(color("#8BC34A"));
  strokeWeight(4);
  foods.forEach(food => point(food.x, food.y));
  stroke(color("#f44336"));
  strokeWeight(8);
  poisons.forEach(poison => point(poison.x, poison.y));
  // handle vehicule
  for (let i = vehicules.length - 1; i >= 0; i--) {
    let vehicule = vehicules[i];
    vehicule.behaviors(foods, poisons);
    vehicule.update();
    vehicule.show();
    // death of a vehicule - it may let a food
    if (vehicule.health < 0) {
      let dead_body = vehicules.splice(i, 1)[0];
      if (
        dead_body.pos.x < width &&
        dead_body.pos.x > 0 &&
        dead_body.pos.y < height &&
        dead_body.pos.y > 0
      ) {
        foods.push(dead_body.pos);
      }
      dead_vehicules.push(dead_body);
    }
  }

  if (vehicules.length == 0) {
    console.log("no more vehicules == end of generation");
    next_gen();
  }
  //pop up food ?
  if (random() < 0.05) {
    foods.push(createVector(random(width), random(height)));
  }
}

function next_gen() {
  generation += 1;
  background(51);

  const best_individual = dead_vehicules[dead_vehicules.length - 1];
  console.log("max age: " + best_individual.age);
  console.log("Best DNA: " + best_individual.dna);
  // breed along the age
  // keep best half of them
  dead_vehicules.splice(0, dead_vehicules.length / 2);

  let breeders = [];
  for (let i = 0; i < dead_vehicules.length; i++) {
    if (dead_vehicules[i].age != 100) {
      breeders.push(dead_vehicules[i]);
    }
  }
  dead_vehicules.splice(0, dead_vehicules.length);

  if (breeders.length == 0) {
    // total failure --- restart DNA from scratch
    console.log("Total evolution failure - restart from the begining");
    for (let i = 0; i < MAX; i++) {
      vehicules.push(new Vehicule(random(width), random(height)));
    }
  } else {
    while (vehicules.length < MAX) {
      const father_index = round(random(0, breeders.length - 1));
      const mother_index = round(random(0, breeders.length - 1));
      const father = breeders[father_index];
      const mother = breeders[mother_index];
      const child1 = father.breed(mother);
      const child2 = father.breed(mother);
      vehicules.push(child1);
      vehicules.push(child2);
    }
  }

  while (foods.length < MAX) {
    foods.push(createVector(random(width), random(height)));
  }
  while (poisons.length < MAX) {
    poisons.push(createVector(random(width), random(height)));
  }
  console.log("vehicule nb", vehicules.length);
}
