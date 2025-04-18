/* 
Title: Digit, DigitalNumber classes
Author: AlekPet (http://github.com/alekpet)
*/

// helper functions
function generatePolygon(sides, size, startAngleDeg) {
  const points = [];
  const center = size / 2;
  const radius = size / 2;

  const startAngleRad = (startAngleDeg * Math.PI) / 180;

  for (let i = 0; i < sides; i++) {
    const angle = startAngleRad + (i * 2 * Math.PI) / sides;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    points.push([x, y]);
  }

  const polygonCss = points
    .map((point) => {
      const xPercent = ((point[0] / size) * 100).toFixed(2);
      const yPercent = ((point[1] / size) * 100).toFixed(2);
      return `${xPercent}% ${yPercent}%`;
    })
    .join(", ");

  return `polygon(${polygonCss})`;
}

// Digit class one instance
class Digit {
  static count = 0;
  constructor(params = {}) {
    const {
      parent = document.body,
      setClock = false,
      currentDig = 0,
      nextEl = null,
      prevEl = null,
      lenNumber = 10,
      blockW = 30,
      blockH = 30,
    } = params;

    this.blockW = blockW;
    this.blockH = blockH;

    this.blocks = [];
    this.showSetClock = setClock;

    this.lenNumber = lenNumber;
    this.stepAngle = 360 / this.lenNumber;
    this.marginOutside = this.blockH / (2 * Math.tan(Math.PI / lenNumber));

    this.currentDig = currentDig;
    this.prevDig = currentDig;

    this.offsetKrishkaAngle = lenNumber % 2 === 0 ? 90 / (lenNumber / 2) : 0;
    this.currentAngle = this.stepAngle * currentDig - this.offsetKrishkaAngle;

    this.parent = parent ?? document.body;

    this.nextEl = nextEl;
    this.prevEl = prevEl;

    Digit.count += 1;
    this.count = Digit.count;
    this.name = `Digit: ${this.count}`;

    parent.append(this.createElement());
  }

  static getBrightColor() {
    let r, g, b;
    do {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
    } while (r + g + b < 256);

    return `rgba(${r},${g},${b},1.0)`;
  }

  createElement() {
    const bg = Digit.getBrightColor();
    const diametr =
      (this.blockH / 2) * this.lenNumber - this.marginOutside * 1.15;

    const polygonClip = generatePolygon(
      this.lenNumber,
      diametr,
      this.currentAngle
    );

    this.globalWrapper = document.createElement("div");
    this.globalWrapper.className = "globalWrapper";

    this.setclock = document.createElement("div");
    this.setclock.className = "setclock";

    if (!this.showSetClock) {
      this.setclock.style.display = "none";
      // this.globalWrapper.style.width = "30px";
    } else {
      this.setclock.style.display = "";
      this.globalWrapper.style.width = "150px";
    }

    this.krishka_l = document.createElement("div");
    this.krishka_l.className = "krishka krishka_left";

    this.krishka_r = document.createElement("div");
    this.krishka_r.className = "krishka krishka_right";

    Object.assign(this.krishka_l.style, {
      background: bg,
      width: diametr + "px",
      height: diametr + "px",
      clipPath: polygonClip,
      transform: `translate(-50%,-50%) translate3d(${-15}px, 0%, -${
        this.marginOutside
      }px) rotateY(90deg)`,
    });
    Object.assign(this.krishka_r.style, {
      background: bg,
      width: diametr + "px",
      height: diametr + "px",
      clipPath: polygonClip,
      transform: `translate(-50%,-50%) translate3d(${15}px, 0%, -${
        this.marginOutside
      }px) rotateY(90deg)`,
    });

    this.digitWrapper = document.createElement("div");
    this.digitWrapper.className = "digitWrapper";
    this.digitWrapper.style.transformOrigin = `center center -${this.marginOutside}px`;

    this.digitWrapper.append(this.krishka_l, this.krishka_r);

    for (let i = 0; i < this.lenNumber; i++) {
      const block = document.createElement("div");
      block.className = "block";
      block.textContent = i;
      const angle = i * this.stepAngle;
      Object.assign(block.style, {
        width: this.blockW + "px",
        height: this.blockH + "px",
        transform: `rotateX(-${angle}deg) translate(-50%,-50%)`,
        transformOrigin: `0px 0px -${this.marginOutside}px`,
        background: bg,
        color: "white",
      });
      this.digitWrapper.append(block);
      this.blocks.push(block);

      // Digit
      const button = document.createElement("button");
      button.style.gridArea = "bc" + i;
      button.textContent = i;
      button.dataset.digit = i;
      this.setclock.append(button);
    }

    const buttonP = document.createElement("button");
    buttonP.style.gridArea = "bp";
    buttonP.title = "Forward";
    buttonP.textContent = "+";

    const buttonM = document.createElement("button");
    buttonM.style.gridArea = "bm";
    buttonM.title = "Backward";
    buttonM.textContent = "-";
    this.setclock.append(buttonP, buttonM);

    let y = 0;
    this.digitWrapper.addEventListener("touchstart", (e) => {
      y = e.changedTouches[0].clientY;
    });

    this.digitWrapper.addEventListener("touchend", (e) => {
      if (y > e.changedTouches[0].clientY) {
        this.moveForward(this.currentDig + 1);
        y = e.changedTouches[0].clientY;
      } else {
        this.moveBackward(this.currentDig - 1);
      }
    });

    this.setclock.addEventListener("click", (e) => {
      const target = e.target;

      if (target.tagName === "BUTTON") {
        // Plus and Minus
        console.log("Type", target);
        if (target.textContent === "+") {
          // this.moveForward(+target.dataset.digit);
          this.moveForward(this.currentDig + 1);
        } else if (target.textContent === "-") {
          // this.moveBackward(+target.dataset.digit);
          this.moveBackward(this.currentDig - 1);
        } else {
          // Other buttons
          // this.moveForward(+target.dataset.digit);
          this.moveForward(+target.dataset.digit);
        }
      }
    });

    this.globalWrapper.append(this.setclock, this.digitWrapper);

    return this.globalWrapper;
  }

  moveBackwardClass(targetDig) {
    try {
      if (this.digitWrapper.className.indexOf("digit-") != -1) {
        const nameClasses = this.digitWrapper.className.match(/(digit-\d+)/)[1];

        this.digitWrapper.style.transition = "";
        console.log(this.name, targetDig);
        if (nameClasses === "digit-0" && targetDig === this.lenNumber - 1) {
          // console.log("Ok");
          this.digitWrapper.style.transform = "rotateX(-36deg)";
          this.digitWrapper.addEventListener("transitionend", (e) => {
            this.digitWrapper.style.transform = "rotateX(0deg)";
            this.digitWrapper.style.transition = "none";
            this.digitWrapper.style.transform = "";
            this.digitWrapper.removeEventListener("transitionend", e);
          });
        }
        this.digitWrapper.classList.remove(nameClasses);
      }

      this.digitWrapper.classList.add(`digit-${targetDig}`);
      this.currentDig = targetDig < 0 ? this.lenNumber - 1 : targetDig;
      this.currentAngle = targetDig * this.stepAngle;
    } catch (e) {
      console.log(e);
    }
  }

  moveForwardClass(targetDig) {
    try {
      if (this.digitWrapper.className.indexOf("digit-") != -1) {
        const nameClasses = this.digitWrapper.className.match(/(digit-\d+)/)[1];

        this.digitWrapper.style.transition = "";

        if (nameClasses === "digit-9" && targetDig === 0) {
          // console.log("Ok");
          this.digitWrapper.style.transform = "rotateX(360deg)";
          this.digitWrapper.addEventListener("transitionend", (e) => {
            this.digitWrapper.style.transform = "rotateX(36deg)";
            this.digitWrapper.style.transition = "none";

            this.digitWrapper.style.transform = "";
            this.digitWrapper.removeEventListener("transitionend", e);
          });
        }
        this.digitWrapper.classList.remove(nameClasses);
      }

      this.digitWrapper.classList.add(`digit-${targetDig}`);
      this.currentDig = targetDig > this.lenNumber - 1 ? 0 : targetDig;
      this.currentAngle = targetDig * this.stepAngle;
    } catch (e) {
      console.log(e);
    }
  }

  moveForward(targetDig) {
    const nextDig = targetDig % this.lenNumber;
    const isWrapAround =
      this.currentDig === this.lenNumber - 1 && nextDig === 0;

    if (isWrapAround) {
      const onTransitionEnd = () => {
        this.digitWrapper.style.transition = "none";
        this.digitWrapper.style.transform = "rotateX(0deg)";
        this.digitWrapper.removeEventListener("transitionend", onTransitionEnd);
      };

      this.digitWrapper.style.transition = "";
      this.digitWrapper.style.transform = "rotateX(360deg)";
      this.digitWrapper.addEventListener("transitionend", onTransitionEnd);
    } else {
      this.digitWrapper.style.transition = "";
      this.digitWrapper.style.transform = `rotateX(${
        nextDig * this.stepAngle
      }deg)`;
    }

    this.currentDig = nextDig;
    this.currentAngle = nextDig * this.stepAngle;
  }

  moveBackward(targetDig) {
    const nextDig = targetDig % this.lenNumber;
    //console.log(this.name,this.currentDig, nextDig)
    const isWrapAround =
      this.currentDig === 0 && nextDig === this.lenNumber - 1;

    if (isWrapAround) {
      const onTransitionEnd = () => {
        this.digitWrapper.style.transition = "none";
        this.digitWrapper.style.transform = "rotateX(324deg)";
        this.digitWrapper.removeEventListener("transitionend", onTransitionEnd);
      };

      this.digitWrapper.style.transition = "";
      this.digitWrapper.style.transform = "rotateX(-36deg)";
      this.digitWrapper.addEventListener("transitionend", onTransitionEnd);
    } else {
      this.digitWrapper.style.transition = "";
      this.digitWrapper.style.transform = `rotateX(${
        nextDig * this.stepAngle
      }deg)`;
    }

    this.currentDig = nextDig;
    this.currentAngle = nextDig * this.stepAngle;
  }
}

// DigitalNumber manager class
class DigitalNumber {
  constructor(number, params) {
    this.params = params;
    const numStr = number.toString();
    this.numbers = Array.from(numStr);
    this.lenNumber = !params.lenNumber
      ? new Array(10).fill(10)
      : !Array.isArray(params.lenNumber)
      ? Array(+params.lenNumber).fill(+params.lenNumber)
      : params.lenNumber;
    this.cls = params.cls ?? false;
    this.createDigit();
  }

  createDigit() {
    this.digitCls = [];

    this.numbers.map((n, idx) => {
      const dig = new Digit({
        ...this.params,
        currentDig: +n,
        nextEl: this.digitCls[idx - 1] ? this.digitCls[idx - 1] : null,
        lenNumber: this.lenNumber[idx],
      });

      if (this.cls) {
        dig.moveForwardClass(dig.currentDig);
      } else {
        dig.digitWrapper.style.transform = `rotateX(${n * dig.stepAngle}deg)`;
      }

      Object.assign(dig.globalWrapper.style, {
        zIndex: this.numbers.length - idx,
      });

      this.digitCls.push(dig);
    });

    this.digitCls = this.digitCls.map((n, idx) => {
      n.prevEl = this.digitCls[idx + 1] ? this.digitCls[idx + 1] : null;
      return n;
    });

    //console.log(this.digitCls);
  }

  runForward() {
    const digits = this.digitCls.toReversed();
    const func = this.cls
      ? Digit.prototype.moveForwardClass
      : Digit.prototype.moveForward;

    let carry = true;

    for (let i = 0; i < digits.length; i++) {
      const n = digits[i];

      if (carry) {
        if (n.currentDig === n.lenNumber - 1) {
          func.call(n, 0);
          //n.moveForward(0);
        } else {
          func.call(n, n.currentDig + 1);
          //n.moveForward(n.currentDig + 1);
          carry = false;
        }
      }
    }
  }

  runBackward() {
    const digits = this.digitCls.toReversed();
    const func = this.cls
      ? Digit.prototype.moveBackwardClass
      : Digit.prototype.moveBackward;

    let carry = true;

    for (let i = 0; i < digits.length; i++) {
      const n = digits[i];

      if (carry) {
        if (n.currentDig === 0) {
          func.call(n, n.lenNumber - 1);
          // n.moveBackward(n.lenNumber - 1);
        } else {
          func.call(n, n.currentDig - 1);
          // n.moveBackward(n.currentDig - 1);
          carry = false;
        }
      }
    }
  }
}

export { Digit, DigitalNumber };
