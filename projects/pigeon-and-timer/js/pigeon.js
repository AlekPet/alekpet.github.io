/*
Title: Pigeon class
Author: AlekPet (http://github.com/alekpet)
*/

const messages = [
  "Курлык-курлык! Есть хлебушек?",
  "Эй, это моя площадь!",
  "Че смотришь, человек?",
  "Кто тут главный? Я главный!",
  "Оставь меня в покое, я занят!",
  "Где мои крошки?",
  "Небо принадлежит мне!",
  "Ой, кажется, я что-то уронил... на твою машину!",
  "Курлык – это философия жизни!",
  "Я вижу тебя, а ты меня?",
  "Уру-ру-ру...",
  "Курлык-курлык, смертные! Склонитесь передо мной!",
  "Хлеб — временный, власть — вечна!",
  "Ой, ты думал, это твой бутерброд? Какая наивность!",
  "Еще шаг — и твоя машина в белом камуфляже!",
  "Я не жирный, я ВЕЛИЧЕСТВЕННЫЙ!",
  "Кто оставил семечку? Это теперь мой клад!",
  "Ты бежишь? Я тоже... но медленно и смешно.",
  "Парк уже наш, дальше только Кремль!",
  "Ты уронил кусочек. Он теперь мой. Судьба так решила.",
  "Твой зонтик? Нет, теперь это моя тронная комната!",
];

// Pigeon class
class Pigeon {
  constructor(params = {}) {
    const {
      parent = document.body,
      speed = 10,
      targetPos = [
        {
          x: 80,
          y: 0,
        },
      ],

      //   start = "left",

      stylesWrapper = {},
      stylesPigeon = {},
      action = "walk",
      x = 0,
      y = 0,
    } = params;

    this.ready = false;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.vx = x;
    this.vy = y;
    this.distance = 0;

    // this.start = start;

    this.ease = Math.random() * (0.15 - 0.3) + 0.3;
    this.friction = Math.random() * (0.25 - 0.05) + 0.05;

    this.parent = parent;
    this.speed = speed;
    this.backgroundPositionX = 0;
    this.backgroundPositionY = 0;

    targetPos.push({
      x,
      y,
    });
    this.targetPos = targetPos;
    this.velocity = 1;

    this.stylesWrapper = stylesWrapper;
    this.stylesPigeon = stylesPigeon;

    this.rndScale =
      params.rndScale ?? +(Math.random() * (0.65 - 0.6) + 0.6).toFixed(3);

    this.imgSrc = params.imgSrc ?? "pigeon.png";
    this.spriteFrames = params.spriteFrames ?? 2;
    this.countAnim = params.countAnim ?? 1;

    this.actions = ["walk", "nyam", /*"fly",*/ "pigeon-demon"];

    this.action = this.actions.includes(action) ? action : "walk";
    this.stp = 0;

    this.makePigeon();
  }

  async makePigeon() {
    const imgData = await new Promise((res, rej) => {
      const img = new Image();
      img.onload = (e) => {
        this.ready = true;
        res({
          w: e.target.naturalWidth,
          h: e.target.naturalHeight,
          img: e.target,
        });
      };
      img.onerror = () => rej(null);
      img.src = this.imgSrc; //"Golub2.png"
    });
    const { w, h, img } = imgData;

    this.spriteSizeW = w / this.spriteFrames;
    this.spriteSizeH = h / this.countAnim;

    this.pigeonWrapper = document.createElement("div");
    this.pigeonWrapper.className = "pigeonWrapper";

    this.pigeon = document.createElement("div");
    this.pigeon.className = "pigeon";

    this.pigeonBox = document.createElement("div");
    this.pigeonBox.className = "pigeonBox";
    Object.assign(this.pigeonBox.style, {
      width: this.spriteSizeW + "px",
      height: this.spriteSizeH + "px",
      scale: this.rndScale,
      transform: `translate(${50}%,${50}%)`,
    });

    this.pigeonMessage = document.createElement("div");
    this.pigeonMessage.className = "pigeon-message";

    Object.assign(this.pigeonWrapper.style, {
      ...this.stylesWrapper,
      top: this.y + "px",
      left: this.x + "px",
    });

    Object.assign(this.pigeon.style, {
      ...this.stylesPigeon,
      position: "absolute",
      background: `url(${img.src})`,
      backgroundPositionX: 0,
      transform: `scaleX(${this.velocity})`, //scale(${this.rndScale})`,
    });
    this.walkend = false;

    this.pigeonBox.append(this.pigeon);
    this.pigeonWrapper.append(this.pigeonMessage, this.pigeonBox);
    this.parent.append(this.pigeonWrapper);
    this.changeMessage();
  }

  changeMessage() {
    this.pigeonMessage.textContent =
      messages[Math.floor(Math.random() * messages.length)];

    const { width: mesW, height: mesH } =
      this.pigeonMessage.getBoundingClientRect();

    this.pigeonMessage.style.top = `${-mesH}px`;
  }

  walk_old() {
    const backgroundPositionX = parseInt(
      getComputedStyle(this.pigeon).getPropertyValue("background-position-x")
    );
    const leftPos = parseFloat(
      getComputedStyle(this.pigeonWrapper).getPropertyValue("left")
    );

    this.pigeon.style.backgroundPositionX =
      (backgroundPositionX === 0 ? this.spriteSizeW : 0) + "px";
    this.pigeon.style.backgroundPositionY = 0 + "px";

    if (this.start === "left") {
      if (leftPos >= this.targetPos[0].x) {
        //this.changeMessage();
        this.velocity = -1;
        this.start = "right";
      }
    }

    if (this.start === "right") {
      if (leftPos <= this.targetPos[1].x) {
        //this.changeMessage();
        this.velocity = 1;
        this.start = "left";
      }
    }

    this.pigeonWrapper.style.left = leftPos + this.velocity * this.speed + "px";
    this.pigeon.style.transform = `scaleX(${this.velocity})`;
  }

  nyam() {
    this.draw(2);
  }

  demon() {
    this.draw(5);
  }

  walk() {
    this.speed = 10;
    this.update(this.targetPos);
    this.draw(0);
  }

  fly() {
    this.speed = 20;
    this.update(this.targetPos);
    this.draw(3);
  }

  draw(y_anim) {
    this.backgroundPositionY = y_anim * this.spriteSizeH;

    this.pigeon.style.backgroundPositionY = this.backgroundPositionY + "px";

    this.pigeonWrapper.style.left = this.x + "px";
    this.pigeonWrapper.style.top = this.y + "px";
    this.pigeon.style.transform = `scaleX(${this.velocity})`;
  }

  update(targets) {
    this.dx = this.targetPos[0].x - this.x;
    this.dy = this.targetPos[0].y - this.y;
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

    this.angle = Math.atan2(this.dy, this.dx);

    this.vx += Math.cos(this.angle) * this.speed;
    this.vy += Math.sin(this.angle) * this.speed;

    this.x = this.vx * this.ease;
    this.y = this.vy * this.ease;

    this.velocity = this.dx > 0 ? 1 : -1;

    if (Math.floor(this.distance) == 0) {
      this.targetPos = this.targetPos.reverse();
      console.log(this.targetPos);
      //   this.walkend = !this.walkend;
      //   if (this.walkend) {
      //     this.target.x = 0;
      //     this.target.y = 0;
      //   } else {
      //     this.target.x = 80;
      //     this.target.y = 0;
      //   }
    }
  }

  animate_v2() {
    if (!this.ready) return;

    this.backgroundPositionX =
      this.backgroundPositionX === 0 ? this.spriteSizeW : 0;
    this.pigeon.style.backgroundPositionX = this.backgroundPositionX + "px";
  }

  animate() {
    if (!this.ready) return;

    this.retry = !this.retry
      ? Math.floor(Math.random() * (16 - 4) + 4)
      : this.retry;
    this.rnd = !this.rnd
      ? this.countAnim === 1
        ? 0
        : Math.floor(Math.random() * this.actions.length)
      : this.rnd;

    if (this.stp % this.retry === 0) {
      this.rnd =
        this.countAnim === 1
          ? 0
          : Math.floor(Math.random() * this.actions.length);
      this.action = this.actions[this.rnd];

      this.retry = Math.floor(Math.random() * (16 - 4) + 4);

      //   if (this.rnd === 2) {
      //     this.retry = 136;
      //   }
      this.changeMessage();
    }

    this.backgroundPositionX =
      this.backgroundPositionX === 0 ? this.spriteSizeW : 0;
    this.pigeon.style.backgroundPositionX = this.backgroundPositionX + "px";

    // console.log(this.rnd, this.action);
    switch (this.action) {
      case "nyam":
        this.nyam();
        break;

      case "walk":
        // this.target = this.target ?? {
        //   x: 80,
        //   y: 0,
        // };
        this.walk();
        break;

      case "fly":
        // this.target2 = this.target2 ?? {
        //   x: 100,
        //   y: -80,
        // };
        this.fly();
        break;

      case "pigeon-demon":
        this.demon();
        break;
    }
    this.stp += 1;
  }
}

export { Pigeon };
