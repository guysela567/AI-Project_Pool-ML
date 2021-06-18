class Player extends Ball {
  constructor(x, y, r, game) {
    super(x, y, r, game);
    this.color = color(255, 200);
    this.index = 0;
    this.game = game;
  }

  shoot(x, y) {
    // make a prediction using the neural network
    const inputs = [this.game.balls[0].body.position.x / width, this.game.balls[0].body.position.y / height];
    [x, y] = this.game.nn.predict(inputs)
    x = map(x, 0, 1, -0.5, 0.5);
    y = map(y, 0, 1, -0.5, 0.5);
    
    const pos = {
      x: this.body.position.x,
      y: this.body.position.y
    };
    Body.applyForce(this.body, pos, {
      x,
      y
    });
  }

  inPocket() {
    const pos = this.body.position;
    for (let pocket of this.game.pockets) {
      if (dist(pos.x, pos.y, pocket.pos.x, pocket.pos.y) < pocketR) {
        return true;
      }
    }
    return false;
  }
}