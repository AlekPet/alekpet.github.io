/* Main script by AlekPet */
import { DigitalNumber } from "./digit.js";
import { Pigeon } from "./pigeon.js";

function getClockData() {
  const addZero = (data) => (data < 10 ? "0" + data : data);
  const nowDate = new Date();
  const hours = addZero(nowDate.getHours());
  const mins = addZero(nowDate.getMinutes());
  const secs = addZero(nowDate.getSeconds());

  return {
    numbers: `${hours}${mins}${secs}`,
    lenNumber: [3, 10, 6, 10, 6, 10],
  };
}

function main(type = null) {
  const box = document.querySelector(".box");
  let data = { numbers: "00001", lenNumber: 10 };

  let num1 = new DigitalNumber(data.numbers, {
    parent: box,
    lenNumber: data.lenNumber,
    direction: "backward",
  });

  let prevType = "timer_backward";
  const typeClockTimer = document
    .querySelectorAll("[name=timer_clock]")
    .forEach((elem) => {
      elem.addEventListener("change", function (event) {
        if (prevType === event.target.value) return;

        box.innerHTML = "";

        switch (event.target.value) {
          case "current_time":
            data = getClockData();
            num1 = new DigitalNumber(data.numbers, {
              parent: box,
              lenNumber: data.lenNumber,
              direction: "forward",
              resetFunc: (context, n) => {
                // User reset function, this is reset hours 23 to 00.
                if (context.digitCls[1] === n) {
                  if (
                    context.digitCls[0].currentDig === 2 &&
                    context.digitCls[1].currentDig === 3
                  ) {
                    return true;
                  }
                }
                return false;
              },
            });
            break;
          case "timer_forward":
            data = { numbers: "9991", lenNumber: 10 };
            num1 = new DigitalNumber(data.numbers, {
              parent: box,
              lenNumber: data.lenNumber,
              direction: "forward",
            });
            break;
          case "timer_backward":
          default:
            data = { numbers: "00001", lenNumber: 10 };
            num1 = new DigitalNumber(data.numbers, {
              parent: box,
              lenNumber: data.lenNumber,
              direction: "backward",
            });
        }
        prevType = event.target.value;
      });
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

  // const t1 = { x: 80.0, y: 0.0 };
  function animation() {
    // num1.runBackward();
    // num1.runForward();

    num1.params.direction === "backward"
      ? num1.runBackward()
      : num1.runForward();

    pigeon.animate();
    // pigeon.update(t1);
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
}

document.addEventListener("DOMContentLoaded", main);
