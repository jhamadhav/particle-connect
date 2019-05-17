var canvas, ctx, h, w;
var num, speed, rad, conn_dis, line_color;
var particles = [];
var colors = [
  "#8C1178",
  "#F23869",
  "#BF30B6",
  "#1B4C8C",
  "#0F8AA6",
  "#3DFF00",
  "#FFFF00"
];
var mouse = {
  x: undefined,
  y: undefined
};

//function to change visual when window is resized and on loading
window.addEventListener("load", init);
window.addEventListener("resize", init);

function init() {
  //establishing some stuff
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  h = canvas.height = window.innerHeight - 10;
  w = canvas.width = window.innerWidth;

  let ran = Math.floor(Math.random() * (colors.length - 1));
  line_color = colors[ran];
  // control player by mousemovement
  canvas.onmousemove = function(e) {
    e.preventDefault();
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  particles = [];
  num = Math.floor((h > w ? h : w) / 3);
  speed = 1.7;
  rad = 1.5;
  conn_dis = 70;
  //console.log("width : " + w + "\nheight : " + h);
  draw();
}

//function to draw
function draw() {
  for (let i = 0; i < num; i++) {
    let x = Math.random() * (w - rad) + rad;
    let y = Math.random() * (h - rad) + rad;
    let vx = Math.pow(-1, Math.floor(x)) * Math.random() * speed;
    let vy = Math.pow(-1, Math.floor(y)) * Math.random() * speed;

    let dot = new Particle(x, y, vx, vy);
    particles.push(dot);
  }
  //console.log(particles);
  animate();
}

//animation
function animate() {
  //to paint the whole canvas
  ctx.beginPath();
  ctx.fillStyle = "#262626";
  ctx.rect(0, 0, w, h);
  ctx.fill();
  ctx.closePath();

  //to update obstacles
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].connect();
    particles[i].update();
  }
  requestAnimationFrame(animate);
}
//to draw circles
function draw_circle(
  x,
  y,
  radius,
  angle_from,
  angle_to,
  fill_color,
  stroke_color,
  line_width
) {
  ctx.beginPath();
  ctx.fillStyle = fill_color;
  ctx.arc(x, y, radius, angle_from, angle_to, false);
  ctx.fill();
  ctx.closePath();
}

class Particle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    //mouse move animation
    let diffX = Math.abs(this.x - mouse.x);
    let diffY = Math.abs(this.y - mouse.y);
    if (diffX < conn_dis && diffY < conn_dis) {
      if (this.x < mouse.x && this.x - diffX > 5) {
        this.x -= speed * 2;
        if (this.vx > 0) {
          this.vx = -this.vx;
        }
      } else if (this.x > mouse.x && this.x + mouse.x < w) {
        this.x += speed * 2;
        if (this.vx < 0) {
          this.vx = -this.vx;
        }
      }
      if (this.y < mouse.y && this.y - diffY > 5) {
        this.y -= speed * 2;
        if (this.vy > 0) {
          this.vy = -this.vy;
        }
      } else if (this.y > mouse.y && this.y + mouse.x < h) {
        this.y += speed * 2;
        if (this.vy < 0) {
          this.vy = -this.vy;
        }
      }
    }
    if (this.x > w || this.x < 0) {
      this.vx = -this.vx;
    }
    if (this.y > h || this.y < 0) {
      this.vy = -this.vy;
    }
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    draw_circle(
      this.x,
      this.y,
      rad,
      0,
      Math.PI * 2,
      "yellow",
      "transparent",
      0
    );
  }
  connect() {
    let a = {
      x: this.x,
      y: this.y
    };
    for (let i = 0; i < particles.length; i++) {
      let b = {
        x: particles[i].x,
        y: particles[i].y
      };
      let bet_dis = get_dis(a, b);
      if (bet_dis <= conn_dis) {
        ctx.beginPath();
        ctx.lineWidth = 0.09;
        ctx.strokeStyle = line_color;
        //ctx.strokeStyle = "rgba(255,255,255," + bet_dis / conn_dis + ")";
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
}

function get_dis(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
