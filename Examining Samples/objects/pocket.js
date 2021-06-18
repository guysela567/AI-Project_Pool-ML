class Pocket {
  constructor(x, y, r, game) {
    this.pos = createVector(x, y);
    this.r = r;
    this.canvas = game.canvas;
  }

  show() {
    this.canvas.fill(0);
    this.canvas.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}