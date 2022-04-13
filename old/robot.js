/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
// const te = 15;
const dt = 1 / 100;
const fps = 1 / dt;
let count = 0;
// const nt = te / dt + 1;

let th1 = Math.PI / 6;
let th2 = Math.PI / 4;
let dth1 = 0;
let dth2 = 0;

const m1 = 1;
const m2 = 1;
const l1 = 0.5;
const l2 = 0.3;
const D1 = 0.01;
const D2 = 0.01;
const MD = math.matrix([[D1 + D2, -D2], [-D2, D2]]);

const g = 9.8;
const I1 = 1 / 3 * m1 * l1 ** 2;
const I2 = 1 / 3 * m2 * l2 ** 2;
const J1 = I1 + (m1 + 4 * m2) * l1 ** 2;
const J2 = I2 + m2 * l2 ** 2;
const beta = 2 * m2 * l1 * l2;
const x0 = math.matrix([[th1], [th2], [dth1], [dth2]]);

let x = x0;

const canvasX = 800;
const canvasY = 500;

function setup() {
  createCanvas(canvasX, canvasY); // サイズ: 800px × 500px
  frameRate(fps);
}

function draw() {
  background(200);
  const lth1 = dth1;
  const lth2 = dth2;
  const J = math.matrix([
    [J1, beta * math.cos(th2 - th1)],
    [beta * math.cos(th1 - th2), J2],
  ]);
  const vldth = math.multiply(
      math.multiply(-1, math.inv(J)),
      math.add(
          math.matrix([
            [beta * Math.sin(th1 - th2) * dth2 ** 2],
            [beta * Math.sin(th2 - th1) * dth1 ** 2],
          ]),
          math.multiply(MD, math.matrix([[dth1], [dth2]])),
          math.multiply(
              -1,
              math.matrix([
                [(m1 + 2 * m2) * g * l1 * Math.sin(th1)],
                [m2 * g * l2 * Math.sin(th2)],
              ]),
          ),
      ),
  );
  // console.log('vldth', vldth);

  const ldth1 = vldth.subset(math.index(0, 0));
  const ldth2 = vldth.subset(math.index(1, 0));
  // console.log('ldth1', ldth1);
  // console.log('ldth2', ldth2);

  x = math.add(
      x, math.multiply(math.matrix([[lth1], [lth2], [ldth1], [ldth2]]), dt),
  );
  // console.log('x', x);
  th1 = x.subset(math.index(0, 0));
  th2 = x.subset(math.index(1, 0));
  dth1 = x.subset(math.index(2, 0));
  dth2 = x.subset(math.index(3, 0));
  // console.log('th1', th1, 'th2', th2);

  let x1 = 2 * l1 * Math.sin(th1);
  let y1 = 2 * l1 * Math.cos(th1);

  let x2 = x1 + 2 * l2 * Math.sin(th2);
  let y2 = y1 + 2 * l2 * Math.cos(th2);

  x1 = 150 * x1;
  y1 = 150 * y1;
  x2 = 150 * x2;
  y2 = 150 * y2;

  strokeWeight(10); // 線幅を10pxに
  stroke(50, 50, 200);
  line(canvasX/2, canvasY/2, canvasX/2 + x1, canvasY/2 - y1);
  stroke(50, 200, 50);
  line(canvasX/2 + x1, canvasY/2 - y1, canvasX/2 + x2, canvasY/2 -y2);

  count += 1;
}