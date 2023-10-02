import BaseComponent from "../core/Components/BaseComponent.js";
import Vector2 from "../core/Util/Vector2.js";
import Engine from "../core/Engine.js";

class Cursor extends BaseComponent {
  requiredComponents = ["Transform", "Renderer"];
  initialColor = 'white';
  lmbColor = 'green';
  mmbColor = 'red';
  rmbColor = 'blue';

  fixedUpdate(fixedDeltaTime) {
    super.fixedUpdate(fixedDeltaTime);

    let transform = this.object.getComponent("Transform");
    if(!transform) return;

    let mouse = Engine.Instance?.input?.mouse;
    if(!mouse) return;

    let canvasRect = Engine.Instance?.canvas?.rect;
    if(!canvasRect) return;

    let cameraPosition = Engine.Instance?.activeCamera?.object?.getComponent("Transform")?.position;
    if(!cameraPosition) return;

    transform.position = new Vector2({
      x: cameraPosition.x - canvasRect.width / 2 + mouse.canvasX,
      y: cameraPosition.y - canvasRect.height / 2 + mouse.canvasY
    });

    let renderer = this.object?.getComponent("Renderer");
    if(!renderer) return;

    if(mouse[0]) {
      renderer.fillColor = this.lmbColor;
    } else if (mouse[1]) {
      renderer.fillColor = this.mmbColor;
    } else if (mouse[2]) {
      renderer.fillColor = this.rmbColor;
    } else {
      renderer.fillColor = this.initialColor;
    }
  }
}

export default Cursor;
