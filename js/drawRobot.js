/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
const timeDiv = document.getElementById('time');

const te = 15;
const dt = 1 / 100;
const nt = te / dt + 1;

const canvasX = 800;
const canvasY = 500;
const fps = 60;
let count = 0;

// 描画するxy1[j]のjを計算する
const xyFrame = new Array(te * fps);
for (let i = 0; i < xyFrame.length; i++) {
  xyFrame[i] = Math.trunc(i / (fps * dt));
}

// let xy1;
// let xy2;
// let doDraw = false;
const pixelRatio = 300;
const allowableError = 0.03;
const targetXY = [1.2, -0.8];

function setup() {
  createCanvas(canvasX, canvasY); // サイズ: 800px × 500px
  frameRate(fps);
  // console.log(xy1);
  console.log('start: ', new Date());
  noLoop();
}

function draw() {
  background(256);

  strokeWeight(1);
  stroke(200, 50, 50);
  circle(
      canvasX / 2 + targetXY[0] * pixelRatio,
      canvasY / 2 - targetXY[1] * pixelRatio,
      allowableError * pixelRatio * 2,
  );

  if (doDraw != true) {
    return 0;
  }

  const x1 = pixelRatio * xy1[xyFrame[count]][0];
  const y1 = pixelRatio * xy1[xyFrame[count]][1];
  const x2 = pixelRatio * xy2[xyFrame[count]][0];
  const y2 = pixelRatio * xy2[xyFrame[count]][1];

  strokeWeight(5); // 線幅を10pxに
  stroke(50, 50, 200);
  line(canvasX / 2, canvasY / 2, canvasX / 2 + x1, canvasY / 2 - y1);
  stroke(50, 200, 50);
  line(canvasX / 2 + x1, canvasY / 2 - y1, canvasX / 2 + x2, canvasY / 2 - y2);
  count += 1;
  const currentTime = (Date.now() - startTime) / 1000;
  timeDiv.textContent = currentTime;

  if (count === xyFrame.length) {
    noLoop();
    console.log('end: ', new Date());
    timeDiv.textContent += ' Completed!';
  }
}
