// Adapted from http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/

// Get rid of title screen


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

console.log("Canvas created.");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
}
bgImage.src = "images/background.png" // todo

// Prepare molecules
var glucoseReady = false;
var glucoseImage = new Image();
glucoseImage.onload = function() {
    glucoseReady = true;
};
glucoseImage.src = "images/glucose.png"

var nadReady = false;
var nadImage = new Image();
nadImage.onload = function() {
    nadReady = true;
};
nadImage.src = "images/nad.png"

console.log("Images loaded.");

// Game objects
var glucose = {
    speed: 256, // movement in pixels/second
    x: 0,
    y: 0,
    length: 240, // in px; these are used to bound movement
    width: 40
};

var nad = {
    speed: 128, // movement in pixels/second
    x: 0,
    y: 0,
    length: 30, // in px
    width: 20
};

console.log("Classes successfully setup.");

var points = 0;
var characters = [glucose, nad];

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

console.log("Event listeners setup.");

// Update game objects
var update = function(modifier) {
    // move glucose according to keyboard
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
        glucose.x <= (nad.x + nad.length) &&
        nad.x <= (glucose.x + nad.length) &&
        glucose.y <= (nad.y + nad.width) &&
        nad.y <= (glucose.y + nad.width)
    ) {
        points += 1;
        // switch glucose image?
    }

    // Move NAD+ randomly
    // 2 steps in either direction
    probability = Math.random();
    if (probability >= 0.5) {
        nad.x += 2;
    } else {
        nad.x -= 2;
    }

    probability = Math.random();
    if (probability >= 0.5) {
        nad.y += 0.5;
    } else {
        nad.y -= 0.5;
    }
    
    // don't go out of bounds
    for (i = 0; i < characters.length; i++) {
        if (characters[i].y < 0) {
            characters[i].y = 0;
        } else if (characters[i].y + characters[i].width > 480) {
            characters[i].y = 480 - characters[i].width;
        }
        if (characters[i].x < 0) {
            characters[i].x = 0;
        } else if (characters[i].x + characters[i].length > 512) {
            characters[i].x = 512 - characters[i].length;
        }
    }
    //console.log("Update function successful.");
};


// Draw everything
var render = function() {
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
    //console.log("THINGS HAVE BEEN DOODLED.");
};

// The main game loop
var main = function(then) {
    var now = Date.now();
    var delta = now - then;

    update(delta/1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
    //console.log("Main run.");
};

$(document).ready(function() {
    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Get rid of title screen
    $('button#playbutton').on('click', function() {
        $('div#game').fadeOut("slow", function() {
            // Play the game
            console.log("Game begun.");
            var then = Date.now();
            main(then);
        });
    });
});
