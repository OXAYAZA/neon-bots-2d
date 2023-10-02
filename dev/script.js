import Engine from "./core/Engine.js";
import BaseObject from "./core/BaseObject.js";
import {Transform, Renderer, Camera} from "./core/Components/index.js";
import Unit from "./custom/Unit.js";
import Cursor from "./custom/Cursor.js";

// Onscreen debug
window.debug = function (data) {
  if(!window.data) window.data = {};
  window.data = {...window.data, ...data };
  document.getElementById("debug").innerHTML = JSON.stringify(data, null, 2);
}

window.addEventListener("DOMContentLoaded", () => {
  window.Engine = new Engine();

  let plane = new BaseObject("Plane");
  plane.addComponent(new Transform());
  plane.addComponent(new Renderer({
    fillColor: 'black',
    strokeColor: 'white',
    figurePoints: [
      {x: 300, y: 300},
      {x: -300, y: 300},
      {x: -300, y: -300},
      {x: 300, y: -300}
    ]
  }));

  let player = new BaseObject("Player");
  player.addComponent(new Transform());
  player.addComponent(new Camera(true));
  player.addComponent(new Renderer({
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
  player.addComponent(new Unit());

  let cursor = new BaseObject("Cursor");
  cursor.addComponent(new Transform());
  cursor.addComponent(new Renderer({
    fillColor: 'white',
    figurePoints: [
      { x: 2,  y: 2 },
      { x: -2,  y: 2 },
      { x: -2,  y: -2 },
      { x: 2,  y: -2 },
    ]
  }));
  cursor.addComponent(new Cursor());

  console.log(Engine.Instance);
});
