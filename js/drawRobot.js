/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
const simulateTimeDiv = document.getElementById('simulateTime');
const startSimulatorBtn = document.getElementById('startSimulator');
const resetSimulatorBtn = document.getElementById('resetSimulator');
const saveSimulatorBtn = document.getElementById('saveSimulator');
const simulatorDiv = document.getElementById('simulator');

const te = 15;
const dt = 1 / 100;
const nt = te / dt + 1;

const canvasSize = getCanvasSize();
const fps = 60;
let count = 0;

// 描画するxy1[j]のjを計算する
const xyFrame = new Array(te * fps);
for (let i = 0; i < xyFrame.length; i++) {
  xyFrame[i] = Math.trunc(i / (fps * dt));
}

const pixelRatio = 200;
const allowableError = 0.03;
const targetXY = [1.2, -0.8];

let doDraw = false;
let startTime;
let xy1;
let xy2;

startSimulatorBtn.disabled = true;
startSimulatorBtn.addEventListener('click', () => {
  xy1xy2 = calcXY(torqueArray);
  xy1 = xy1xy2[0];
  xy2 = xy1xy2[1];
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
  // console.log(xy1);
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
  const x1 = pixelRatio * xy1[xyFrame[count]][0];
  const y1 = pixelRatio * xy1[xyFrame[count]][1];
  const x2 = pixelRatio * xy2[xyFrame[count]][0];
  const y2 = pixelRatio * xy2[xyFrame[count]][1];

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

  if (count === xyFrame.length) {
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
