/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
const mode1Btn = document.getElementById('mode1-tab');
const mode2Btn = document.getElementById('mode2-tab');
const startSimulatorBtn = document.getElementById('startSimulator');
const resetSimulatorBtn = document.getElementById('resetSimulator');
const saveSimulatorBtn = document.getElementById('saveSimulator');
const simulateTimeDiv = document.getElementById('simulateTime');
const simulatorDiv = document.getElementById('simulator');

const canvasSize = getCanvasSize();
const fps = 60;

const pixelRatio = 200;
const allowableError = 0.03;
const targetXY = [1.2, -0.8];

let doDraw = false;
let startTime;
let count;
let xy1;
let xy2;
let frameNum;

let manipulator;
mode1Btn.addEventListener('click', () => {
  manipulator = new Manipulator(te=15, dt=1/100);
});
mode2Btn.addEventListener('click', () => {
  manipulator = new Manipulator(te=10, dt=1/100);
});

startSimulatorBtn.disabled = true;
startSimulatorBtn.addEventListener('click', () => {
  [xy1, xy2] = manipulator.calcPositionPerFrame(torqueArray, fps);
  frameNum = xy1.length;
  doDraw = true;
  startTime = Date.now();
  startSimulatorBtn.disabled = true;
  loop();
});

resetSimulatorBtn.addEventListener('click', () => {
  resetSimulation();
  startSimulatorBtn.disabled = false;
});

function resetSimulation() {
  background(240);
  count = 0;
  resetSimulatorBtn.checked = false;
  resetSimulatorBtn.disabled = true;
}

function setup() {
  const simulationCanvas = createCanvas(canvasSize[0], canvasSize[1]);
  simulationCanvas.parent('simulationCanvas');
  resetSimulation();
  frameRate(fps);
  console.log('start: ', new Date());
  noLoop();

  saveSimulatorBtn.addEventListener('click', () => {
    saveCanvas(simulationCanvas, 'result', 'png');
  });
}

function draw() {
  const canvasWidth = canvasSize[0];
  const canvasHeight = canvasSize[1];
  if (doDraw != true) {
    return 0;
  }

  background(240);
  strokeWeight(1);
  stroke(200, 50, 50);
  circle(
      canvasWidth / 2 + targetXY[0] * pixelRatio,
      canvasHeight / 2 - targetXY[1] * pixelRatio,
      allowableError * pixelRatio * 2,
  );
  const x1 = pixelRatio * xy1[count][0];
  const y1 = pixelRatio * xy1[count][1];
  const x2 = pixelRatio * xy2[count][0];
  const y2 = pixelRatio * xy2[count][1];

  strokeWeight(5); // 線幅を10pxに
  stroke(50, 50, 200);
  line(
      canvasWidth / 2, canvasHeight / 2,
      canvasWidth / 2 + x1, canvasHeight / 2 - y1,
  );
  stroke(50, 200, 50);
  line(
      canvasWidth / 2 + x1, canvasHeight / 2 - y1,
      canvasWidth / 2 + x2, canvasHeight / 2 - y2,
  );
  count += 1;
  const currentTime = (Date.now() - startTime) / 1000;
  simulateTimeDiv.textContent = currentTime;

  if (count === frameNum) {
    doDraw = false;
    noLoop();
    console.log('end: ', new Date());
    simulateTimeDiv.textContent += ' Completed!';
    resetSimulatorBtn.disabled = false;
  }
}

// function windowResized() {
//   canvasSize = getCanvasSize();
//   resizeCanvas(canvasSize[0], canvasSize[1]);
//   background(240);
// }

function getCanvasSize() {
  const canvasWidth = simulatorDiv.clientWidth;
  const simulatorDivTop = simulatorDiv.getBoundingClientRect().top +
    window.pageYOffset;
  console.log(simulatorDivTop);
  const canvasHeight = (window.innerHeight - simulatorDivTop) * 0.9;
  console.log(canvasHeight);
  return [canvasWidth, canvasHeight];
}
