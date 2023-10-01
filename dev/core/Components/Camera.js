import BaseComponent from "./BaseComponent.js";
import Engine from "../Engine.js";

class Camera extends BaseComponent {
  /**
   * Component name.
   * @type {string}
   */
  name = "Camera";

  /**
   * List of components present in the parent object that the current component requires.
   * @type {string[]}
   */
  requiredComponents = ["Transform"];

  /**
   * @param {boolean} setActive - Set camera as active.
   */
  constructor(setActive = false) {
    super();
    if(setActive) this.setActive();
  }

  /**
   * Set the camera as a currently active camera for rendering on the canvas.
   */
  setActive() {
    Engine.Instance.activeCamera = this;
  }
}

export default Camera;
