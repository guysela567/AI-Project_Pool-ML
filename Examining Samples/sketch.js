const {
  Engine,
  World,
  Body,
  Bodies
} = Matter;


let game;
let samples;
let sampleIndex = 0;
let startingPos;
let doneTraining = false;
let model;

function preload() {
  //-- data gather --\\
  loadJSON('ai/results.json', data => {
    samples = Object.values(data);

    // const dataset = tf.data.array(samples.map(({ ballPosition, hitVector }) => {
    //   return { xs: [ballPosition.x / width, ballPosition.y / height, 0.5, 0.5], ys: Object.values(hitVector) };
    // })).batch(2);

    // //-- machine learning --\\
    // model = tf.sequential();

    // model.add(tf.layers.dense({
    //  inputShape: [4],
    //  units: 100,
    //  activation: 'tanh',
    // }));

    // model.add(tf.layers.dense({
    //   inputShape: [100],
    //   units: 2,
    //   activation: 'sigmoid',
    //  }));

    // model.compile({
    //   optimizer: tf.train.sgd(0.01), // learning rate
    //   loss: 'meanSquaredError',
    // });

    // model.fitDataset(dataset, {
    //   epochs: 10000,
    //   callbacks: {
    //     onEpochEnd: async (epoch, logs) => {
    //       console.log(epoch + ':' + logs.loss);
    //     },
    //     onTrainEnd: () => console.log(model.predict(tf.tensor2d([[188.94916764914726 / width, 575.1646970639758 / height]])).dataSync()),
    //   },
    // });
  });

}

function setup() {
  // -- game logic --\\
  startingPos = samples[sampleIndex].ballPosition;
  game = new Game();
}

function draw() {
  game.draw();
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
