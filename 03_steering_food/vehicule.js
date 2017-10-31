const COLOR_GOOD = "#8BC3FF";
const COLOR_BAD = "#f44336";
const GOOD = 0;
const BAD = 1;

class Vehicule {
  constructor() {
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

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    // lost a little life
    this.age += 1;
    this.health -= 0.01;
  }

  show() {
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
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + magVel.x,
        this.pos.y + magVel.y
      );
    }
  }

  behaviors(goods, bads) {
    let goodSteer = this.seekClosest(goods, 0.2);
    goodSteer.mult(this.dna[GOOD]);
    this.applyForce(goodSteer);

    let badSteer = this.seekClosest(bads, -0.5);
    badSteer.mult(this.dna[BAD]);
    this.applyForce(badSteer);
  }

  seekClosest(targets, nutrition) {
    // search for the closest good
    let minDistance = Infinity;
    let closest = -1;
    for (let i = 0; i < targets.length; i++) {
      let good = targets[i];
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
  }

  applyForce(f) {
    this.acc.add(f);
  }

  seek(target) {
    if (target == undefined) {
      return NO_FORCE;
    }
    let desired = p5.Vector.sub(target, this.pos);
    let speed = this.maxspeed;
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  }

  /**
   * Return the force to apply to get an slow down arrive behavior.
   * @param {p5.Vector} target
   */
  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let distance = desired.mag();
    // implement the slow down
    // The closer we are to the target,
    // the slower we must desire
    let speed = this.maxspeed;
    if (distance < 100) {
      speed = map(distance, 0, 100, 0, this.maxspeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  }

  flee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let distance = desired.mag();
    if (distance > 100) {
      return NO_FORCE;
    }
    let speed = map(distance, 50, 0, 200, 0);
    desired.setMag(speed);
    desired.mult(-1);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  }

  breed(other) {
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
  }
}
