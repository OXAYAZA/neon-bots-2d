import BaseComponent from "./BaseComponent.js";
import Vector2 from "../Util/Vector2.js";

class Transform extends BaseComponent {
  /**
   * Component name.
   * @type {string}
   */
  name = "Transform";

  /**
   * Object position on scene.
   * @type {Vector2}
   */
  position;

  /**
   * Object direction.
   * @type {Vector2}
   */
  direction;

  /**
   * Object scale.
   * @type {Vector2}
   * TODO
   */
  scale;

  /**
   * @param {Vector2} [position] - Initial position.
   * @param {Vector2} [direction] - Initial direction.
   */
  constructor(position = Vector2.zero(), direction = Vector2.zero()) {
    super();
    this.position = position;
    this.direction = direction;
  }
}

export default Transform;
