import Canvas from "./Canvas.js";
import Scene from "./Scene.js";
import Input from "./Modules/Input.js";
import BaseEvent from "./Modules/BaseEvent.js";

class Engine {
  /**
   * Engine singleton.
   * @type {Engine}
   */
  static Instance;

  /**
   * Canvas for rendering.
   * @type {Canvas}
   */
  canvas;

  /**
   * Active scene.
   * @type {Scene}
   */
  scene;

  /**
   * Input module.
   * @type {Input}
   */
  input;

  /**
   * Active camera for rendering.
   * @type {Camera}
   */
  activeCamera;

  /**
   * The time interval for a fixed update in seconds.
   * @type {number}
   */
  fixedUpdateInterval;

  /**
   * Fixed update timer id.
   * @type {number}
   * @private
   */
  timerId;

  /**
   * Previous fixed update time in seconds.
   * @type {number}
   */
  lastTime = 0;

  /**
   * Delta time for fixed update in seconds.
   * @type {number}
   */
  fixedDeltaTime = 0;

  /**
   * Fixed update event for subscribing, triggered immediately after everything in the scene is updated.
   * @type {BaseEvent}
   */
  onFixedUpdate = new BaseEvent();

  /**
   * @param {Object} [props] - Properties object.
   * @param {number} [props.fixedUpdateInterval] - The time interval for a fixed update in seconds.
   */
  constructor(props = {}) {
    if(Engine.Instance) throw new Error("Should be only one instance of Engine");

    props = {
      fixedUpdateInterval: 0.02,
      ...props
    };

    this.fixedUpdateInterval = props.fixedUpdateInterval;

    Engine.Instance = this;
    this.canvas = new Canvas(document.querySelector('#root'))
    this.scene = new Scene();
    this.input = new Input();

    this.startFixedUpdate();
  }

  /**
   * @private
   */
  fixedUpdate() {
    let currentTime = Number(performance.now()) / 1000;
    this.fixedDeltaTime = currentTime - this.lastTime;

    this.input.fixedUpdate();

    for(const [_, object] of Object.entries(this.scene.objects)) {
      if(object) {
        for(const [_, component] of Object.entries(object.components)) {
          if(component) component.fixedUpdate(this.fixedDeltaTime);
        }
      }
    }

    this.scene.cleanObjects();

    this.onFixedUpdate.trigger(this);

    this.lastTime = currentTime;
  }

  /**
   * @private
   */
  startFixedUpdate() {
    this.fixedUpdate();
    this.timerId = setInterval(this.fixedUpdate.bind(this), this.fixedUpdateInterval * 1000);
  }

  /**
   * @private
   */
  stopFixedUpdate() {
    clearInterval(this.timerId);
  }
}

export default Engine;
