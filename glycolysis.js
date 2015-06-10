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
            var level = 0;

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

            var atp2Ready = false;
            var atp2Image = new Image();
            atp2Image.onload = function() {
                atp2Ready = true;
            };
            atp2Image.src = "images/atp.png";

            console.log("Images loaded.");

            var g1Ready = false;
            var g1Image = new Image();
            g1Image.onload = function () {
                g1Ready = true;
            };
            g1Image.src = "images/c3p1.png"

            var g2Ready = false;
            var g2Image = new Image();
            g2Image.onload = function () {
                g2Ready = true;
            };
            g2Image.src = "images/c3p2.png"
            
            // Game objects
            var glucose = {
                speed: 10, // movement in pixels/second
                x: 600,
                y: 400,
                length: 240, // in px; these are used to bound movement
                width: 40,
            };

            var nad = {
                speed: 2, // this needs to be used
                x: 0,
                y: 0,
                length: 30, // in px
                width: 20,
            };

            var atp = {
                speed: 5, // this needs to be used
                x: 0,
                y: 0,
                length: 60, // in px
                width: 15,
            }

            var g1 = {
                speed: 7,
                x: -500,
                y: -500,
                length: 125,
                width: 40,
            }

            var g2 = {
                speed: 7,
                x: -500,
                y: -500,
                length: 125,
                width: 40,
            }

            console.log("Classes successfully setup.");

            var points = 0;
            var characters = [glucose, atp, nad]
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

                // g1 and g2 are off screen initially
                g1.x = -500;
                g1.y = -500;

                g2.x = -500;
                g2.y = -500;
            }

            var mashCount = 0;
            var keyToPress = 37;
            // Update game objects
            var update = function(modifier) {
                // move glucose according to keyboard
                if (38 in keysDown) { // Player holding up
                    if (level < 3) {
                        glucose.y -= glucose.speed;
                    } else if (level >= 3 && level < 7) {
                        g1.y -= g1.speed;
                    } else if (level >= 7) {
                        g2.y -= g2.speed;
                    }
                }
                if (40 in keysDown) { // Player holding down
                    if (level < 3) {
                        glucose.y += glucose.speed;
                    } else if (level >= 3 && level < 7) {
                        g1.y += g1.speed;
                    } else if (level >= 7) {
                        g2.y += g2.speed;
                    }
                }
                if (37 in keysDown) { // Player holding left
                    if (level < 3) {
                        glucose.x -= glucose.speed;
                    } else if (level >= 3 && level < 7) {
                        g1.x -= g1.speed;
                    } else if (level >= 7) {
                        g2.x -= g2.speed;
                    }
                }
                if (39 in keysDown) { // Player holding right
                    if (level < 3) {
                        glucose.x += glucose.speed;
                    } else if (level >= 3 && level < 7) {
                        g1.x += g1.speed;
                    } else if (level >= 7) {
                        g2.x += g2.speed;
                    }
                }
                
                // Gain points (collision detection)
                if (
                    glucose.x <= (atp.x + atp.length) &&
                    atp.x <= (glucose.x + glucose.length) &&
                    glucose.y <= (atp.y + atp.width) &&
                    atp.y <= (glucose.y + glucose.width)
                ) {
                    if (level == 0) {
                        glucoseImage.src = "images/glucose_phosphate-2.png"
                        glucose.length = 245;
                        
                        // Move ATP
                        atp.x = (Math.random() * (canvas.width - 64)) + 32;
                        atp.y = (Math.random() * (canvas.height - 64)) + 32;

                        level++;
                        console.log("Now at level " + level);
                        $('#instructions').html('<p>Great job! Now get to the other ATP.</p>');
                    
                    } else if (level == 1) {
                        glucoseImage.src = "images/glucose_phosphate.png"
                        glucose.length = 250;
                        atpImage.src = "images/adp.png"
                        level++;
                        console.log("Now at level " + level);
                    }
                }
                if (level == 2) {
                    $('#instructions').html('<p>You did it! Now you need to change into 2 G3P molecules. To do this, alternate button mashing your left and right keys.</p>')
                    
                    if (keyToPress == 37 && 37 in keysDown) {
                        mashCount++;
                        keyToPress = 39;
                    } else if (keyToPress == 39 && 39 in keysDown) {
                        mashCount++;
                        keyToPress = 37;
                    } if (mashCount < 40) {
                    } else {
                        level++;
                        
                        // add g1 and g2
                        g1.x = glucose.x;
                        g1.y = glucose.y;
                        console.log("g1: (" + g1.x + ", " + g1.y + ")");

                        g2.x = glucose.x + glucose.length/2 + 5;
                        g2.y = glucose.y;
                        console.log("g2: (" + g2.x + ", " + g2.y + ")");

                        characters.push(g1, g2);
                        console.log(characters);

                        // remove glucose
                        glucose.x = -50;
                        glucose.y = -50;
                        console.log("glucose: (" + glucose.x + ", " + glucose.y + ")");
                        characters.splice(characters.indexOf(glucose), 1);
                        console.log(characters);
                    }
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

                // Move atp randomly, reduced jitters
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
                if (g1Ready) {
                    ctx.drawImage(g1Image, g1.x, g1.y);
                }
                if (g2Ready) {
                    ctx.drawImage(g2Image, g2.x, g2.y);
                }
                /* We don't need to display points anymore
                // Score
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = "24px Helvetica";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Points: " + points, 32, 32);
                //console.log("THINGS HAVE BEEN DOODLED.");
                */
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
