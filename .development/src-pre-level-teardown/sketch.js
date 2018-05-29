/*
 * Tempest 1
 * © 2018 Owen Graham
 */

// Tempest 1 is pre-indev! No playing online!
var allowPlay = location.hostname != "tempest.gramkraxor.com";

var AUTHORS = [
	{ name:"Owen Graham",  role:"Everything" }
];

// Put AUTHORS into a string
var authorList = (function() {
	var r = "";
	for (var i = 0; i < AUTHORS.length; i++) {
		r += AUTHORS[i].name;
		if (i < AUTHORS.length - 1) r += ", ";
	}
	return r;
})();


var clunk = false;   // Will the game use 8-bit movement?
var charList = [];   // Array of map-dependent sprites
var timer = 0;       // Counts game ticks defined by loops of draw()
var lvlSpeed = 0;    // Speed of level progression
var lvlProgress = 0; // Distance travelled
var blowback = 0;    // Barrel blowback

// Is it undefined?
function und(v) {
	return typeof v == "undefined";
}

// Randomizers //

function getRandomInt(min, max, x) { // x is the interval
	if (und(x)) x = 1;
	min = Math.ceil(min / x);
	max = Math.floor(max / x);
	return (Math.floor(Math.random() * (max - min)) + min) * x;
}

function getRandomBoolean() {
	return Math.random() < 0.5;
}

// Konami code functionality //

var konamiCode;
var konamiProgress = 0;
function konami() {
	/*
	$("iframe").remove();
	$("canvas").remove();
	var ytUrl = "https://www.youtube.com/embed/" + "QH2-TGUlwu4" + "?autoplay=1&disablekb=1&rel=0&controls=0&start=" + 4;
	//$("#page").append("<iframe style=\"height:" + height + "px;width:" + width + "px;\" src=\"" + ytUrl + "\"></iframe>");
	$("#page").append($("<iframe/>")
		.css("height", height + "px")
		.css("width", width + "px")
		.attr("src", ytUrl)
	);
	*/
	$("#page").append($("<audio/>")
		.attr("preload", "auto")
		.attr("src", "assets/rickroll.mp3")
		.attr("autoplay", true)
		.attr("id", "rickroll")
	);
	$("#rickroll")[0].currentTime = 43;
}

/**
 * p5 setup
 * Use as startup function
 * Load images here
 */
function setup() {
	createCanvas(1024, 640);

	$("#copyright").append(" | " + authorList);
	$("#alt div").html("Loading game...");
	$("canvas").appendTo("#page");
	$("#footer").appendTo("#page");
	//$("#alt").css({"height": (height + "px"), "width": (width + "px")});
	//$("canvas").append("<div id=\"alt\">404<br/>Game resources not found</div>");

	konamiCode = [UP_ARROW, UP_ARROW, DOWN_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, LEFT_ARROW, RIGHT_ARROW, 66, 65];

	function loadPNG(s) {
		return loadImage("assets/" + s + ".png");
	}

	// Load a couple graphics
	imgTitle   = loadPNG("title");
	imgProsF   = loadPNG("char-pros-f");
	imgProsB   = loadPNG("char-pros-b");
	imgFerdF   = loadPNG("char-ferd-f");
	imgFerdB   = loadPNG("char-ferd-b");
	imgBarrel  = loadPNG("char-barrel");
	imgCrate   = loadPNG("char-crate");
	imgCoconut = loadPNG("char-coconut");
	imgRock    = loadPNG("char-rock");
	imgMap     = loadPNG("bg-beach");
	imgLvl0    = loadPNG("bg-lvl0");
	imgLvl1    = loadPNG("bg-lvl1");
	imgLvl2    = loadPNG("bg-lvl2");

	// Main character
	charMain = new Sprite(vect(0, 0), vect(48, 64), imgProsB, S_PLAYER);
	charMain.enclose = true;

	// Background
	setMap(2048, 1280, imgMap);

	level = new Level(0); // Get this party started!
}

/**
 * p5 loop
 */
function draw() {

	//background(0);

	// FIXME cheat code
	if (level.ending() || (keyIsDown(ESCAPE)) {
		level.next();
	}

	var l = level.id;

	for (var i = 0; i < charList.length; i++) {
		charList[i].ai();
	}

	if (l == 0) {
	} else if (l >= 1 && l < 10) { // Levels 1 & 2: downward scroll

		var speed = 4; // Player speed

		if (clunk) {
			var clunkiness = 4;
			speed *= timer % clunkiness == 0 ? clunkiness : 0;
		}

		// S // Down // Y++
		if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
			charMain.move(0, speed);
		}
		// W // Up // Y--
		if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
			charMain.move(0, -speed);
		}
		// D // Right // X++
		if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
			charMain.move(speed, 0);
		}
		// A // Left // X--
		if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
			charMain.move(-speed, 0);
		}

		lvlSpeed += (timer % 512 == 0) ? 1 : 0; // Every 512 ticks, increase the speed
		speed = lvlSpeed; // Map/running speed

		// Move the background down as charMain stays in the same place
		charMap.move(0, speed);
		charMain.move(0, -speed);

		if (charMap.pos.y + speed >= 0) { // If map is on bottom, jump up
			charMap.gotoY(height - charMap.size.y);
		}

		if (blowback > 0) { // Shoot backwards from barrel, decelerate
			charMain.move(0, blowback);
			blowback--;
		}

		// Sense if charMain is trapped in a sprite or something
		var needsBlowforth = charMain.getBottom() > height; // Initialize and sense if below canvas view
		for (var i = 0; i < charList.length; i++) {
			var c = charList[i];

			// Determine whether charMain is outside of the object
			var toLeft  = charMain.getRight()  <= c.getLeft();
			var toRight = charMain.getLeft()   >= c.getRight();
			var above   = charMain.getBottom() <= c.getTop();
			var below   = charMain.getTop()    >= c.getBottom();

			if (!(toLeft || toRight || above || below)) { // If it's inside, it needs help!
				needsBlowforth = true;
			}

		}

		if (needsBlowforth) { // If charMain us in danger,
			charMain.pos.y -= 16;   // jump up,
			blowback = 0;       // and stop flying backwards
			if (charMain.getLeft() % 64 > charMain.getRight() % 64) {
				if (charMain.getCenter().x % 64 >= 32) {
					charMain.pos.x -= charMain.getRight() - charMain.getCenter().x;
				} else {
					charMain.pos.x += charMain.getCenter().x - charMain.getLeft();
				}
			}
		}

	} else {

		var speed = 4; // Player speed

		if (clunk) {
			var clunkiness = 4;
			speed *= timer % clunkiness == 0 ? clunkiness : 0;
		}

		// A // Left // X--
		if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
			charMain.move(-speed, 0);
			if (!(charMain.getCenter().x > width / 2 || charMap.pos.x + speed > 0)) { // Is the map on the edge of the canvas?
				charMap.move(speed, 0); // If not, move the map and evrybody in charList[]
			}
		}
		// D // Right // X++
		if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
			charMain.move(speed, 0);
			if (!(charMain.getCenter().x < width / 2 || charMap.pos.x + charMap.size.x - speed < width)) {
				charMap.move(-speed, 0);
			}
		}
		// W // Up // Y--
		if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
			charMain.move(0, -speed);
			if (!(charMain.getCenter().y > height / 2 || charMap.pos.y + speed > 0)) {
				charMap.move(0, speed);
			}
		}
		// S // Down // Y++
		if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
			charMain.move(0, speed);
			if (!(charMain.getCenter().y < height / 2 || charMap.pos.y + charMap.size.y - speed < height)) {
				charMap.move(0, -speed);
			}
		}
	}

	level.draw();

	// Display level sprites, if a game level is on
	if (level.id > 0 && level.id < 10) {
		charMap.display();
		for (var i = 0; i < charList.length; i++ ) {
			charList[i].display();
		}
		charMain.display();
	}

	// Konami code
	if (keyIsPressed) {
		if (keyIsDown(konamiCode[konamiProgress])) {
			konamiProgress++;
		} else if (keyIsDown(konamiCode[konamiProgress - 1])) {
			// nothing
		} else {
			konamiProgress = 0;
		}
	}
	if (konamiProgress >= konamiCode.length) {
		konami();
		konamiProgress = 0;
	}

	timer++;
	lvlProgress += lvlSpeed;
	/*$("#dev").html(lvlSpeed + ", " + lvlProgress);
	$("#dev").append("<br/>");
	for (var i = 0; i < charList.length; i++) {
		$("#dev").append(i + ": " + charList[i].pos.y + ";&nbsp;&nbsp;&nbsp;&nbsp;");
	}*/

	// Indicate controls in lvl1
	if (timer % 32 < 16 && timer < 256 && level.id == 1) {
		var font = "Ubuntu Mono";
		var wasd = "WASD TO MOVE";
		var offset = 2;
		textSize(32);
		textFont(font);
		textAlign(CENTER);
		fill(0);
		text(wasd, width / 2 + offset, height - 32 + offset);
		fill(255);
		text(wasd, width / 2, height - 32);
	}

}

function setMap(x, y, img) {
	charMap = new Sprite(vect(0, 0), vect(x, y), img, S_MAP);
	charMap.gotoCenter(width / 2, height / 2);
	charMap.move = function(x, y) {
		if (this.getRight() + x >= width && this.getLeft() + x <= 0) {
			this.pos.x += x;
			for (var i = 0; i < charList.length; i++) {
				charList[i].pos.x += x;
			}
			charMain.pos.x += x;
		}
		if (this.getBottom() + y >= height && this.getTop() + y <= 0) {
			this.pos.y += y;
			for (var i = 0; i < charList.length; i++) {
				charList[i].pos.y += y;
			}
			charMain.pos.y += y;
		}
	}
}
