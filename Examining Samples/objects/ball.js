class Ball {
  constructor(x, y, r, game, col) {
    this.r = r;
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.4,
      frictionAir: 0.005,
      friction: 0.1,
    });
    this.game = game;
    this.canvas = game.canvas;
    World.add(this.game.world, this.body);

    if (col) {
      this.color = col;
    } else {
      this.color = color(255, 0, 0);
    }

    this.deleted = false;
  }


  isMoving() {
    return abs(this.body.velocity.x) > 0.1 && abs(this.body.velocity.y) > 0.1;
  }

  show() {
    this.canvas.stroke(0);
    this.canvas.fill(this.color);
    this.canvas.ellipse(this.body.position.x, this.body.position.y, this.r * 2, this.r * 2);
    this.canvas.noStroke();
  }

  update() {
    if (this.isInPocket()) {
      this.remove();
    }
  }

  remove() {
    World.remove(this.game.world, this.body);
    this.deleted = true;
  }

  isInPocket() {
    for (let pocket of this.game.pockets) {
      const distance = dist(this.body.position.x, this.body.position.y, pocket.pos.x, pocket.pos.y);
      if (distance < pocketR) {
        console.log('pocket');
        return true;
      }
    }

    return false;
  }
}