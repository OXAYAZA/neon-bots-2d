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
   */
  scale;

  /**
   * @param {Object} [props] - Properties object.
   * @param {Vector2} [props.position] - Initial position.
   * @param {Vector2} [props.direction] - Initial direction.
   * @param {Vector2} [props.scale] - Initial scale.
   */
  constructor(props) {
    super();

    props = {
      position: Vector2.zero(),
      direction: Vector2.right(),
      scale: Vector2.one(),
      ...props
    }

    this.position = props.position;
    this.direction = props.direction;
    this.scale = props.scale;
  }
}

export default Transform;
