/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
const torqueFileInput = document.getElementById('torqueFile');
const startSimulatorBtn = document.getElementById('startSimulator');
const resetSimulatorBtn = document.getElementById('resetSimulator');
const targetBtn = document.getElementById('target');
const saveSimulatorBtn = document.getElementById('saveSimulator');
const simulateTimeDiv = document.getElementById('simulateTime');
const timeProgressBar = document.getElementById('timeProgressBar');
const simulatorDiv = document.getElementById('simulationCanvas');

let canvasSize = getCanvasSize();

const fps = 60;

const allowableError = 0.03;
const targetXY = [1.2, -0.8];

let doDraw = false;
let startTime;
let count = 0;
let xy1Array;
let xy2Array;
let frameNum;
let doShowTarget = 0;
let coordinates;

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
  [xy1Array, xy2Array] = manipulator.calcPositionPerFrame(torqueArray, fps);
  frameNum = xy1Array.length;
  doDraw = true;
  startTime = Date.now();
  startSimulatorBtn.disabled = true;
  timeProgressBar.classList.add('progress-bar-striped');
  timeProgressBar.classList.add('progress-bar-animated');
  loop();
});

resetSimulatorBtn.addEventListener('click', () => {
  resetSimulation();
  startSimulatorBtn.disabled = false;
});

targetBtn.addEventListener('click', () => {
  doShowTarget = 1 - doShowTarget;
  if (doShowTarget > 0) {
    targetBtn.classList.add('active');
  } else {
    targetBtn.classList.remove('active');
  }
  if (doDraw != true) {
    draw();
  }
});

function resetSimulation() {
  canvasSize = getCanvasSize();
  resizeCanvas(canvasSize[0], canvasSize[1]);
  pixelRatio = manipulator.calcPixelRatio(canvasSize);
  coordinates = new CoordinatesConverter(
      canvasSize[0] / 2, canvasSize[1] / 2, pixelRatio,
  );
  background(240);
  count = 0;

  resetSimulatorBtn.checked = false;
  resetSimulatorBtn.disabled = true;

  targetBtn.classList.remove('active');
  doShowTarget = 0;

  simulateTimeDiv.textContent = 'Time (sec): 0';
  timeProgressBar.setAttribute('style', `width: 0%;`);
  timeProgressBar.ariaValueNow = '0';

  redraw();
}

function setup() {
  const simulationCanvas = createCanvas(canvasSize[0], canvasSize[1]);
  simulationCanvas.parent('simulationCanvas');
  resetSimulation();
  frameRate(fps);
  console.log('start: ', new Date());
  background(240);
  noLoop();

  saveSimulatorBtn.addEventListener('click', () => {
    saveCanvas(simulationCanvas, 'result', 'png');
  });
}

function draw() {
  background(240);
  if (doShowTarget > 0) {
    drawTarget();
  }
  if (doDraw != true) {
    if (count === 0) {
      drawManipulator(
          [manipulator.initX1, manipulator.initY1],
          [manipulator.initX2, manipulator.initY2],
      );
    } else {
      drawManipulator(xy1Array[count], xy2Array[count]);
    }
    return 0;
  }
  drawManipulator(xy1Array[count], xy2Array[count]);
  const currentTime = (Date.now() - startTime) / 1000;

  const progress = count * 100 / (frameNum - 1);
  simulateTimeDiv.textContent = `Time (sec): ${currentTime}`;
  timeProgressBar.setAttribute('style', `width: ${progress}%;`);
  timeProgressBar.ariaValueNow = `${progress}`;

  if (count === frameNum - 1) {
    doDraw = false;
    noLoop();
    console.log('end: ', new Date());
    simulateTimeDiv.textContent += ' Completed!';
    timeProgressBar.classList.remove('progress-bar-striped');
    timeProgressBar.classList.remove('progress-bar-animated');
    timeProgressBar.setAttribute('style', `width: 100%;`);
    timeProgressBar.ariaValueNow = '100';
    resetSimulatorBtn.disabled = false;
    return 0;
  }

  count += 1;
}

function drawTarget() {
  strokeWeight(1);
  // console.log(doShowTarget);
  stroke(200, 50, 50);
  coordinates.circle(targetXY[0], targetXY[1], allowableError * 2);
}

function drawManipulator(xy1, xy2) {
  strokeWeight(1);
  stroke(0, 0, 0);
  coordinates.drawAxes();
  strokeWeight(5);
  stroke(50, 50, 200);
  coordinates.line(0, 0, xy1[0], xy1[1]);
  stroke(50, 200, 50);
  coordinates.line(xy1[0], xy1[1], xy2[0], xy2[1]);
}

function getCanvasSize() {
  const canvasWidth = simulatorDiv.clientWidth;
  const canvasTopPixel = simulatorDiv.getBoundingClientRect().top;
  const simulatorDivTop = canvasTopPixel + window.pageYOffset;
  const canvasHeight = (window.innerHeight - simulatorDivTop) - 10;
  return [canvasWidth, canvasHeight];
}
