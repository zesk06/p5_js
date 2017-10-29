const COLOR_GOOD = "#8BC34A";
const COLOR_BAD = "#f44336";
GOOD = 0;
BAD = 1;

function Vehicule() {
  this.pos = createVector(random(width), random(height));
  this.vel = p5.Vector.random2D(); //createVector();
  this.acc = createVector();
  this.maxspeed = 5;
  this.maxforce = 0.3;
  this.r = 5;

  this.health = 1;
  this.age = 0;

  this.display_speed = false;
  this.display_dna = false;

  this.dna = [];
  this.dna[GOOD] = random(-3, 3);
  this.dna[BAD] = random(-3, 3);
}

Vehicule.prototype.update = function() {
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
  // lost a little life
  this.age += 1;
  this.health -= 0.01;
};

Vehicule.prototype.show = function() {
  let good_color = color(COLOR_GOOD);
  let bad_color = color(COLOR_BAD);
  let fcolor = lerpColor(bad_color, good_color, this.health);

  // draw a triangle heading for the velocity
  noStroke();
  fill(fcolor);
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.vel.heading());
  beginShape();
  vertex(-this.r / 2, -this.r / 2);
  vertex(this.r, 0);
  vertex(-this.r / 2, this.r / 2);
  endShape(CLOSE);

  if (this.display_dna) {
    strokeWeight(3);
    stroke(COLOR_GOOD);
    line(0, 0, this.dna[GOOD] * this.r, 0);
    stroke(COLOR_BAD);
    line(0, 0, this.dna[BAD] * this.r, 0);
  }

  pop();

  if (this.display_speed) {
    strokeWeight(3);
    stroke(255, 0, 0);
    let magVel = this.vel.copy();
    magVel.mult(5);
    line(this.pos.x, this.pos.y, this.pos.x + magVel.x, this.pos.y + magVel.y);
  }
};

Vehicule.prototype.behaviors = function(goods, bads) {
  var goodSteer = this.seekClosest(goods, 0.5);
  goodSteer.mult(this.dna[GOOD]);
  this.applyForce(goodSteer);

  var badSteer = this.seekClosest(bads, -0.1);
  badSteer.mult(this.dna[BAD]);
  this.applyForce(badSteer);
};

Vehicule.prototype.seekClosest = function(targets, nutrition) {
  // search for the closest good
  let minDistance = Infinity;
  let closest = -1;
  for (var i = 0; i < targets.length; i++) {
    var good = targets[i];
    let distance = p5.Vector.dist(this.pos, good);
    if (distance < minDistance) {
      minDistance = distance;
      closest = i;
    }
  }
  if (closest != -1) {
    if (minDistance < 5) {
      targets.splice(closest, 1);
      this.health += nutrition;
      this.health = min(this.health, 2);
      if (nutrition > 0) {
        stroke(COLOR_GOOD);
      } else {
        stroke(COLOR_BAD);
      }
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
      return NO_FORCE;
    }
    let target = targets[closest];
    return this.seek(target);
  }
  return NO_FORCE;
};

Vehicule.prototype.applyForce = function(f) {
  this.acc.add(f);
};

Vehicule.prototype.seek = function(target) {
  if (target == undefined) {
    return NO_FORCE;
  }
  var desired = p5.Vector.sub(target, this.pos);
  var speed = this.maxspeed;
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
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

Vehicule.prototype.breed = function(other) {
  if (other == undefined) {
    console.log("bahhh");
  }
  let child = new Vehicule();
  child.dna[GOOD] = (this.dna[GOOD] + other.dna[GOOD]) / 2;
  child.dna[BAD] = (this.dna[BAD] + other.dna[BAD]) / 2;
  // mutation !
  if (random() < 0.05) {
    child.dna[GOOD] = random(-5, 5);
  }
  // mutation !
  if (random() < 0.05) {
    child.dna[BAD] = random(-5, 5);
  }
  return child;
};
