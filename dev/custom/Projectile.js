import {BaseComponent} from "../core/Components/index.js";

class Projectile extends BaseComponent {
  liveTime = 2;

  fixedUpdate(fixedDeltaTime) {
    this.live(fixedDeltaTime);

    let transform = this.object?.getComponent("Transform");
    if(!transform) return;

    let speed = 300 * fixedDeltaTime;
    let increment = transform.direction.clone().scale(speed);
    transform.position.add(increment);
  }

  live(fixedDeltaTime) {
    if(this.liveTime > 0) {
      this.liveTime -= fixedDeltaTime;
    } else {
      this.object.destroy();
    }
  }
}

export default Projectile;
