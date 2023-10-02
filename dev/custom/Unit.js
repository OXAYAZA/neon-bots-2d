import BaseComponent from "../core/Components/BaseComponent.js";
import Vector2 from "../core/Util/Vector2.js";
import Engine from "../core/Engine.js";

class Unit extends BaseComponent {
  requiredComponents = ["Transform"];

  fixedUpdate(fixedDeltaTime) {
    super.fixedUpdate(fixedDeltaTime);

    let position = this.object.getComponent("Transform")?.position;
    if(!position) return;

    let speed = 300 * fixedDeltaTime;
    let input = Engine.Instance.input;

    if(input.keys['KeyW']) position.add(new Vector2({x: 0, y: -speed}));
    if(input.keys['KeyS']) position.add(new Vector2({x: 0, y: speed}));
    if(input.keys['KeyA']) position.add(new Vector2({x: -speed, y: 0}));
    if(input.keys['KeyD']) position.add(new Vector2({x: speed, y: 0}));
  }
}

export default Unit;
