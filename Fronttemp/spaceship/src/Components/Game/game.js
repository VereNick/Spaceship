import { io } from "socket.io-client";
import shipImg from "./ship.png";
import shipFireImg from "./shipfire.png";

export default function StartGame(canvas) {
  const maph = (canvas.height = 1000);
  const mapw = (canvas.width = 1500);
  const ctx = canvas.getContext("2d");
  let last = Date.now();
  let keys = {};
  let stars = [];
  const numstars = 300;
  let ships = [];
  class Star {
    constructor(xx, yy, ss) {
      this.x = xx || 100;
      this.y = yy || 100;
      this.size = ss || 1;
    }
    render() {
      ctx.fillStyle = "#fffff6";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "yellow";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    move(dt) {
      this.x = ((this.x + 10 + 5 * dt) % (canvas.width + 20)) - 10;
      this.y = ((this.y + 10 + 5 * dt) % (canvas.height + 20)) - 10;
    }
  }
  class Ship {
    constructor() {
      this.id = Math.random().toString(16).slice(2);
      this.x = getRandomInt(100, window.innerWidth - 100);
      this.y = getRandomInt(100, window.innerHeight - 100);
      this.dx = 0;
      this.dy = 0;
      this.ax = 500;
      this.ay = 500;
      this.maxspeed = 500;
      this.angle = 0;
      this.angleturncoff = 0.007;
      this.size = 60;
      this.fire = false;
    }
    moveForward(dt) {
      const newx = this.dx + Math.sin(this.angle) * this.ax * dt;
      const newy = this.dy + Math.cos(this.angle) * this.ay * dt;
      const hyp = Math.sqrt(newx * newx + newy * newy);
      if (hyp < this.maxspeed) {
        this.dx += Math.sin(this.angle) * this.ax * dt;
        this.dy += Math.cos(this.angle) * this.ay * dt;
      }
    }
    stop(dt) {
      const hyp = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      let curanglex = 0;
      if (hyp !== 0) curanglex = Math.asin(this.dx / hyp);
      let curangley = 0;
      if (hyp !== 0) curangley = Math.acos(this.dy / hyp);
      this.dx = this.dx - Math.sin(curanglex) * this.ax * dt;
      this.dy = this.dy - Math.cos(curangley) * this.ay * dt;
      if (
        (this.dx < 0 && Math.sin(curanglex) > 0) ||
        (this.dx > 0 && Math.sin(curanglex) < 0)
      )
        this.dx = 0;
      if (
        (this.dy < 0 && Math.cos(curangley) > 0) ||
        (this.dy > 0 && Math.cos(curangley) < 0)
      )
        this.dy = 0;
    }
    turn(dt, direction) {
      const mult = direction == "Left" ? -1 : 1;
      this.angle +=
        Math.sqrt(this.dx * this.dx + this.dy * this.dy) *
        this.angleturncoff *
        dt *
        mult;
    }
    update(dt) {
      this.x += this.dx * dt;
      this.y -= this.dy * dt;
      if (this.x < -this.size) this.x = mapw + this.size / 2;
      if (this.y < -this.size) this.y = maph;
      if (this.x > mapw + this.size / 2) this.x = -this.size;
      if (this.y > maph) this.y = -this.size;
    }
    render() {
      ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
      ctx.rotate(this.angle);
      ctx.drawImage(
        this.fire === true ? shipfireim : shipim,
        -this.size / 2,
        -this.size / 2,
        this.size,
        this.size
      );
      ctx.rotate(-this.angle);
      ctx.translate(-this.x - this.size / 2, -this.y - this.size / 2);
      for (let i = 0; i < ships.length; i++) {
        ctx.translate(
          ships[i].x + ships[i].size / 2,
          ships[i].y + ships[i].size / 2
        );
        ctx.rotate(ships[i].angle);
        ctx.drawImage(
          ships[i].fire === true ? shipfireim : shipim,
          -ships[i].size / 2,
          -ships[i].size / 2,
          ships[i].size,
          ships[i].size
        );
        // Top
        ctx.drawImage(
          ships[i].fire === true ? shipfireim : shipim,
          -ships[i].size / 2,
          -ships[i].size / 2 - maph + 40,
          ships[i].size,
          ships[i].size
        );
        // // Down
        // ctx.drawImage(
        //   ships[i].fire === true ? shipfireim : shipim,
        //   -ships[i].size / 2,
        //   -ships[i].size / 2,
        //   ships[i].size,
        //   ships[i].size
        // );
        // // Left
        // ctx.drawImage(
        //   ships[i].fire === true ? shipfireim : shipim,
        //   -ships[i].size / 2,
        //   -ships[i].size / 2,
        //   ships[i].size,
        //   ships[i].size
        // );
        // // Right
        // ctx.drawImage(
        //   ships[i].fire === true ? shipfireim : shipim,
        //   -ships[i].size / 2,
        //   -ships[i].size / 2,
        //   ships[i].size,
        //   ships[i].size
        // );
        ctx.rotate(-ships[i].angle);
        ctx.translate(
          -ships[i].x - ships[i].size / 2,
          -ships[i].y - ships[i].size / 2
        );
      }
    }
  }
  const ship = new Ship();
  const socket = io.connect("localhost:3002", { transports: ["websocket"] });
  socket.emit("login", ship);
  socket.on("update", function (entity) {
    if (entity.id !== ship.id) {
      console.log(entity);
      ships.push(entity);
    }
  });

  let shipim = new Image(712, 924);
  shipim.src = shipImg;
  let shipfireim = new Image(712, 924);
  shipfireim.src = shipFireImg;
  //ship.x = canvas.width / 2 - 75;
  //ship.y = canvas.height - 300;
  for (let i = 0; i < numstars; i++) {
    let xx = getRandomInt(1, mapw);
    let yy = getRandomInt(1, maph);
    let ss = getRandomInt(1, 5);
    stars.push(new Star(xx, yy, ss));
  }
  function game() {
    const now = Date.now();
    const dt = (now - last) / 1000;
    update(dt);
    render();
    last = now;
    requestAnimFrame(game);
  }
  function update(dt) {
    if (keyDown("Down")) {
      ship.stop(dt);
    }
    if (keyDown("Up")) {
      ship.moveForward(dt);
      ship.fire = true;
    } else ship.fire = false;
    if (keyDown("Left")) {
      ship.turn(dt, "Left");
    }
    if (keyDown("Right")) {
      ship.turn(dt, "Right");
    }
    ship.update(dt);

    // Передвижение звезд
    for (let i = 0; i < numstars; i++) {
      stars[i].move(dt);
    }
  }
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numstars; i++) {
      stars[i].render();
    }
    ship.render();
  }
  let requestAnimFrame = (function () {
    return window.requestAnimationFrame;
  })();
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  function setKey(event, status) {
    let code = event.keyCode;
    let key;
    if (code === 32) {
      key = "Space";
    } else if (code === 37) {
      key = "Left";
    } else if (code === 38) {
      key = "Up";
    } else if (code === 39) {
      key = "Right";
    } else if (code === 40) {
      key = "Down";
    } else {
      key = String.fromCharCode(code);
    }
    keys[key] = status;
  }
  function keyDown(key) {
    return keys[key];
  }
  document.addEventListener("keydown", function (e) {
    setKey(e, true);
  });
  document.addEventListener("keyup", function (e) {
    setKey(e, false);
  });
  document.addEventListener("blur", function () {
    keys = {};
  });
  game();
}
