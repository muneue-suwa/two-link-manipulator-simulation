/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
class CoordinatesConverter {
  constructor(originX, originY, pixelRatio) {
    this.originX = originX;
    this.originY = originY;
    this.pixelRatio = pixelRatio;
  }

  line(x1, y1, x2, y2) {
    line(
        this.originX + x1 * this.pixelRatio,
        this.originY - y1 * this.pixelRatio,
        this.originX + x2 * this.pixelRatio,
        this.originY - y2 * this.pixelRatio,
    );
  }

  circle(x, y, diameter) {
    circle(
        this.originX + x * this.pixelRatio,
        this.originY - y * this.pixelRatio,
        diameter * this.pixelRatio,
    );
  }

  drawAxes() {
    line(0, this.originY, this.originX * 2, this.originY);
    line(this.originX, 0, this.originX, this.originY * 2);
  }
}
