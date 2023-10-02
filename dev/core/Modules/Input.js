import Engine from "../Engine.js";

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
   * @prop {number} canvasX - Horizontal cursor position on canvas.
   * @prop {number} canvasY - Vertical cursor position on canvas.
   * @prop {boolean} 0 - Left mouse button press state.
   * @prop {boolean} 1 - Middle mouse button press state.
   * @prop {boolean} 2 - Right mouse button press state.
   */

  /**
   * @readonly
   * @type {MouseState}
   */
  mouse = {
    canvasX: 0,
    canvasY: 0,
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
    this.mouse.canvasX = event.clientX;
    this.mouse.canvasY = event.clientY;
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
}

export default Input;
