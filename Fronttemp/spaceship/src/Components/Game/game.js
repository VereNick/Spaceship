import socketIOClient from "socket.io-client";
export default function (canvas) {
    
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  var socketStatus = "disconnected";
  var socket;

  var canvas = document.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var now = Date.now();
  var last = Date.now();
  var keys = {};
  var fire = 0;
  var star = {
    x: 0,
    y: 0,
    size: 1,
  };
  var stars = [];
  var numstars = 300;
  var ships = [];
  var ship = {
    id: Math.random().toString(16).slice(2),
    x: getRandomInt(100, window.innerWidth - 100),
    y: getRandomInt(100, window.innerHeight - 100),
    dx: 0,
    dy: 0,
    ax: 500,
    ay: 500,
    maxspeed: 500,
    angle: 0,
    angleturncoff: 0.01,
    size: 60,
    fire: 0,
  };
  socket = socketIOClient.connect("localhost:3000");
  socket.emit("login", ship);
  socket.on("update", function (entity) {
    if (entity.id != ship.id) {
      console.log(entity);
      ships.push(entity);
    }
  });

  var shipim = new Image(712, 924);
  shipim.src = "ship.png";
  var shipfireim = new Image(712, 924);
  shipfireim.src = "shipfire.png";
  function setKey(event, status) {
    var code = event.keyCode;
    var key;
    if (code == 32) {
      key = "Space";
    } else if (code == 37) {
      key = "Left";
    } else if (code == 38) {
      key = "Up";
    } else if (code == 39) {
      key = "Right";
    } else if (code == 40) {
      key = "Down";
    } else {
      key = String.fromCharCode(code);
    }
    keys[key] = status;
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
  function keyDown(key) {
    return keys[key];
  }
  window.addEventListener("resize", function () {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  //ship.x = canvas.width / 2 - 75;
  //ship.y = canvas.height - 300;
  for (var i = 0; i < numstars; i++) {
    var xx = getRandomInt(1, window.innerWidth);
    var yy = getRandomInt(1, window.innerHeight);
    var ss = getRandomInt(1, 5);
    star = {
      x: xx,
      y: yy,
      size: ss,
    };
    stars.push(star);
  }
  function game() {
    var now = Date.now();
    var dt = (now - last) / 1000;
    update(dt);
    render();
    last = now;
    requestAnimFrame(game);
  }
  function update(dt) {
    if (keyDown("Down")) {
      var hyp = Math.sqrt(ship.dx * ship.dx + ship.dy * ship.dy);
      var curanglex = 0;
      if (hyp != 0) curanglex = Math.asin(ship.dx / hyp);
      var curangley = 0;
      if (hyp != 0) curangley = Math.acos(ship.dy / hyp);
      ship.dx = ship.dx - Math.sin(curanglex) * ship.ax * dt;
      ship.dy = ship.dy - Math.cos(curangley) * ship.ay * dt;
      if (
        (ship.dx < 0 && Math.sin(curanglex) > 0) ||
        (ship.dx > 0 && Math.sin(curanglex) < 0)
      )
        ship.dx = 0;
      if (
        (ship.dy < 0 && Math.cos(curangley) > 0) ||
        (ship.dy > 0 && Math.cos(curangley) < 0)
      )
        ship.dy = 0;
    }
    if (keyDown("Up")) {
      var newx = ship.dx + Math.sin(ship.angle) * ship.ax * dt;
      var newy = ship.dy + Math.cos(ship.angle) * ship.ay * dt;
      var hyp = Math.sqrt(newx * newx + newy * newy);
      if (hyp < ship.maxspeed) {
        ship.dx += Math.sin(ship.angle) * ship.ax * dt;
        ship.dy += Math.cos(ship.angle) * ship.ay * dt;
      }
      ship.fire = 1;
    } else ship.fire = 0;
    if (keyDown("Left")) {
      ship.angle -=
        Math.sqrt(ship.dx * ship.dx + ship.dy * ship.dy) *
        ship.angleturncoff *
        dt;
    }
    if (keyDown("Right")) {
      ship.angle +=
        Math.sqrt(ship.dx * ship.dx + ship.dy * ship.dy) *
        ship.angleturncoff *
        dt;
    }
    ship.x += ship.dx * dt;
    ship.y -= ship.dy * dt;

    // Передвижение
    for (var i = 0; i < numstars; i++) {
      stars[i].x = ((stars[i].x + 10 + 5 * dt) % (canvas.width + 20)) - 10;
      stars[i].y = ((stars[i].y + 10 + 5 * dt) % (canvas.height + 20)) - 10;
    }
  }
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fffff6";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "yellow";
    for (var i = 0; i < numstars; i++) {
      ctx.beginPath();
      ctx.arc(stars[i].x, stars[i].y, stars[i].size, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    ctx.translate(ship.x + ship.size / 2, ship.y + ship.size / 2);
    ctx.rotate(ship.angle);
    ctx.drawImage(
      ship.fire == 1 ? shipfireim : shipim,
      -ship.size / 2,
      -ship.size / 2,
      ship.size,
      ship.size
    );
    ctx.rotate(-ship.angle);
    ctx.translate(-ship.x - ship.size / 2, -ship.y - ship.size / 2);

    for (var i = 0; i < ships.length; i++) {
      ctx.translate(
        ships[i].x + ships[i].size / 2,
        ships[i].y + ships[i].size / 2
      );
      ctx.rotate(ships[i].angle);
      ctx.drawImage(
        ships[i].fire == 1 ? shipfireim : shipim,
        -ships[i].size / 2,
        -ships[i].size / 2,
        ships[i].size,
        ships[i].size
      );
      ctx.rotate(-ships[i].angle);
      ctx.translate(
        -ships[i].x - ships[i].size / 2,
        -ships[i].y - ships[i].size / 2
      );
    }
  }

  var requestAnimFrame = (function () {
    return window.requestAnimationFrame;
  })();
  game();
}
