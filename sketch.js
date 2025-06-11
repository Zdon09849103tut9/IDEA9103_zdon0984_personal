let circles = [];
let rects = [];
let halfCircles = [];

let bgImage;

// 虚拟画布大小
let baseWidth = 800;
let baseHeight = 1300;

let scaleFactor, offsetX, offsetY;

function preload() {
  // 替换链接为你自己的图片 URL
  bgImage = loadImage("asset/image.png");
}

// 每项数据格式：[x, y, r, angle, leftRatio]
let rawData = [
  [104, 4, 50, Math.PI, 0.7], [74, 100, 50, 0, 0.6], [84, 185, 35, Math.PI, 0.5], [144, 220, 35, Math.PI * 3 / 2, 0.5], [179, 275, 30, 0, 0.5],
  [170, 350, 45, 0, 0.6], [175, 445, 50, Math.PI, 0.5], [251, 483, 35, Math.PI * 3 / 2, 0.4], [319, 497, 35, Math.PI / 2, 0.4],
  [384, 490, 30, Math.PI * 3 / 2, 0.5], [495, 305, 20, Math.PI, 0.4], [467, 340, 25, Math.PI / 2, 0.5], [320, 303, 20, Math.PI, 0.5],
  [305, 340, 20, Math.PI / 2, 0.5], [355, 340, 30, Math.PI * 3 / 2, 0.5], [414, 380, 40, Math.PI, 0.5], [414, 445, 25, 0, 0.5],

  [825, 97, 20, Math.PI, 0.5], [798, 140, 30, Math.PI / 2, 0.4], [727, 132, 40, Math.PI * 3 / 2, 0.5], [666, 135, 20, Math.PI / 2, 0.5],
  [628, 160, 25, Math.PI, 0.3], [639, 235, 50, 0, 0.5], [635, 320, 35, Math.PI, 0.5], [626, 400, 45, 0, 0.6],
  [594, 478, 40, Math.PI * 3 / 2, 0.4], [524, 484, 30, Math.PI / 2, 0.6], [454, 498, 40, Math.PI / 2, 0.4], [425, 588, 55, Math.PI, 0.6],

  [400, 710, 70, 0, 0.6], [414, 830, 50, Math.PI, 0.5], [426, 910, 30, Math.PI, 0.7], [387, 975, 45, 0, 0.8],
  [335, 1020, 25, Math.PI * 3 / 2, 0.5], [265, 1020, 45, Math.PI / 2, 0.5], [462, 1006, 35, Math.PI / 2, 0.7], [542, 1020, 45, Math.PI * 3 / 2, 0.5],
];

let halfCircleRawData = [
  // [x, y, 半径, 填充色, 边框色, 边框宽度]
  [185, 1138, 34, [109,173,123], [232, 92, 90], 0],
  [265, 1138, 44, [227, 197, 99], [83, 86, 101], 0],
  [361, 1138, 50, [251,91,99], [83, 86, 101], 0],
  [454.5, 1138, 42, [251,91,99], [83, 86, 101], 0],
  [542, 1138, 43, [227, 197, 99], [83, 86, 101], 0],
  [606.5, 1138, 16, [109,173,123], [83, 86, 101], 0],
];

let rectRawData = [
  // [x, y, width, height, fillColor, borderColor, borderWidth]
  [0, 1040, 800, 120, [109, 173, 123], [62, 58, 47], 5],
  [146, 1020, 480, 120, [227, 197, 99], [62, 58, 47], 5],
  [150, 1023, 90, 115, [227, 197, 99], [0, 0, 0], 0],
  [220, 1023, 90, 115, [251,91,99], [0, 0, 0], 0],
 [310, 1023, 102, 115, [109,173,123], [0, 0, 0], 0],
   [412, 1023, 80, 115, [227, 197, 99], [0, 0, 0], 0],
   [497, 1023, 90, 115, [109,173,123], [0, 0, 0], 0],
   [0, 1040, 100, 120, [109, 173, 123], [62, 58, 47], 5],
    [750, 1040, 100, 120, [109, 173, 123], [62, 58, 47], 5],
];


function setup() {
  createCanvas(windowWidth, windowHeight);
  setupTransform();
  setupHalfCircles();
  setupRects();
  setupCircles();
}

function draw() {
  background(200);

  if (bgImage) {
    let imgAspect = bgImage.width / bgImage.height;
    let canvasAspect = width / height;

    let drawWidth, drawHeight;

    if (imgAspect > canvasAspect) {
      drawHeight = height;
      drawWidth = imgAspect * height;
    } else {
      drawWidth = width;
      drawHeight = width / imgAspect;
    }

    let dx = (width - drawWidth) / 2;
    let dy = (height - drawHeight) / 2;

    image(bgImage, dx, dy, drawWidth, drawHeight);
  }

  push();
  applyTransform();

  for(let r of rects) {
    r.draw();
  }

  for (let c of circles) {
    c.display();
  }

   for (let h of halfCircles) {
    h.draw();
   }
  pop();
}


function setupRects() {
  rects = [];
  for (let [x, y, w, h, fillColor, borderColor, borderWidth] of rectRawData) {
    rects.push(new Rect(
      x, y, w, h,
      fillColor,
      borderColor,
      borderWidth
    ));
  }
}


function setupHalfCircles() {
  halfCircles = [];
  for (let [x, y, r, fillColor, borderColor, borderWidth] of halfCircleRawData) {
    halfCircles.push(new HalfCircle(
      x, y, r, fillColor, borderColor, borderWidth
    ));
  }
}

function setupCircles() {
  circles = [];
  for (let [x, y, r, angle, leftRatio] of rawData) {
    circles.push(new SplitCircle(
      x, y, r,
      leftRatio,
      [251, 91, 99],
      [109, 173, 123],
      [62, 58, 47],
      4,
      angle
    ));
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupTransform();
}

// 缩放 + 居中逻辑
function setupTransform() {
  let scaleX = width / baseWidth;
  let scaleY = height / baseHeight;
  scaleFactor = min(scaleX, scaleY);
  offsetX = (width - baseWidth * scaleFactor) / 2;
  offsetY = (height - baseHeight * scaleFactor) / 2;
}

function applyTransform() {
  translate(offsetX, offsetY);
  scale(scaleFactor);
}


class SplitCircle {
  constructor(x, y, r, leftRatio, leftColor, rightColor, borderColor, borderWidth, angle = 0) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.leftRatio = leftRatio;
    this.leftColor = leftColor;
    this.rightColor = rightColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.angle = angle; // 分割线的方向（角度），以水平右侧为 0 弧度，逆时针旋转
  }

  display() {
    push();
    let d = this.r * 2;

    // 绘制完整圆背景（右色）
    fill(...this.rightColor);
    noStroke();
    ellipse(this.x, this.y, d, d);

    // 计算分割线的“法向量方向”
    let normalX = cos(this.angle);
    let normalY = sin(this.angle);

    // 临界值：基于比例映射的点积值
    let threshold = (2 * this.leftRatio - 1) * this.r;

    // 绘制左色区域
    fill(...this.leftColor);
    beginShape();
    let step = 0.05;
    for (let a = 0; a <= TWO_PI + step; a += step) {
      let dx = cos(a) * this.r;
      let dy = sin(a) * this.r;

      // 点积判断是否在分割线左侧
      let dot = dx * normalX + dy * normalY;
      if (dot < threshold) {
        vertex(this.x + dx, this.y + dy);
      }
    }
    endShape(CLOSE);

    // 边框
    stroke(...this.borderColor);
    strokeWeight(this.borderWidth / scaleFactor);
    noFill();
    ellipse(this.x, this.y, d, d);
    pop();
  }
}


class Rect {
  constructor(x, y, width, height, fillColor, borderColor, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;     // [R, G, B]
    this.borderColor = borderColor; // [R, G, B]
    this.borderWidth = borderWidth;
  }

  draw() {
    stroke(this.borderColor[0], this.borderColor[1], this.borderColor[2]);
    strokeWeight(this.borderWidth);
    fill(this.fillColor[0], this.fillColor[1], this.fillColor[2]);
    rect(this.x, this.y, this.width, this.height);
  }
}


class HalfCircle {
  constructor(x, y, r, fillColor, borderColor, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fillColor = fillColor;     // [R, G, B]
    this.borderColor = borderColor; // [R, G, B]
    this.borderWidth = borderWidth;
  }

  draw() {
    stroke(this.borderColor[0], this.borderColor[1], this.borderColor[2]);
    strokeWeight(this.borderWidth);
    fill(this.fillColor[0], this.fillColor[1], this.fillColor[2]);
    // 画上半圆：起始角PI，结束角0（p5的arc默认顺时针）
    arc(this.x, this.y, this.r * 2, this.r * 2, PI, 0, PIE);
  }
}