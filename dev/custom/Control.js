import BaseComponent from "../core/Components/BaseComponent.js";
import Vector2 from "../core/Util/Vector2.js";
import Engine from "../core/Engine.js";

class Control extends BaseComponent {
  name = "Control";
  requiredComponents = ["Transform"];

  fixedUpdate(fixedDeltaTime) {
    super.fixedUpdate(fixedDeltaTime);

    let transform = this.object.getComponent("Transform");
    if(!transform) return;

    let input = Engine.Instance?.input;
    if(!input) return;

    let position = transform.position;
    let speed = 300 * fixedDeltaTime;
    let velocity = Vector2.zero();

    if(input.keys['KeyW']) velocity.add(Vector2.up());
    if(input.keys['KeyS']) velocity.add(Vector2.down());
    if(input.keys['KeyA']) velocity.add(Vector2.left());
    if(input.keys['KeyD']) velocity.add(Vector2.right());

    position.add(velocity.normalize().scale(speed));

    transform.direction = input.mouse.scenePos.subtract(transform.position).normalize();
  }
}

export default Control;
