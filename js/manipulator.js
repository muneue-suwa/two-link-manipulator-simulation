/**
 * Manipulator class
 */
class Manipulator { // eslint-disable-line no-unused-vars
  /**
   * Initialize manipulator
   *
   * @param {Number} te Simulation time
   * @param {Number} dt delta-time
   * @param {Number} th1 theta 1
   * @param {Number} th2 theta 2
   * @param {Number} dth1 d theta 1
   * @param {Number} dth2 d theta 2
   * @param {Number} m1 Mass of arm 1
   * @param {Number} m2 Mass of arm 2
   * @param {Number} l1 Length of arm 1
   * @param {Number} l2 Length of arm 2
   * @param {Number} D1 D1
   * @param {Number} D2 D2
   */
  constructor(
      te = 15, dt = 1 / 100,
      th1 = Math.PI / 2, th2 = Math.PI,
      dth1 = 0, dth2 = 0,
      m1 = 1, m2 = 1,
      l1 = 0.5, l2 = 0.3,
      D1 = 3, D2 = 3,
  ) {
    this.te = te;
    this.dt = dt;

    this.th1 = th1;
    this.th2 = th2;
    this.dth1 = dth1;
    this.dth2 = dth2;

    this.m1 = m1;
    this.m2 = m2;
    this.l1 = l1;
    this.l2 = l2;

    this.D1 = D1;
    this.D2 = D2;

    this.initX1 = 2 * l1 * math.sin(th1);
    this.initY1 = 2 * l1 * math.cos(th1);
    this.initX2 = 2 * l1 * math.sin(th1) + 2 * l2 * math.sin(th2);
    this.initY2 = 2 * l1 * math.cos(th1) + 2 * l2 * math.cos(th2);
  }

  /**
   * Detect that torque array has enough length
   *
   * @param {Array} torqueArray Torque array
   * @return {bool} Is enough torque array length
   */
  isEnoughTorqueArray(torqueArray) {
    const nt = this.te / this.dt + 1;
    return nt <= torqueArray.length;
  }

  /**
   * Calculate canvas pixel ratio from canvas size
   *
   * @param {Array} canvasSize
   * @return {Number} Pixel ratio
   */
  calcPixelRatio(canvasSize) {
    const maxArmLength = (this.l1 + this.l2) * 2;
    const minWidthOrHeight = Math.min(canvasSize[0], canvasSize[1]);
    const pixelRatio = minWidthOrHeight / (maxArmLength * 2) / 1.05;
    return pixelRatio;
  }

  /**
   * Calculate arm position per frame
   *
   * @param {Array} torqueArray Torque array
   * @param {Number} fps FPS of simulator
   * @return {Array} Arm position array per frame
   */
  calcPositionPerFrame(torqueArray, fps) {
    const [dtXy1, dtXy2] = this.calcPositionPerDt(torqueArray);
    const frameXy1 = new Array(this.te * fps);
    const frameXy2 = new Array(this.te * fps);
    for (let i = 0; i < frameXy1.length; i++) {
      frameXy1[i] = dtXy1[Math.floor(i / (fps * this.dt))];
      frameXy2[i] = dtXy2[Math.floor(i / (fps * this.dt))];
    }
    return [frameXy1, frameXy2];
  }

  /**
   * Calculate arm position from dt
   *
   * @param {Array} torqueArray Torque array
   * @return {Array} Arm position array per dt
   */
  calcPositionPerDt(torqueArray) {
    const dt = this.dt;
    const nt = this.te / dt + 1;

    let th1 = this.th1;
    let th2 = this.th2;
    let dth1 = this.dth1;
    let dth2 = this.dth2;

    const m1 = this.m1;
    const m2 = this.m2;
    const l1 = this.l1;
    const l2 = this.l2;

    const D1 = this.D1;
    const D2 = this.D2;

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
    const x1 = this.initX1;
    const y1 = this.initY1;
    xy1[0] = [x1, y1];

    const xy2 = new Array(nt);
    const x2 = this.initX2;
    const y2 = this.initY2;
    xy2[0] = [x2, y2];

    for (let k = 1; k < nt; k++) {
      const lth1 = dth1;
      const lth2 = dth2;
      const J = math.matrix([
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
}
