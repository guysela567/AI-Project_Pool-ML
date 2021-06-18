class Population {
  constructor(size) {
    this.size = size;
    this.mutationRate = 0.05;
    this.currentEpoch = 1;

    this.setStartingPos();
    this.canvas = createNewCanvas();
    this.dnas = Array(this.size).fill(0).map(() => new DNA());
    this.results = [];
  }
  
  reset() {
    this.currentEpoch = 1;
    this.canvas.clear();

    this.setStartingPos();
    this.dnas.forEach(dna => dna.hardReset());
  }

  start() {
    this.dnas.forEach(dna => dna.game.play());
    setTimeout(() => this.newGeneration(), genTime);
  }

  setStartingPos() {
    startingPos = createVector(random(minStartingX, maxStartingX), random(minStartigY, maxStartingY));
  }

  drawTable() {
    // pockets
    this.canvas.fill(51);
    // top left
    this.canvas.rect(pocketR, pocketR, pocketR * 2 + pocketGap, pocketR * 2 + pocketGap);
    // top right
    this.canvas.rect(width - pocketR, pocketR, pocketR * 2 + pocketGap, pocketR * 2 + pocketGap);
    // bottom left
    this.canvas.rect(pocketR, height - pocketR, pocketR * 2 + pocketGap, pocketR * 2 + pocketGap);
    // bottom right
    this.canvas.rect(width - pocketR, height - pocketR, pocketR * 2 + pocketGap, pocketR * 2 + pocketGap);
    // middle left
    this.canvas.rect(pocketR, height / 2 - pocketR, pocketR * 2 + pocketGap, pocketR * 4 + pocketGap * 2);
    // middle right
    this.canvas.rect(width - pocketR, height / 2 - pocketR, pocketR * 2 + pocketGap, pocketR * 4 + pocketGap * 2);
    // background
    this.canvas.fill(0, 255, 0);
    this.canvas.rect(width / 2, height / 2, width - boundThickness * 2, height - boundThickness * 2);

    // epoch num
    this.canvas.fill(0, 150, 0);
    this.canvas.text(this.currentEpoch, width / 2, height / 2);
  }

  update() {
    this.drawTable();
    this.dnas.forEach(dna => dna.game.draw());
  }

  calcFitness() {
    let sum = 0;
    this.dnas.forEach(dna => sum += dna.calcScore()); // calculate each score and get the sum of all scores
    this.dnas.forEach(dna => dna.setFitness(dna.score / sum)); // set fitness values based on the sum
  }

  newGeneration() {
    this.calcFitness();
    this.currentEpoch++;

    // move to next scenario
    if (this.currentEpoch > epochs) {
      // add prediction to results
      const chosen = this.pickBest();
      const prediction = chosen.predict([startingPos.x / width, startingPos.y / height])
      this.addResult(startingPos, prediction);
      this.reset(); // dispose everything and reset
    } else {
      // continue to next epoch
      const savedNNs = [];
      for (let i = 0; i < this.size; i++) {
        const chosen = this.poolSelection();
        chosen.mutate(this.mutationRate);
        savedNNs.push(chosen);
      }
  
      for (let i = 0; i < this.size; i++) {
        const dna = this.dnas[i];
        dna.game.nn.dispose(); // dispose old nn
        dna.game.nn = savedNNs[i]; // assign new nn
        dna.reset(); // reset genetic data
      }
    }

    this.start();
  }

  poolSelection() {
    // Start at 0
    let index = 0;
  
    // Pick a random number between 0 and 1
    let r = random(1);
  
    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= this.dnas[index].fitness;
      // And move on to the next
      index++;
    }
  
    // Go back one
    index--;
  
    // Make sure it's a copy!
    // (this includes mutation)
    return this.dnas[index].game.nn.copy();
  }

  addResult(pos, vec) {
    this.results.push({ 
      ballPosition: {
        x: pos.x,
        y: pos.y,
      },
      hitVector: {
        x: vec[0],
        y: vec[1],
      }, 
    });
  }

  pickBest() {
    let bestScore = 0;
    for (let dna of this.dnas)
      if (dna.score > bestScore) 
        bestScore = dna.score;

    for (let dna of this.dnas)
      if (dna.score == bestScore) 
        return dna.game.nn;
  }

  downloadResults() {
    const writer = createWriter('results.json');
    writer.write(JSON.stringify(this.results, null, 2));
    writer.close();
  }
}