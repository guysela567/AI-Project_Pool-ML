class Boundary {
  constructor(x, y, w, h, game) {
    this.w = w;
    this.h = h;
    this.game = game;
    this.canvas = game.canvas;
    this.body = Bodies.rectangle(x, y, w, h, {
      isStatic: true,
      restitution: 0.5,
    });
    World.add(this.game.world, this.body);
  }

  show() {
    this.canvas.fill(80, 50, 20);
    this.canvas.rect(this.body.position.x, this.body.position.y, this.w, this.h);
  }
}