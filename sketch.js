let circles = [];
let rects = [];
let halfCircles = [];

let bgImage;
let song;
let amplitude;
let playButton;
let resetButton;
let progressSlider;
let isPlaying = false;
let curTime = 0;

let baseWidth = 800;
let baseHeight = 1300;
let scaleFactor, offsetX, offsetY;

// Volume control
let volumeSlider;
let volumeIconImgElt;

let appearInterval = 0.66
let fallInitTime = 44
let fallInterval = 2.0
let appearOrder = [];
let fallOrder = [];
let songEnded = false;

// 雪花相关
let snowflakes = [];
let snowing = false;
let snowPause = false;
let snowTriggered = false;
let snowStartTime = 20;

// 播放状态控制
let playState = "start"; // "start", "pause", "continue"
let pausedAt = 0;

function preload() {
  bgImage = loadImage("asset/image.png");
  song = loadSound("asset/mySong.mp3");
}

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
  [185, 1138, 34, [109,173,123], [232, 92, 90], 0],
  [265, 1138, 44, [227, 197, 99], [83, 86, 101], 0],
  [361, 1138, 50, [251,91,99], [83, 86, 101], 0],
  [454.5, 1138, 42, [251,91,99], [83, 86, 101], 0],
  [542, 1138, 43, [227, 197, 99], [83, 86, 101], 0],
  [606.5, 1138, 16, [109,173,123], [83, 86, 101], 0],
];

let rectRawData = [
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
  amplitude = new p5.Amplitude();

  // --- 播放/暂停/继续 按钮 Play/Pause/Continue button ---
  playButton = createButton("Start");
  playButton.position(20, 20);
  playButton.style('background-color', '#aaa');
  playButton.style('color', '#fff');
  playButton.style('font-size', '18px');
  playButton.style('border', 'none');
  playButton.style('padding', '8px 24px');
  playButton.style('border-radius', '8px');
  playButton.style('transition', 'background-color 0.2s');
  playButton.mousePressed(togglePlay);

  playButton.mouseOver(() => { playButton.style('background-color', '#ddd'); });
  playButton.mouseOut(() => { playButton.style('background-color', '#aaa'); });

  // --- 复位按钮 Reset button ---
  resetButton = createButton("Reset");
  resetButton.position(140, 20);
  resetButton.style('background-color', '#e34');
  resetButton.style('color', '#fff');
  resetButton.style('font-size', '18px');
  resetButton.style('border', 'none');
  resetButton.style('padding', '8px 24px');
  resetButton.style('border-radius', '8px');
  resetButton.style('transition', 'background-color 0.2s');
  // 关键改动：点击刷新网页
  resetButton.mousePressed(() => {
    location.reload();
  });
  resetButton.mouseOver(() => { resetButton.style('background-color', '#ff7676'); });
  resetButton.mouseOut(() => { resetButton.style('background-color', '#e34'); });

  // --- 音量滑块与喇叭图标 Volume slider & icon ---
  let g = createGraphics(24, 24);
  g.noStroke();
  g.fill(255);
  g.triangle(5, 8, 5, 16, 12, 16);
  g.rect(12, 10, 6, 4, 2);
  g.fill(255);
  g.arc(18, 12, 10, 10, -PI / 4, PI / 4);
  volumeIconImgElt = createImg(g.elt.toDataURL(), "Volume");
  positionVolumeIconAndSlider();

  volumeSlider = createSlider(0, 0.2, 0.05, 0.01);
  positionVolumeIconAndSlider();
  volumeSlider.input(() => {
    if (song && song.isLoaded()) song.setVolume(volumeSlider.value());
  });

  // --- 进度条 Progress Bar ---
  progressSlider = createSlider(0, 1, 0, 0.001);
  positionProgressSlider();

  progressSlider.input(onProgressInput);
progressSlider.mousePressed(() => userIsDragging = true);
progressSlider.mouseReleased(() => {
  userIsDragging = false;
  if (song && song.isLoaded()) {
    let newTime = progressSlider.value() * song.duration();
    song.jump(newTime); // 跳转时间
    pausedAt = newTime;
    // 不要在这里更改isPlaying
  }
});


  song.onended(onMusicEnded);
  if (song && song.isLoaded()) {
    song.setVolume(volumeSlider.value());
  }
}

function positionVolumeIconAndSlider() {
  let paddingLeft = 20;
  let paddingTop = 60;
  if (volumeIconImgElt) {
    volumeIconImgElt.position(paddingLeft, paddingTop);
    volumeIconImgElt.size(24, 24);
    volumeIconImgElt.style('vertical-align', 'middle');
    volumeIconImgElt.style('pointer-events', 'none');
  }
  if (volumeSlider) {
    volumeSlider.position(paddingLeft + 30, paddingTop + 3);
    volumeSlider.style('width', '100px');
  }
}

function positionProgressSlider() {
  progressSlider.position(20, windowHeight - 50);
  progressSlider.style('width', (windowWidth - 40) + 'px');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupTransform();
  positionProgressSlider();
  positionVolumeIconAndSlider();
  resetButton.position(140, 20);
}

let userIsDragging = false;

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

// Draw a warning text above the progress bar
fill(255);
noStroke();
textSize(18);
textAlign(CENTER, BOTTOM);
text("Notice: Progress bar has a known sync bug, please ignore.", windowWidth / 2, windowHeight - 60);

    
  }

  let progress = 0;
  let curTime = 0;
  if (song && song.isLoaded()) {
    if (!userIsDragging) {
      curTime = song.currentTime();
      let total = song.duration();
      if (total > 0) progress = curTime / total;
      progressSlider.value(progress);
    } else {
      progress = progressSlider.value();
      curTime = progress * song.duration();
    }
  }

  
  if (playButton) {
    if (!isPlaying) playButton.html("Continue");
    if (isPlaying) playButton.html("Pause");
  }

  // 雪花触发逻辑
  if (curTime >= snowStartTime) {
    snowing = true;
    snowPause = false;
    snowTriggered = true;
  }
  
  // 圆出现
  let appearCount = Math.floor(curTime / appearInterval);
  for (let i = 0; i < circles.length; i++) {
    circles[appearOrder[i]].visible = i < appearCount;
    if (curTime < fallInitTime) {
      circles[appearOrder[i]].resetFall();
    }
  }

  // 圆下落
  let fallCount = 0;
  if (curTime >= fallInitTime) {
    fallCount = Math.floor((curTime - fallInitTime) / fallInterval) + 1;
    for (let i = 0; i < fallOrder.length; i++) {
      let idx = fallOrder[i];
      if (i < fallCount && circles[idx].visible) {
        if (!circles[idx].landed) {
          circles[idx].startFalling();
        }
        circles[idx].updateFall(baseHeight - 10);
      } else {
        circles[idx].resetFall();
      }
    }
  }

  // 亮度与缩放 音乐律动范围修改！
  let level = amplitude.getLevel();
  let brightnessFactor = map(level, 0, 0.2, 0.9, 3.5, true);
  let scaleFactorCircle = map(level, 0, 0.2, 0.9, 3.5, true);

  push();
  applyTransform();

  for (let r of rects) {
    r.setBrightness(brightnessFactor);
    r.draw();
  }
  for (let c of circles) {
    c.setBrightness(brightnessFactor);
    c.setScale(scaleFactorCircle);
  }
  for (let h of halfCircles) {
    h.setBrightness(brightnessFactor);
    h.draw();
  }

  for (let c of circles) {
    if (c.visible) c.display();
  }

  pop();

  if (snowing) drawSnowflakes();
  drawTimeBarLabel();
}

function drawSnowflakes() {

  if (isPlaying) {
    if (random() < 0.4) snowflakes.push(new Snowflake());
    for (let flake of snowflakes) flake.update();

    snowflakes = snowflakes.filter(f => f.y < height + 20);
  }

  for (let flake of snowflakes) flake.draw();
}

class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = -10;
    this.size = random(5, 16);
    this.speed = random(1, 3);
    this.amp = random(10, 40);
    this.phase = random(TWO_PI);
    this.opacity = random(150, 255);
  }
  update() {
    this.y += this.speed;
    this.x += sin(this.phase + this.y / 30.0) * 0.7;
  }
  draw() {
    noStroke();
    fill(255, this.opacity);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function drawTimeBarLabel() {
  if (song && song.isLoaded()) {
    let x0 = 20;
    let y0 = windowHeight - 20;
    let cur = song.currentTime();
    let dur = song.duration();
    fill(60, 80);
    noStroke();
    textSize(16);
    textAlign(LEFT, CENTER);
    text(timeFormat(cur), x0, y0);
    textAlign(RIGHT, CENTER);
    text(timeFormat(dur), windowWidth - 20, y0);
  }
}

function timeFormat(sec) {
  sec = floor(sec);
  let m = floor(sec / 60);
  let s = sec % 60;
  return nf(m, 2) + ":" + nf(s, 2);
}

function onProgressInput() {}

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
  appearOrder = rawData.map((d, i) => [i, d[1]]).sort((a, b) => b[1] - a[1]).map(pair => pair[0]);
  fallOrder = rawData.map((d, i) => [i, d[1]]).sort((a, b) => a[1] - b[1]).map(pair => pair[0]);
  circles = [];
  for (let [x, y, r, angle, leftRatio] of rawData) {
    let c = new SplitCircle(
      x, y, r,
      leftRatio,
      [251, 91, 99],
      [109, 173, 123],
      [62, 58, 47],
      4,
      angle
    );
    c.visible = false;
    circles.push(c);
  }
}

// ---- 播放按钮逻辑 Start/Pause/Continue ----
function togglePlay() {
  if (playState === "start" || playState === "continue") {
    if (song && song.isLoaded()) {
      if (playState === "continue") {
        song.play();
        song.jump(pausedAt);
      } else {
        song.play();
      }
      isPlaying = true;
      playState = "playing";
    }
  } else if (playState === "playing") {
    if (song && song.isLoaded()) {
      song.pause();
      pausedAt = song.currentTime();
      isPlaying = false;
      playState = "pause";
      snowPause = true;
    }
  }
}

// ---- 结束重置 ----
function onMusicEnded() {
  isPlaying = false;
  playState = "start";
  songEnded = true;
  setTimeout(() => {
    // location.reload(); // 不自动刷新
  }, 3000);
}

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
    this.baseR = r;
    this.r = r;
    this.leftRatio = leftRatio;
    this.leftColor = leftColor;
    this.rightColor = rightColor;
    this.displayLeftColor = leftColor.slice();
    this.displayRightColor = rightColor.slice();
    this.borderColor = borderColor;
    this.displayBorderColor = borderColor.slice();
    this.borderWidth = borderWidth;
    this.angle = angle;
    this.visible = false;

    this.originY = y;
    this.currentY = y;
    this.isFalling = false;
    this.velocity = 0;
    this.landed = false;
    this.fallStartTime = 0;
  }

  setBrightness(factor) {
    this.displayLeftColor = this.leftColor.map(v => constrain(v * factor, 0, 255));
    this.displayRightColor = this.rightColor.map(v => constrain(v * factor, 0, 255));
    this.displayBorderColor = this.borderColor.map(v => constrain(v * factor, 0, 255));
  }

  setScale(factor) {
    this.r = this.baseR * factor;
  }

  startFalling() {
    if (!this.isFalling && !this.landed) {
      this.isFalling = true;
      this.velocity = 0;
      this.fallStartTime = millis();
      this.landed = false;
    }
  }

  resetFall() {
    this.currentY = this.originY;
    this.isFalling = false;
    this.velocity = 0;
    this.landed = false;
  }

  updateFall(bottomY) {
    if (this.isFalling && !this.landed) {
      let gravity = 0.002;
      let delta = deltaTime;
      this.velocity += gravity * delta;
      this.currentY += this.velocity * delta;
      if (this.currentY + this.r >= bottomY) {
        this.currentY = bottomY - this.r;
        this.landed = true;
        this.isFalling = false;
      }
    }
  }

  display() {
    push();
    let d = this.r * 2;
    let drawY = this.isFalling || this.landed ? this.currentY : this.y;
    fill(...this.displayRightColor);
    noStroke();
    ellipse(this.x, drawY, d, d);

    let normalX = cos(this.angle);
    let normalY = sin(this.angle);
    let threshold = (2 * this.leftRatio - 1) * this.r;

    fill(...this.displayLeftColor);
    beginShape();
    let step = 0.05;
    for (let a = 0; a <= TWO_PI + step; a += step) {
      let dx = cos(a) * this.r;
      let dy = sin(a) * this.r;
      let dot = dx * normalX + dy * normalY;
      if (dot < threshold) {
        vertex(this.x + dx, drawY + dy);
      }
    }
    endShape(CLOSE);

    stroke(...this.displayBorderColor);
    strokeWeight(this.borderWidth / scaleFactor);
    noFill();
    ellipse(this.x, drawY, d, d);
    pop();
  }
}

class Rect {
  constructor(x, y, width, height, fillColor, borderColor, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.displayColor = fillColor.slice();
    this.borderColor = borderColor;
    this.displayBorder = borderColor.slice();
    this.borderWidth = borderWidth;
  }

  setBrightness(factor) {
    this.displayColor = this.fillColor.map(v => constrain(v * factor, 0, 255));
    this.displayBorder = this.borderColor.map(v => constrain(v * factor, 0, 255));
  }

  draw() {
    stroke(...this.displayBorder);
    strokeWeight(this.borderWidth);
    fill(...this.displayColor);
    rect(this.x, this.y, this.width, this.height);
  }
}

class HalfCircle {
  constructor(x, y, r, fillColor, borderColor, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fillColor = fillColor;
    this.displayColor = fillColor.slice();
    this.borderColor = borderColor;
    this.displayBorder = borderColor.slice();
    this.borderWidth = borderWidth;
  }

  setBrightness(factor) {
    this.displayColor = this.fillColor.map(v => constrain(v * factor, 0, 255));
    this.displayBorder = this.borderColor.map(v => constrain(v * factor, 0, 255));
  }

  draw() {
    stroke(...this.displayBorder);
    strokeWeight(this.borderWidth);
    fill(...this.displayColor);
    arc(this.x, this.y, this.r * 2, this.r * 2, PI, 0, PIE);
  }
}
