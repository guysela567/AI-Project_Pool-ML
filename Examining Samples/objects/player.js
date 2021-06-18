class Player extends Ball {
  constructor(x, y, r, game) {
    super(x, y, r, game);
    this.color = color(255, 200);
    this.index = 0;
    this.game = game;
  }

  shoot() {
    // shoot the player based on the sample results
    let { x, y } = samples[sampleIndex].hitVector;
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