class DNA {
  constructor(nn) {
    this.game = new Game(nn);
    this.score = 0;
    this.fitness = 0;
  }

  calcScore() {
    let score = 0;
    for (let i = 0; i < this.game.ballAmount; i++) {
      if (!this.game.balls[0] || this.game.balls[0].isInPocket())
        score += 10;
      else {
        const { x, y } = this.game.balls[0].body.position;
        const ballPos = createVector(x, y);
        const dists = this.game.pockets.map(p => p5.Vector.dist(ballPos, p.pos));
        const closest = Math.min(...dists);
        score += 100 / closest;
      }
    }

    this.score = score ** 2;
    return this.score;
  }

  setFitness(fitness) {
    this.fitness = fitness;
  }

  reset() {
    this.score = 0;
    this.fitness = 0;
    this.game.reset();
  }

  hardReset() {
    this.score = 0;
    this.fitness = 0;
    this.game.hardReset();
  }
}