/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
const torqueFileInput = document.getElementById('torqueFile');
const startSimulatorBtn = document.getElementById('startSimulator');
const resetSimulatorBtn = document.getElementById('resetSimulator');
const showTargetBtn = document.getElementById('showTarget');
const saveSimulatorBtn = document.getElementById('saveSimulator');
const simulateTimeDiv = document.getElementById('simulateTime');
const simulatorDiv = document.getElementById('simulationCanvas');

let canvasSize = getCanvasSize();

const fps = 60;

const allowableError = 0.03;
const targetXY = [1.2, -0.8];

let doDraw = false;
let startTime;
let count;
let xy1;
let xy2;
let frameNum;
let doShowTarget = 0;

const manipulator = new Manipulator(te=15, dt=1/100);
let pixelRatio = manipulator.calcPixelRatio(canvasSize);

const torqueArray = [];
torqueFileInput.addEventListener('change', (e) => {
  const file = e.target.files;
  file[0].text().then( (text) => {
    const lines = text.split(/\n|\r\n/);
    let isFirstLine = true;
    for (const line of lines) {
      if (isFirstLine === true | line.length === 0) {
        isFirstLine = false;
        continue;
      }
      const torqueStr = line.split(',');
      const torque = [parseFloat(torqueStr[0]), parseFloat(torqueStr[1])];
      torqueArray.push(torque);
    }
    startSimulatorBtn.disabled = false;
  });
}, false);

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

showTargetBtn.addEventListener('click', () => {
  doShowTarget = 1 - doShowTarget;
  if (doShowTarget > 0) {
    showTargetBtn.classList.add('active');
  } else {
    showTargetBtn.classList.remove('active');
  }
  if (doDraw != true) {
    redraw();
  }
});

function resetSimulation() {
  canvasSize = getCanvasSize();
  pixelRatio = manipulator.calcPixelRatio(canvasSize);
  background(240);
  count = 0;

  resetSimulatorBtn.checked = false;
  resetSimulatorBtn.disabled = true;

  showTargetBtn.classList.remove('active');
  doShowTarget = 0;
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
  const coordinates = new CoordinatesConverter(
      canvasWidth / 2, canvasHeight / 2, pixelRatio,
  );

  background(240);
  if (doShowTarget > 0) {
    strokeWeight(1);
    console.log(doShowTarget);
    stroke(200, 50, 50);
    coordinates.circle(targetXY[0], targetXY[1], allowableError * 2);
  }

  if (doDraw != true) {
    return 0;
  }

  strokeWeight(5);
  stroke(50, 50, 200);
  coordinates.line(0, 0, xy1[count][0], xy1[count][1]);
  stroke(50, 200, 50);
  coordinates.line(xy1[count][0], xy1[count][1], xy2[count][0], xy2[count][1]);

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

function getCanvasSize() {
  const canvasWidth = simulatorDiv.clientWidth;
  const canvasTopPixel = simulatorDiv.getBoundingClientRect().top;
  const simulatorDivTop = canvasTopPixel + window.pageYOffset;
  const canvasHeight = (window.innerHeight - simulatorDivTop) - 10;
  return [canvasWidth, canvasHeight];
}
