/**
 * Convert manipulator coordinates to pixel coordinates
 */
class CoordinatesConverter { // eslint-disable-line no-unused-vars
  /**
   * Initialize class
   *
   * @param {Number} originX
   * @param {Number} originY
   * @param {Number} pixelRatio
   */
  constructor(originX, originY, pixelRatio) {
    this.originX = originX;
    this.originY = originY;
    this.pixelRatio = pixelRatio;
  }

  /**
   * Draw manipulator arm lines
   *
   * @param {Number} x1 Manipulator positions x1
   * @param {Number} y1 Manipulator positions y1
   * @param {Number} x2 Manipulator positions x2
   * @param {Number} y2 Manipulator positions y2
   */
  line(x1, y1, x2, y2) {
    line(
        this.originX + x1 * this.pixelRatio,
        this.originY - y1 * this.pixelRatio,
        this.originX + x2 * this.pixelRatio,
        this.originY - y2 * this.pixelRatio,
    );
  }

  /**
   * Draw target position circle
   *
   * @param {Number} x Target positions x
   * @param {Number} y Target positions y
   * @param {Number} diameter Target allowable error
   */
  circle(x, y, diameter) {
    circle(
        this.originX + x * this.pixelRatio,
        this.originY - y * this.pixelRatio,
        diameter * this.pixelRatio,
    );
  }

  /**
   * Draw xy-axes
   */
  drawAxes() {
    line(0, this.originY, this.originX * 2, this.originY);
    line(this.originX, 0, this.originX, this.originY * 2);
  }
}
