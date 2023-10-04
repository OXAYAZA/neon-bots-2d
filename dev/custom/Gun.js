import Engine from "../core/Engine.js";
import BaseObject from "../core/BaseObject.js";
import {BaseComponent, Transform, Renderer, Collider} from "../core/Components/index.js";
import Projectile from "./Projectile.js";

class Gun extends BaseComponent {
  coolingDuration = 0.05;
  coolingTime = 0;
  canShoot = true;

  fixedUpdate(fixedDeltaTime) {
    let input = Engine.Instance.input;
    if(!input) return;

    this.coolDown(fixedDeltaTime);
    if(input.mouse[0] && this.canShoot) this.shot();
  }

  shot() {
    this.canShoot = false;
    this.coolingTime = this.coolingDuration;

    let transform = this.object?.getComponent("Transform");
    if(!transform) return;

    let projectile = new BaseObject("Projectile");
    projectile.addComponent(new Transform({
      position: transform.position.clone(),
      direction: transform.direction.clone()
    }));
    projectile.addComponent(new Renderer({
      strokeColor: 'black',
      fillColor: 'red',
      figurePoints: [
        {x: 2, y: 2},
        {x: -2, y: 2},
        {x: -2, y: -2},
        {x: 2, y: -2}
      ]
    }));
    projectile.addComponent(new Collider([
        {x: 2, y: 2},
        {x: -2, y: 2},
        {x: -2, y: -2},
        {x: 2, y: -2}
      ]
    ));
    projectile.addComponent(new Projectile());
  }

  coolDown(fixedDeltaTime) {
    if(this.canShoot === false && this.coolingTime > 0) {
      this.coolingTime -= fixedDeltaTime;
    } else if(this.canShoot === false) {
      this.canShoot = true;
    }
  }
}

export default Gun;