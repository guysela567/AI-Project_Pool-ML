class Game {
  constructor(nn) {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = 0; // disable gravity
    // Engine.run(this.engine)

    this.balls = [];
    this.bounds = [];
    this.pockets = [];
    this.waitForStop = false;
    this.timeFromStart = 0;
    this.shooting = false;
    this.dragVec;
    this.dragging = false;
    this.ballAmount = 0;
    this.nn = nn ? nn : new NeuralNetwork(2, 5, 2);
    this.canvas = createNewCanvas();
    this.player = new Player(width / 2, height / 3 * 2, ballR, this);

    // pile
    this.setPile();

    // boundaries:
    // top
    this.bounds[0] = new Boundary(width / 2, 0, width - pocketR * 4 - pocketGap, boundThickness * 2, this);
    // bottom
    this.bounds[1] = new Boundary(width / 2, height, width - pocketR * 4 - pocketGap, boundThickness * 2, this);
    // right - top section
    this.bounds[2] = new Boundary(width, height / 4 + pocketR + pocketGap / 4 - pocketR / 2 - pocketGap / 2, boundThickness * 2, height / 2 - pocketR * 2 - pocketGap / 2 - pocketR - pocketGap / 2, this);
    // right - bottom section
    this.bounds[3] = new Boundary(width, height * 3 / 4 - pocketR - pocketGap / 4 + pocketR / 2 + pocketGap / 2, boundThickness * 2, height / 2 - pocketR * 2 - pocketGap / 2 - pocketR - pocketGap / 2, this);
    // left - top section
    this.bounds[4] = new Boundary(0, height / 4 + pocketR + pocketGap / 4 - pocketR / 2 - pocketGap / 2, boundThickness * 2, height / 2 - pocketR * 2 - pocketGap / 2 - pocketR - pocketGap / 2, this);
    // left - bottom section
    this.bounds[5] = new Boundary(0, height * 3 / 4 - pocketR - pocketGap / 4 + pocketR / 2 + pocketGap / 2, boundThickness * 2, height / 2 - pocketR * 2 - pocketGap / 2 - pocketR - pocketGap / 2, this);

    // pockets:
    // top left
    this.pockets[0] = new Pocket(pocketR, pocketR, pocketR, this);
    // top right
    this.pockets[1] = new Pocket(width - pocketR, pocketR, pocketR, this);
    // bottom left
    this.pockets[2] = new Pocket(pocketR, height - pocketR, pocketR, this);
    // bottom right
    this.pockets[3] = new Pocket(width - pocketR, height - pocketR, pocketR, this);
    // middle right
    this.pockets[4] = new Pocket(width - pocketGap, height / 2, pocketR, this);
    // middle left
    this.pockets[5] = new Pocket(pocketGap, height / 2, pocketR, this);

    this.canvas.textAlign(CENTER, CENTER);
    this.play();
  }

  hardReset() {
    this.reset();
    this.nn.dispose(); // dispose old nn
    this.nn = new NeuralNetwork(2, 5, 2);
  }
  
  play() {
    this.player.shoot();
  }

  draw() {
    for (let i = 0; i < 1; i++) {
      Engine.update(this.engine);
      this.canvas.clear();
      // this.drawTable();

      // show boundaries
      this.bounds.forEach(bound => bound.show());

      // show pockets
      for (let pocket of this.pockets) {
        pocket.show();
      }

      // show balls
      for (let i = this.balls.length - 1; i >= 0; i--) {
        this.balls[i].update();
        if (this.balls[i].deleted) {
          this.balls.splice(i, 1);
        } else {
          this.balls[i].show();
        }
      }

      // this.showGuidelines();

      // show player
      this.player.show();

      if (this.player.inPocket()) {
        this.reset();
      }
    }
  }

  showGuidelines() {
    if (this.dragging) {
      this.canvas.push();
      this.canvas.stroke(255);
      this.canvas.strokeWeight(3);

      const mouse = createVector(mouseX, mouseY);
      mouse.sub(this.dragVec);
      const pos = this.player.body.position;
      const posVec = createVector(pos.x, pos.y);
      posVec.add(mouse);

      this.canvas.line(this.player.body.position.x, this.player.body.position.y, posVec.x, posVec.y);
      this.canvas.pop();
    }
  }

  drawTable() {
    this.canvas.clear();
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
  }
  
  reset() {
    World.remove(this.world, this.player.body);
    this.player = new Player(width / 2, height / 3 * 2, ballR, this);
    this.balls.forEach(ball => ball.remove());

    this.setPile();
  }
  
  setPile() {
    // this.balls = [];
    // let changingAmount = amount;
    // for (let j = 0; j < totalRows; j++) {
    //   changingAmount--;
    //   for (let i = 0; i <= changingAmount; i++) {
    //     let x;
    //     if (amount % 2 == 0) {
    //       x = width / 2 + i * ballR * 2 - (changingAmount - 1) * ballR;
    //     } else {
    //       x = width / 2 + i * ballR * 2 - changingAmount * ballR;
    //     }
    //     const y = height / 4 + j * ballR * 2;
    //     this.balls.push(new Ball(x, y, ballR, this));
    //   }
    // }
  
    this.balls = [new Ball(startingPos.x, startingPos.y, ballR, this)];
    this.ballAmount = this.balls.length;
  }

  ballsMoving() {
    if (this.player.isMoving()) {
      return true;
    } else {
      for (let ball of this.balls) {
        if (ball.isMoving()) {
          return true;
        }
      }
    }
    return false;
  }

  mousePressed() {
    if (!this.ballsMoving()) {
      this.dragging = true;
      this.dragVec = createVector(mouseX, mouseY);
    }
  }

  mouseReleased() {
    if (this.dragging) {
      const x = constrain(map(mouseX - this.dragVec.x, -250, 250, -0.05, 0.05), -0.2, 0.2);
      const y = constrain(map(mouseY - this.dragVec.y, -250, 250, -0.05, 0.05), -0.2, 0.2);
      this.player.shoot(x, y);
      this.dragging = false;
    }
  }
}