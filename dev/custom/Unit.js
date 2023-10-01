import BaseComponent from "../core/Components/BaseComponent.js";
import Vector2 from "../core/Util/Vector2.js";

class Unit extends BaseComponent {
  requiredComponents = ["Transform"];

  fixedUpdate(fixedDeltaTime) {
    super.fixedUpdate(fixedDeltaTime);

    let position = this.object.getComponent("Transform")?.position;
    if(!position) return;

    let speed = 300 * fixedDeltaTime;

    if(window.keys['KeyW']) position.add(new Vector2({x: 0, y: -speed}));
    if(window.keys['KeyS']) position.add(new Vector2({x: 0, y: speed}));
    if(window.keys['KeyA']) position.add(new Vector2({x: -speed, y: 0}));
    if(window.keys['KeyD']) position.add(new Vector2({x: speed, y: 0}));
  }
}

export default Unit;
