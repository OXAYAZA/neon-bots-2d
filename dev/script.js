import Engine from "./core/Engine.js";
import BaseObject from "./core/BaseObject.js";
import {Transform, Renderer, Camera, Collider} from "./core/Components/index.js";
import Vector2 from "./core/Util/Vector2.js";
import Control from "./custom/Control.js";
import Gun from "./custom/Gun.js";

// Onscreen debug
window.debug = function (data = {}) {
  if(!window.data) window.data = {};
  window.data = {...window.data, ...data };
  document.getElementById("debug").innerHTML = JSON.stringify(window.data, null, 2);
}

window.addEventListener("DOMContentLoaded", () => {
  let engine = window.Engine = new Engine();

  let plane = new BaseObject("Plane");
  plane.addComponent(new Transform());
  plane.addComponent(new Renderer({
    strokeColor: 'white',
    figurePoints: [
      {x: 300, y: 300},
      {x: -300, y: 300},
      {x: -300, y: -300},
      {x: 300, y: -300}
    ]
  }));

  let player = new BaseObject("Player");
  player.addComponent(new Transform({
    scale: new Vector2({x: 4, y: 4})
  }));
  player.addComponent(new Camera(true));
  player.addComponent(new Renderer({
    strokeColor: 'black',
    fillColor: 'rgb(0, 255, 100)',
    figurePoints: [
      { x: 0,  y: 0 },
      { x: -5,  y: -5 },
      { x: -2,  y: -5 },
      { x: 10, y: 0 },
      { x: -2,  y: 5 },
      { x: -5,  y: 5 }
    ]
  }));
  player.addComponent(new Collider([
    {x: 10, y: 5},
    {x: -5, y: 5},
    {x: -5, y: -5},
    {x: 10, y: -5}
  ]));
  player.addComponent(new Control());
  player.addComponent(new Gun());

  engine.onFixedUpdate.addListener(() => {
    window.debug();
  });
});
