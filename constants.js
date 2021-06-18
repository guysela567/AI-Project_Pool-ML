const speed = 10;
const boundThickness = 50;
const ballR = 20;
const pocketR = 40;
const pocketGap = 10;
const populationSize = 100;
const totalRows = 5;
const amount = totalRows;
const width = 700;
const height = 1000;
const genTime = 3000;
const epochs = 10;

const minStartingX = boundThickness / 2 + ballR;
const maxStartingX = width - boundThickness / 2 - ballR;
const minStartigY = minStartingX;
const maxStartingY = height - boundThickness / 2 - ballR;

const results = new Map();