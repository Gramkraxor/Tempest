/*
 * Calculus AB / Great World Texts: The Tempest
 * 
 * Tempest, a game by:
 * @author Owen Graham
 * @author Isaac Zaman
 * @author Justin Garza
 * @author Panya Xiong
 * @author Colemen Johnson
 */

var AUTHORS = [
	{name:"Owen Graham",  role:"Lead Code"},
	{name:"Isaac Zaman",  role:"Code"},
	{name:"Justin Garza", role:"Graphics"},
	{name:"Panya Xiong",  role:"Graphics"},
	{name:"Colemen \"CJ\" Johnson", role:"Troubleshooting"}
];

// Put AUTHORS into a string
var authorList = (function() {
	var r = "";
	for (var i = 0; i < AUTHORS.length; i++) {
		r += AUTHORS[i].name;
		r += (i < AUTHORS.length - 1) ? ", " : "";
	}
	return r;
})();

var clunk = false;   // Will the game use 8-bit movement?
var charList = [];   // Array of map-dependent sprites
var timer = 0;       // Counts game ticks defined by loops of draw()
var lvlSpeed = 0;    // Speed of level progression
var lvlProgress = 0; // Distance travelled
var blowback = 0;    // Barrel blowback

// Randomizers //

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomInt2(min, max, x) { // Random int with interval
	min = Math.ceil(min / x);
	max = Math.floor(max / x);
	return (Math.floor(Math.random() * (max - min)) + min) * x;
}

function getRandomBoolean() {
	return Math.floor(Math.random() * 2) == 1;
}

// Konami code functionality //

var konamiCode;
var konamiProgress = 0;
function konami() {
	$("iframe").remove();
	$("canvas").remove();
	var ytUrl = "https://www.youtube.com/embed/" + "QH2-TGUlwu4" + "?autoplay=1&disablekb=1&rel=0&controls=0&start=" + 4;
	$("#page").append("<iframe style=\"height:" + height + "px;width:" + width + "px;\" src=\"" + ytUrl + "\"></iframe>");
}

/**
 * p5 setup
 * Use as startup function
 * Load images here
 */
function setup() {
	createCanvas(1024, 640);
	
	$("#copyright").append(" | " + authorList);
	$("#alt div").html("Game resources unavailable.<br/>Is this page online?");
	$("canvas").appendTo("#page");
	$("#footer").appendTo("#page");
	//$("#alt").css({"height": (height + "px"), "width": (width + "px")});
	//$("canvas").append("<div id=\"alt\">404<br/>Game resources not found</div>");
	
	konamiCode = [UP_ARROW, UP_ARROW, DOWN_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, LEFT_ARROW, RIGHT_ARROW, 66, 65];
	
	// Load a couple graphics
	imgTitle   = loadImage("img/title.png");
	imgProsF   = loadImage("img/char-pros-f.png");
	imgProsB   = loadImage("img/char-pros-b.png");
	imgFerdF   = loadImage("img/char-ferd-f.png");
	imgFerdB   = loadImage("img/char-ferd-b.png");
	imgBarrel  = loadImage("img/char-barrel.png");
	imgCrate   = loadImage("img/char-crate.png");
	imgCoconut = loadImage("img/char-coconut.png");
	imgRock    = loadImage("img/char-rock.png");
	imgMap     = loadImage("img/bg-beach.png");
	imgLvl0    = loadImage("img/bg-lvl0.png");
	imgLvl1    = loadImage("img/bg-lvl1.png");
	imgLvl2    = loadImage("img/bg-lvl2.png");
	
	// Main character
	charMain = new Sprite(0, 0, 48, 64, imgProsB, S_PLAYER);
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
	
	if (level.ending() || (keyIsDown(ESCAPE) && level.id >=1 && level.id < 10)) {
		level.next();
	}
	
	var l = level.id;
	
	for (var i = 0; i < charList.length; i++) {
		charList[i].ai();
	}
	
	if (l == 0) {
	} else if (l >= 1 && l < 10) { // Level  & 21: downward scroll
		
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
		
		if (charMap.y + speed >= 0) { // If map is on bottom, jump up
			charMap.gotoY(height - charMap.height);
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
			charMain.y -= 16;   // jump up,
			blowback = 0;       // and stop flying backwards
			if (charMain.getLeft() % 64 > charMain.getRight() % 64) {
				if (charMain.getCenterX() % 64 >= 32) {
					charMain.x -= charMain.getRight() - charMain.getCenterX();
				} else {
					charMain.x += charMain.getCenterX() - charMain.getLeft();
				}
			}
			/*blowforth = 8;
			if (blowaside == 0) {
				blowaside = (32 - (charMain.getCenterX() % 64) / 2);
			}*/
		}
		
		/*if (blowforth > 0) {
			charMain.y -= blowforth;
			blowforth--;
			blowback = 0;
		}*/
		/*if (blowaside != 0) {
			if (blowaside > 0) {
				if (charMain.getRight() + blowaside <= 768) {
					charMain.x += blowaside;
					blowaside--;
				} else {
					charMain.gotoX(768 - charMain.width);
					blowaside = 0;
				}
			} else {
				if (charMain.getLeft() + blowaside >= 256) {
					charMain.x += blowaside;
					blowaside++;
				} else {
					charMain.gotoX(256);
					blowaside = 0;
				}
			}
		}*/
		
	} else {
		
		var speed = 4; // Player speed
		
		if (clunk) {
			var clunkiness = 4;
			speed *= timer % clunkiness == 0 ? clunkiness : 0;
		}
		
		// A // Left // X--
		if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
			charMain.move(-speed, 0);
			if (!(charMain.getCenterX() > width / 2 || charMap.x + speed > 0)) { // Is the map on the edge of the canvas?
				charMap.move(speed, 0);                                            // If not, move the map and evrybody in charList[]
			}
		}
		// D // Right // X++
		if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
			charMain.move(speed, 0);
			if (!(charMain.getCenterX() < width / 2 || charMap.x + charMap.width - speed < width)) {
				charMap.move(-speed, 0);
			}
		}
		// W // Up // Y--
		if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
			charMain.move(0, -speed);
			if (!(charMain.getCenterY() > height / 2 || charMap.y + speed > 0)) {
				charMap.move(0, speed);
			}
		}
		// S // Down // Y++
		if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
			charMain.move(0, speed);
			if (!(charMain.getCenterY() < height / 2 || charMap.y + charMap.height - speed < height)) {
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
	/*$("#c").html(lvlSpeed + ", " + lvlProgress);
	$("#c").append("<br/>");
	for (var i = 0; i < charList.length; i++) {
		$("#c").append(i + ": " + charList[i].y + ";&nbsp;&nbsp;&nbsp;&nbsp;");
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
	charMap = new Sprite(0, 0, x, y, img, S_MAP);
	charMap.gotoCenter(width / 2, height / 2);
	charMap.move = function(x, y) {
		if (this.getRight() + x >= width && this.getLeft() + x <= 0) {
			this.x += x;
			for (var i = 0; i < charList.length; i++) {
				charList[i].x += x;
			}
			charMain.x += x;
		}	
		if (this.getBottom() + y >= height && this.getTop() + y <= 0) {
			this.y += y;
			for (var i = 0; i < charList.length; i++) {
				charList[i].y += y;
			}
			charMain.y += y;
		}
	}
}
