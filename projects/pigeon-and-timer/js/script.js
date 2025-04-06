/* Main script by AlekPet */
import { DigitalNumber } from "./digit.js";
import { Pigeon } from "./pigeon.js";

const num1 = new DigitalNumber("1000010", {
  parent: document.querySelector(".box"),
  lenNumber: 10,
  setClock: !true,
});

const other = !true
  ? {}
  : {
      imgSrc: "./images/Golub4.png",
      countAnim: 4,
      rndScale: 1,
      parent: document.querySelector(".wrapper"),
    };
const pigeon = new Pigeon(other);
// const pigeon1 = new Pigeon({
//   start: "right",
//   minMax: { min: 0, max: 180 }, speed: 15
// });

/* num1.runBackward();
 num1.runBackward();
 num1.runBackward();
 num1.runBackward();
 num1.runBackward();*/

const t1 = { x: 80.0, y: 0.0 };
function animation() {
  num1.runBackward();
  //num1.runForward();
  //pigeon.animate();
  pigeon.update(t1);
  //pigeon1.animate();
}

let anim = null;
let last = 0;
function global_animation(sec, delta) {
  const timeInSecond = delta / 1000;

  if (timeInSecond - last >= sec) {
    last = timeInSecond;
    animation();
  }
  anim = requestAnimationFrame(global_animation.bind(null, sec));
}

anim = requestAnimationFrame(global_animation.bind(null, 1));

// setInterval(() => {
//   num1.run();
//   pigeon.animate();
//   pigeon1.animate();
// }, 100);
