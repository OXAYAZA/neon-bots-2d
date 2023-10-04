import {BaseComponent} from "./index.js";
import Vector2 from "../Util/Vector2.js";
import Gizmos from "../Util/Gizmos.js";

class Collider extends BaseComponent {
  /**
   * Component name.
   * @type {string}
   */
  name = "Collider";

  /**
   * List of components present in the parent object that the current component requires.
   * @type {string[]}
   */
  requiredComponents = ["Transform"];

  /**
   * Initial collider polygon shape points.
   * @type {Vector2[]}
   */
  initialColliderPoints;

  /**
   * Collider polygon shape points after applying rotation and scale.
   * @type {Vector2[]}
   */
  localColliderPoints;

  /**
   * Collider polygon shape points in world coordinates.
   * @type {Vector2[]}
   */
  globalColliderPoints;

  /**
   * @param {Vector2[]|ShapePoint[]} colliderPoints - Collider polygon shape points.
   */
  constructor(colliderPoints = []) {
    super();

    this.initialColliderPoints = colliderPoints.map(point => {
      if(!(point instanceof Vector2)) return new Vector2(point);
      return point;
    });
  }

  /**
   * Event function that is called at fixed intervals. This method is used by core, don't use it directly.
   * @param {number} fixedDeltaTime
   */
  fixedUpdate(fixedDeltaTime) {
    if(!this.initialColliderPoints.length) return;

    let transform = this.object?.getComponent("Transform");
    if(!transform) return;

    let position = transform.position;
    let scale = transform.scale;
    let angle = transform.direction.angle();

    this.localColliderPoints = this.initialColliderPoints.map(point => {
      return point.clone().scaleByVector(scale).rotate(angle);
    });

    this.globalColliderPoints = this.localColliderPoints.map(point => {
      return point.clone().add(position);
    });
  }

  /**
   * Event function for drawing Gizmos. This method is used by canvas, don't use it directly.
   */
  onDrawGizmos() {
    Gizmos.setColor('rgba(0, 255, 0)');
    Gizmos.drawFigure(this.globalColliderPoints);
  }
}

export default Collider;
