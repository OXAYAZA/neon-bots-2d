import Engine from "../Engine.js";
import Vector2 from "./Vector2.js";

class Gizmos {
  /**
   * Gizmos singleton.
   * @type {Gizmos}
   */
  static Instance;

  /**
   * Gizmos draw color.
   * @type {string}
   */
  strokeStyle = 'white';

  /**
   * Get a Gizmos instance (or create and get if it does not exist).
   * @private
   * @return {Gizmos}
   */
  static getInstance() {
    if(!Gizmos.Instance) Gizmos.Instance = new Gizmos();
    return Gizmos.Instance;
  }

  /**
   * @typedef {Object} DrawData
   * @prop {CanvasRenderingContext2D} ctx
   * @prop {Vector2} offset
   * @prop {Vector2} cameraPosition
   */

  /**
   * Get necessary data for drawing gizmos.
   * @return {DrawData|void} - Draw data object or nothing.
   */
  static getDrawData() {
    let canvas = Engine.Instance?.canvas;
    if(!canvas) return;

    let cameraPosition = Engine.Instance?.activeCamera?.object?.getComponent("Transform")?.position;
    if(!cameraPosition) return;

    let ctx = canvas.ctx;
    let offset = new Vector2({x: canvas.rect.width / 2, y: canvas.rect.height / 2});

    return {ctx, offset, cameraPosition};
  }

  /**
   * Set gizmos color for drawing.
   * @param {string} color
   */
  static setColor(color) {
    Gizmos.getInstance().strokeStyle = color;
  }

  /**
   * Draw line on canvas.
   * @param {Vector2} start
   * @param {Vector2} end
   */
  static drawLine(start, end) {
    if(!start || !end) return;

    let {ctx, offset, cameraPosition} = Gizmos.getDrawData();

    let transformedStart = start.clone().add(offset).subtract(cameraPosition);
    let transformedEnd = end.clone().add(offset).subtract(cameraPosition);

    ctx.strokeStyle = Gizmos.getInstance().strokeStyle;
    ctx.beginPath();
    ctx.moveTo(transformedStart.x, transformedStart.y);
    ctx.lineTo(transformedEnd.x, transformedEnd.y);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * Draw figure on canvas.
   * @param {Vector2[]} figurePoints
   */
  static drawFigure(figurePoints) {
    if(!figurePoints || !figurePoints.length) return;

    let drawData = Gizmos.getDrawData();
    if(!drawData) return;

    let {ctx, offset, cameraPosition} = Gizmos.getDrawData();

    ctx.strokeStyle = Gizmos.getInstance().strokeStyle;
    ctx.beginPath();

    figurePoints.forEach((point, index) => {
      let transformedPoint = point.clone().add(offset).subtract(cameraPosition);

      if(index) ctx.lineTo(transformedPoint.x, transformedPoint.y);
      else ctx.moveTo(transformedPoint.x, transformedPoint.y);
    });

    ctx.closePath();
    ctx.stroke();
  }
}

export default Gizmos;
