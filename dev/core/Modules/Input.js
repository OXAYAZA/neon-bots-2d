import Engine from "../Engine.js";
import Vector2 from "../Util/Vector2.js";

class Input {
  /**
   * Keys state list.
   * @readonly
   * @type {Object.<string, boolean>}
   */
  keys = {};

  /**
   * Mouse state object.
   * @typedef {Object} MouseState
   * @prop {Vector2} canvasPos - Cursor position on canvas.
   * @prop {Vector2} scenePos - Cursor position relative to the beginning of the scene.
   * @prop {boolean} 0 - Left mouse button press state.
   * @prop {boolean} 1 - Middle mouse button press state.
   * @prop {boolean} 2 - Right mouse button press state.
   */

  /**
   * @readonly
   * @type {MouseState}
   */
  mouse = {
    canvasPos: Vector2.zero(),
    scenePos: Vector2.zero(),
    0: false,
    1: false,
    2: false
  };

  constructor() {
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    document.addEventListener('keyup', this.keyupHandler.bind(this));
    document.addEventListener( 'mousemove', this.mouseMoveHandler.bind(this));
    document.addEventListener( 'mousedown', this.mouseDownHandler.bind(this));
    document.addEventListener( 'mouseup', this.mouseUpHandler.bind(this));

    // Disable the appearance of the context menu when pressing LMB on canvas.
    // TODO: need separate handler here?
    Engine.Instance.canvas.node.addEventListener('contextmenu', event => {
      event.preventDefault();
      return false;
    });
  }

  /**
   * Keyboard key press handler.
   * @private
   * @param {KeyboardEvent} event
   */
  keydownHandler(event) {
    this.keys[event.code] = true;
  }

  /**
   * Keyboard key release handler.
   * @private
   * @param {KeyboardEvent} event
   */
  keyupHandler(event) {
    this.keys[event.code] = false;
  }

  /**
   * Mouse move handler.
   * @private
   * @param {MouseEvent} event
   */
  mouseMoveHandler(event) {
    this.mouse.canvasPos.x = event.clientX;
    this.mouse.canvasPos.y = event.clientY;
  }

  /**
   * Mouse button press handler.
   * @private
   * @param {MouseEvent} event
   */
  mouseDownHandler(event) {
    event.preventDefault();
    this.mouse[event.button] = true;
  }

  /**
   * Mouse button release handler.
   * @private
   * @param {MouseEvent} event
   */
  mouseUpHandler(event) {
    event.preventDefault();
    this.mouse[event.button] = false;
  }

  /**
   *
   */
  fixedUpdate() {
    let canvasRect = Engine.Instance?.canvas?.rect;
    if(!canvasRect) return;

    let cameraPosition = Engine.Instance?.activeCamera?.object?.getComponent("Transform")?.position;
    if(!cameraPosition) return;

    // TODO: These values are delayed by one frame.
    this.mouse.scenePos.x = cameraPosition.x - canvasRect.width / 2 + this.mouse.canvasPos.x;
    this.mouse.scenePos.y = cameraPosition.y - canvasRect.height / 2 + this.mouse.canvasPos.y;
  }
}

export default Input;
