const {
  Engine,
  World,
  Body,
  Bodies
} = Matter;


let population;
let startingPos;

function setup() {
  population = new Population(populationSize);
  population.start();
}

function draw() {
  population.update();
}

function createNewCanvas() {
  const c = createGraphics(width, height).show();

  c.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
  c.noStroke();
  c.rectMode(CENTER);
  c.textSize(100)
  c.textAlign(CENTER, CENTER)

  return c;
}

function mousePressed() {
  // games.forEach(game => game.mousePressed());
}

function mouseReleased() {
  // games.forEach(game => game.mouseReleased());
}

function keyPressed() {
  if (key == ' ')
    population.downloadResults();
}
