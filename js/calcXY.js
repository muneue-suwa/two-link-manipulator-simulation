/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
function calcXY(torqueArray) {
  console.log('torqueArray', torqueArray);
  const te = 15;
  const dt = 1 / 100;
  const nt = te / dt + 1;

  let th1 = Math.PI / 2;
  let th2 = Math.PI;
  let dth1 = 0;
  let dth2 = 0;
  const m1 = 1;
  const m2 = 1;
  const l1 = 0.5;
  const l2 = 0.3;

  const D1 = 3;
  const D2 = 3;

  const MD = math.matrix([[D1 + D2, -D2], [-D2, D2]]);

  const g = 9.8;
  const I1 = 1 / 3 * m1 * l1 ** 2;
  const I2 = 1 / 3 * m2 * l2 ** 2;
  const J1 = I1 + (m1 + 4 * m2) * l1 ** 2;
  const J2 = I2 + m2 * l2 ** 2;

  const beta = 2 * m2 * l1 * l2;

  const x0 = math.matrix([[th1], [th2], [dth1], [dth2]]);
  let x = x0;

  const xy1 = new Array(nt);
  const x1 = 2 * l1 * math.sin(th1);
  const y1 = 2 * l1 * math.cos(th1);
  xy1[0] = [x1, y1];

  const xy2 = new Array(nt);
  const x2 = 2 * l1 * math.sin(th1) + 2 * l2 * math.sin(th2);
  const y2 = 2 * l1 * math.cos(th1) + 2 * l2 * math.cos(th2);
  xy2[0] = [x2, y2];

  for (let k = 1; k < nt; k++) {
    const lth1 = dth1;
    const lth2 = dth2;
    J = math.matrix([
      [J1, beta * math.cos(th2 - th1)], [beta * math.cos(th1 - th2), J2],
    ]);
    const vldth = math.multiply(
        math.inv(J),
        math.add(
            math.matrix([[torqueArray[k-1][0]], [torqueArray[k-1][1]]]),
            math.multiply(
                -1,
                math.matrix([
                  [beta * math.sin(th1 - th2) * dth2 ** 2],
                  [beta * math.sin(th2 - th1) * dth1 ** 2],
                ]),
            ),
            math.multiply(
                -1,
                math.multiply(
                    MD, math.matrix([[dth1], [dth2]]),
                ),
            ),
            math.matrix([
              [(m1 + 2 * m2) * g * l1 * math.sin(th1)],
              [m2 * g * l2 * math.sin(th2)],
            ]),
        ),
    );

    const ldth1 = vldth.subset(math.index(0, 0));
    const ldth2 = vldth.subset(math.index(1, 0));
    const nx = math.add(
        x, math.multiply(
            math.matrix([[lth1], [lth2], [ldth1], [ldth2]]), dt,
        ),
    );

    th1 = nx.subset(math.index(0, 0));
    th2 = nx.subset(math.index(1, 0));
    dth1 = nx.subset(math.index(2, 0));
    dth2 = nx.subset(math.index(3, 0));

    const x1 = 2 * l1 * math.sin(th1);
    const y1 = 2 * l1 * math.cos(th1);
    xy1[k] = [x1, y1];

    const x2 = 2 * l1 * math.sin(th1) + 2 * l2 * math.sin(th2);
    const y2 = 2 * l1 * math.cos(th1) + 2 * l2 * math.cos(th2);
    xy2[k] = [x2, y2];

    x = nx;
  }
  return [xy1, xy2];
}
