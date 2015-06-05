// Adapted from http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/

$(document).ready(function() {

    // Get rid of title screen
    $('button#playbutton').on('click', function() {
        $('div#game').fadeOut("slow", function() {

            // Show instruction bar
            $('div#instructions').fadeIn();

            // Create the canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = 640;
            canvas.height = 480;
            document.body.appendChild(canvas);
            $(canvas).css('display:block;')

            /* 
            * | #  | Objective                                                 |
            * | -- | --------------------------------------------------------- |
            * | 0  | Collide with the ATP to become glucose with 1 phosphate   |
            * | 1  | Collide with another ATP to have 2 phosphates             |
            * | 2  | Split into 2 molecules                                    |
            * | 3  | Control one of the G3Ps, find a phosphate                 |
            * | 4  | Control the same G3P, find an NADH, create NAD+           |
            * | 5  | Control the same G3P, find an ADP, lose a phosphate       |
            * | 6  | Control the same G3P, find another ADP, lose a phosphate  |
            * | 7  | step 3 with the other G3P                                 |
            * | 8  | step 4 with the other G3P                                 |
            * | 9  | step 5 with the other G3P                                 |
            * | 10 | step 6 with the other G3P                                 |
            */
            var level = 0

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
            glucoseImage.src = "images/glucose.png";
            
            var nadReady = false;
            var nadImage = new Image();
            nadImage.onload = function() {
                nadReady = true;
            };
            nadImage.src = "images/nad.png";

            var atpReady = false;
            var atpImage = new Image();
            atpImage.onload = function() {
                atpReady = true;
            };
            atpImage.src = "images/atp.png";

            console.log("Images loaded.");
            
            // Game objects
            var glucose = {
                speed: 10, // movement in pixels/second
                x: 600,
                y: 400,
                length: 240, // in px; these are used to bound movement
                width: 40,
                img: glucoseImage
            };

            var nad = {
                speed: 2, // this needs to be used
                x: 0,
                y: 0,
                length: 30, // in px
                width: 20,
                img: nadImage
            };

            var atp = {
                speed: 5, // this needs to be used
                x: 0,
                y: 0,
                length: 60, // in px
                width: 15,
                img: atpImage
            }

            console.log("Classes successfully setup.");

            var points = 0;
            var characters = [glucose, nad, atp];
            var readys = [true, true, true];

            // Handle keyboard controls
            var keysDown = {};

            addEventListener("keydown", function (e) {
                keysDown[e.keyCode] = true;
            }, false);

            addEventListener("keyup", function (e) {
                delete keysDown[e.keyCode];
            }, false);

            console.log("Event listeners setup.");

            // setup positions of molecules in beginning
            var setup = function() {
                glucose.x = (Math.random() * (canvas.width - 64)) + 32;
                glucose.y = (Math.random() * (canvas.height - 64)) + 32;

                nad.x = (Math.random() * (canvas.width - 64)) + 32;
                nad.y = (Math.random() * (canvas.height - 64)) + 32;

                atp.x = (Math.random() * (canvas.width - 64)) + 32;
                atp.y = (Math.random() * (canvas.height - 64)) + 32;

            }

            // Update game objects
            var update = function(modifier) {
                // move glucose according to keyboard
                if (level == 0) {
                    if (38 in keysDown) { // Player holding up
                        glucose.y -= glucose.speed
                    }
                    if (40 in keysDown) { // Player holding down
                        glucose.y += glucose.speed
                    }
                    if (37 in keysDown) { // Player holding left
                        glucose.x -= glucose.speed
                    }
                    if (39 in keysDown) { // Player holding right
                        glucose.x += glucose.speed
                    }
                }
                else {

                }

                // Gain points (collision detection)
                // Needs to be changed to nad.
                if (
                    glucose.x <= (atp.x + atp.length) &&
                    atp.x <= (glucose.x + glucose.length) &&
                    glucose.y <= (atp.y + atp.width) &&
                    atp.y <= (glucose.y + glucose.width)
                ) {
                    points += 1;
                    // switch glucose image?
                }

                // Move NAD+ randomly
                // 2 steps in either direction
                probability = Math.random();
                if (probability >= 0.75) {
                    nad.x += nad.speed;
                } else if (probability <= 0.25){
                    nad.x -= nad.speed;
                }

                probability = Math.random();
                if (probability >= 0.75) {
                    nad.y += nad.speed;
                } else if (probability <= 0.25){
                    nad.y -= nad.speed;
                }

                // Move ATP randomly, reduced jitters
                probability = Math.random();
                if (probability >= 0.75) {
                    atp.x += atp.speed;
                } else if (probability <= 0.25){
                    atp.x -= atp.speed;
                }

                probability = Math.random();
                if (probability >= 0.75) {
                    atp.y += atp.speed;
                } else if (probability <= 0.25){
                    atp.y -= atp.speed;
                }

                // don't go out of bounds
                for (i = 0; i < characters.length; i++) {
                    if (characters[i].y < 0) {
                        characters[i].y = 0;
                    } else if (characters[i].y + characters[i].width > canvas.height) {
                        characters[i].y = canvas.height - characters[i].width;
                    }
                    if (characters[i].x < 0) {
                        characters[i].x = 0;
                    } else if (characters[i].x + characters[i].length > canvas.width) {
                        characters[i].x = canvas.width - characters[i].length;
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
                if (atpReady) {
                    ctx.drawImage(atpImage, atp.x, atp.y);
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

                update(delta / 1000);
                render();

                then = now;

                // Request to do this again ASAP
                requestAnimationFrame(main);
                //console.log("Main run.");
            };

            // Cross-browser support for requestAnimationFrame
            var w = window;
            requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

            // Play the game
            console.log("Game begun.");
            var then = Date.now();
            main(then);
        });
    });
});
