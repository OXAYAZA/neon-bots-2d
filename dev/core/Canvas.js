import Engine from "./Engine.js";
import Vector2 from "./Util/Vector2.js";

class Canvas {
  /**
   * The HTML element to which the canvas is attached.
   * @type {HTMLCanvasElement}
   */
  node;

  /**
   * Canvas rendering context.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Canvas rect.
   * @type {DOMRect}
   */
  rect;

  /**
   * @param {HTMLCanvasElement} node - canvas element.
   */
  constructor(node) {
    this.node = node;
    this.ctx = this.node.getContext("2d");

    window.addEventListener("resize", this.resize.bind(this));

    this.resize();
    this.render();
  }

  /**
   * Update canvas dimensions.
   */
  resize() {
    this.rect = this.node.getBoundingClientRect();
    this.node.width = this.rect.width;
    this.node.height = this.rect.height;
  }

  /**
   * Render canvas frame.
   */
  render() {
    requestAnimationFrame(this.render.bind(this));
    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);

    let cameraPosition = Engine.Instance?.activeCamera?.object?.getComponent("Transform")?.position;
    if(!cameraPosition) return;

    let objects = Engine.Instance?.scene?.objects;
    if(!objects) return;

    let offset = new Vector2({
      x: this.rect.width / 2,
      y: this.rect.height / 2
    });

    for(const [_, obj] of Object.entries(objects)) {
      obj.getComponent("Renderer")?.render(this.ctx, offset, cameraPosition);
    }
  }
}

export default Canvas;
