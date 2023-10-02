import BaseComponent from "./BaseComponent.js";
import Vector2 from "../Util/Vector2.js";

class Renderer extends BaseComponent {
  /**
   * Component name.
   * @type {string}
   */
  name = "Renderer";

  /**
   * List of components present in the parent object that the current component requires.
   * @type {string[]}
   */
  requiredComponents = ["Transform"];

  /**
   * Figure fill color.
   * @type {string}
   */
  fillColor;

  /**
   * Figure stroke color.
   * @type {string}
   */
  strokeColor;

  /**
   * Figure polygon shape points.
   * @type {Vector2[]}
   */
  figurePoints;

  /**
   * @typedef {Object} ShapePoint - Figure polygon shape point.
   * @prop {number} x
   * @prop {number} y
   */

  /**
   * @param {Object} [props] - Properties object.
   * @param {string} [props.fillColor] - Figure fill color.
   * @param {string} [props.strokeColor] - Figure stroke color.
   * @param {Vector2[]|ShapePoint[]} [props.figurePoints] - Figure polygon shape points.
   */
  constructor(props = {}) {
    super();

    props = {
      fillColor: 'transparent',
      strokeColor: 'transparent',
      figurePoints: [],
      ...props
    }

    this.fillColor = props.fillColor;
    this.strokeColor = props.strokeColor;
    this.figurePoints = props.figurePoints;
  }

  /**
   * Draw figure on canvas. This method is used by canvas, don't use it directly.
   * @param {CanvasRenderingContext2D} ctx - Canvas context.
   * @param {Vector2} offset - Offset from top left corner of canvas.
   * @param {Vector2} cameraPosition - Camera position on scene.
   */
  render(ctx, offset, cameraPosition) {
    let transform = this.object?.getComponent("Transform");
    if(!transform) return;

    let position = transform.position;
    let angle = transform.direction.angle();

    if(!this.figurePoints.length) return;

    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();

    this.figurePoints.forEach((point, index) => {
      let rotatedPoint = new Vector2({
        x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
        y: point.y * Math.cos(angle) + point.x * Math.sin(angle)
      });

      if(index) {
        ctx.lineTo(
          offset.x + position.x - cameraPosition.x + rotatedPoint.x,
          offset.y + position.y - cameraPosition.y + rotatedPoint.y
        );
      }
      else {
        ctx.moveTo(
          offset.x + position.x - cameraPosition.x + rotatedPoint.x,
          offset.y + position.y - cameraPosition.y + rotatedPoint.y
        );
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

export default Renderer;
