// Adapted from http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
  bgReady = true;
}
bgImage.src = "images/background.jpg" // todo

// Prepare molecules
var glucoseReady = false;
var glucoseImage = new Image();
glucoseImage.onload = function () {
  glucoseReady = true;
};
glucoseImage.src = "images/glucose.gif"

var nadReady = false;
var nadImage = new Image();
nadImage.onload = function () {
  nadReady = true;
};
nadImage.src = "images/nad.gif"

// Game objects
var glucose = {
  speed: 256, // movement in pixels/second
  x: 0,
  y: 0
};

var nad = {
  speed: 128, // movement in pixels/second
  x: 0,
  y: 0
};

var points = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function (modifier) {
  if (38 in keysDown) { // Player holding up
    glucose.y -= glucose.speed * modifier
  }
  if (40 in keysDown) { // Player holding down
    glucose.y += glucose.speed * modifier
  }
  if (37 in keysDown) { // Player holding left
    glucose.x -= glucose.speed * modifier
  }
  if (39 in keysDown) { // Player holding right
    glucose.x += glucose.speed * modifier
  }

  // Gain points
  if (
    glucose.x <= (nad.x + 32) &&
    nad.x <= (glucose.x + 32) &&
    glucose.y <= (nad.y + 32) &&
    nad.y <= (glucose.y + 32)
  ) {
    points += 1;
    // switch glucose image?
  }

  if (glucose.y < 0) {
    glucose.y = 0;
  } else if (glucose.y > 480) {
    glucose.y = 480;
  }

  if (glucose.x < 0) {
    glucose.x = 0;
  } else if (glucose.x > 512) {
    glucose.x = 512;
  }

};

// Draw everything
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (glucoseReady) {
    ctx.drawImage(glucoseImage, glucose.x, glucose.y);
  }

  if (nadReady) {
    ctx.drawImage(nadImage, nad.x, nad.y);
  }

  // Score
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Points: " + points, 32, 32);
};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta/1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Play the game
var then = Date.now();
main();
