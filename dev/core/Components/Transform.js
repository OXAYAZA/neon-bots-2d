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
   * TODO
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
   */
  constructor(position = Vector2.zero()) {
    super();
    this.position = position;
  }
}

export default Transform;
