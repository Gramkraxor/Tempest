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
 
 var next = 0;
 
 function fadeTo(l) {
 	level = new Level(999);
 	next = l;
 }

/**
 * Level constructor
 * Also used for cutscenes
 * 
 * @param l Level ID (int)
 */ 
function Level(l) { // Letter L, level ID
	
	this.id = l;
	
	this.draw = function() {
	}
	
	this.ending = function() { // When is the level over?
		return false;
	}
	
	this.next = function() { // What's after this level?
		charList = [];
	}
	
	// Initialize empty variable for += and .push()
	charList = [];
	timer = 0;
	lvlProgress = 0;
	lvlSpeed = 1;
	
	setMap(2048, 1280, imgMap);
	
	if (l == 0) { // Title sequence
		
		// Create the animation sprites
		charBg = new Sprite(0, 0, 1024, 640, imgLvl0, S_A113);
		charTitle = new Sprite(0, 0, 440, 280, imgTitle, S_A113).gotoCenter(width / 2, 280);
		
		this.draw = function() {
			
			// Draw the sprites
			charBg.display();
			charTitle.display();
			
			// Press start 2 p, but blink, but only if bg can render
			var font = "Ubuntu Mono";
			var ps2p = "PRESS START TO PLAY";
			var offset = 2;
			if (timer % 64 < 32 && charBg.img.width > 1) {
				textSize(32);
				textFont(font);
				textAlign(CENTER);
				fill(0);
				text(ps2p, width / 2 + offset, 480 + offset);
				fill(255);
				text(ps2p, width / 2, 480);
			}
		}
		
		this.ending = function() {
			return keyIsDown(32) || keyIsDown(ENTER);
		}
		
		this.next = function() {
			level = new Level(100);
		}
		
	} else if (l == 100) { // Scrolly text & 1st cutscenes
		
		var lineHeight = 36;
		var startHeight = height + 128;
		
		var scrolly = [
			"Two  months  ago,  right",
			"here, a  small  team  of",
			"elite  coders   began  a",
			"quest  to  assemble  for",
			"the  conference  of  the",
			"GREAT WORLD TEXTS a most",
			"impressive game.        ",
			"",
			"4  hours  ago,  not  far",
			"away,    TEMPEST     was",
			"completed;   the   story",
			"begins as follows:      ",
			"",
			"",
			"Long  ago, on  an island",
			"far,   far    away,  the",
			"exiled  wizard  PROSPERO",
			"schemed and plotted from",
			"the depths of his jungle",
			"a dastardly  revenge  of",
			"great  manipulation. The", 
			"sorcerer     sent    his",
			"minions to fell  a  ship",
			"unto  his   domain,  its",
			"passengers the rulers of",
			"his past kingdom.       ",
			"",
			"",
			"A wicked storm whips the",
			"ship closer  and  closer",
			"to  capsizing! The  crew",
			"fights it  with  all  of",
			"their    strength    and",
			"skill, only  to  be  met",
			"with  their   inevitable",
			"doom.                   ",
			"",
			"As  calamity  strikes, a",
			"lone  prince  is trapped",
			"in  the  bowels  of  the",
			"ship!  As   the   vessel",
			"sinks,         Ferdinand",
			"scrambles        through",
			"towards  the surface...."
		];
		
		this.draw = function() {
			background(0);
			textSize(32);
			textFont("Ubuntu Mono");
			textStyle(BOLD);
			textAlign(CENTER);
			fill(255, 255, 0);
			for (var i = 0; i < scrolly.length; i++) {
				text(scrolly[i], width / 2, startHeight + i * lineHeight);
			}
			startHeight--;
		}
		
		this.ending = function() {
			return startHeight + scrolly.length * lineHeight < 0 || keyIsDown(87);
		}
		
		this.next = function() {
			level = new Level(1);
		}
		
	} else if (l == 1) { // Level 1
		charList = [];
		
		charMain.img = imgFerdB;
		charMain.gotoCenter(width / 2, 480);
		
		// change the map to lvl1 configuration
		setMap(1024, 1280, imgLvl1);
		charMap.display = function() {
			image(this.img, this.getImgLeft(), this.getImgTop(), this.imgWidth, this.imgHeight / 2);
			image(this.img, this.getImgLeft(), this.getImgTop() + this.imgHeight / 2, this.imgWidth, this.imgHeight / 2);
		}
		
		this.draw = function() {
			if (lvlProgress % 72 < lvlSpeed) {
				var amount = getRandomInt(1, 4); // How many sprites to load?
				var poss = []; // Positions
				/*for (var i = 0; i < amount; i++) {
					var v = getRandomInt2(256, width - 256 - 64, 64);
					var b = false;
					for (var j = 0; j < amount; j++) {
					}
					if (b) {
						poss.push(v);
					}
				}*/
				
				// Generate sprites at 32px intervals above the canvas, between x=256 and x=768
				charList.push(new Sprite(getRandomInt2(256, width - 256, 64), -64, 64, 64, imgBarrel, S_BARREL));
				charList.push(new Sprite(getRandomInt2(256, width - 256, 64), -64, 64, 64, imgCrate, S_CRATE));
				
				for (var i = charList.length - 1; i >= 0; i--) {
					var ch = charList[i];
					if (ch.y > height * 2) { // Is the sprite too far down?
						charList.splice(i, 1); // Take it out
					}
				}
			}
			//$("#title").html(timer + " % 64 = " + (timer % 64));
		}
		
		this.ending = function() {
			return lvlProgress >= 4096;
		}
		this.next = function() {
			fadeTo(101);
		}
		
	} else if (l == 101) { // Cutscene 1
		
		var lineHeight = 36;
		var startHeight = height + 128;
		
		var scrolly = [
			"The nobles of the  boat,",
			"surprisedly alive, awake",
			"on   the    island    of",
			"Prospero. They have been",
			"scattered across foreign",
			"beaches.     A     grief",
			"stricken king, two fools",
			"with a  bottle of  wine,",
			"a   traitor,   a   royal",
			"seeking  a  dark   path,",
			"and the missing prince. ",
			"",
			"The    great    sorcerer",
			"commences his  scheme to",
			"bond the prince and  his",
			"own  daughter,  Miranda.",
			"With them love stricken,",
			"he  must  also surrender",
			"his wizardry if he is to",
			"return  to his  home. He",
			"makes  his  way  through",
			"the jungle to  meet  the",
			"castaways   and  abandon",
			"his magic....           "
		];
		
		this.draw = function() {
			background(0);
			textSize(32);
			textFont("Ubuntu Mono");
			textStyle(BOLD);
			textAlign(CENTER);
			fill(255, 255, 0);
			for (var i = 0; i < scrolly.length; i++) {
				text(scrolly[i], width / 2, startHeight + i * lineHeight);
			}
			startHeight--;
		}
		
		this.ending = function() {
			return startHeight + scrolly.length * lineHeight < 0 || keyIsDown(87);
		}
		
		this.next = function() {
			level = new Level(2);
		}
		
	} else if (l == 2) { // Level 2
		
		charList = [];
		
		charMain.img = imgProsB;
		charMain.gotoCenter(width / 2, 480);
		
		// change the map to lvl1 configuration
		setMap(1024, 1280, imgLvl2);
		charMap.display = function() {
			image(this.img, this.getImgLeft(), this.getImgTop(), this.imgWidth, this.imgHeight / 2);
			image(this.img, this.getImgLeft(), this.getImgTop() + this.imgHeight / 2, this.imgWidth, this.imgHeight / 2);
		}
		
		this.draw = function() {
			if (lvlProgress % 72 < lvlSpeed) {
				var amount = getRandomInt(1, 4); // How many sprites to load?
				var poss = []; // Positions
				/*for (var i = 0; i < amount; i++) {
					var v = getRandomInt2(256, width - 256 - 64, 64);
					var b = false;
					for (var j = 0; j < amount; j++) {
					}
					if (b) {
						poss.push(v);
					}
				}*/
				
				// Generate sprites at 32px intervals above the canvas, between x=256 and x=768
				charList.push(new Sprite(getRandomInt2(256, width - 256, 64), -64, 64, 64, imgCoconut, S_COCONUT));
				charList.push(new Sprite(getRandomInt2(256, width - 256, 64), -64, 64, 64, imgRock, S_ROCK));
				
				for (var i = charList.length - 1; i >= 0; i--) {
					var ch = charList[i];
					if (ch.y > height * 2) { // Is the sprite too far down?
						charList.splice(i, 1); // Take it out
					}
				}
			}
			//$("#title").html(timer + " % 64 = " + (timer % 64));
		}
		
		this.ending = function() {
			return lvlProgress >= 4096;
		}
		this.next = function() {
			fadeTo(102);
		}
		
	} else if (l == 102) { // Cutscene 2
		
		var lineHeight = 36;
		var startHeight = height + 128;
		
		var scrolly = [
			"And so, Prospero, having",
			"made  his peace and  his",
			"reputation     restored,",
			"along  with all  who had",
			"washed up  to the island",
			"of  Sycorax,  leave  for",
			"Milan. So  concludes the",
			"story of the Tempest.   "
		];
		
		this.draw = function() {
			background(0);
			textSize(32);
			textFont("Ubuntu Mono");
			textStyle(BOLD);
			textAlign(CENTER);
			fill(255, 255, 0);
			for (var i = 0; i < scrolly.length; i++) {
				text(scrolly[i], width / 2, startHeight + i * lineHeight);
			}
			startHeight--;
		}
		
		this.ending = function() {
			return startHeight + scrolly.length * lineHeight < 0 || keyIsDown(87);
		}
		
		this.next = function() {
			level = new Level(99);
		}
		
	} else if (l == 99) { // End
		
		var lineHeight = 36;
		
		var scrolly = [ "Tempest, a game by:" ];
		for (var i = 0; i < AUTHORS.length; i++) {
			var a = AUTHORS[i];
			scrolly.push(a.name + ".".repeat(40 - a.name.length - a.role.length) + a.role);
		}
		scrolly.push("Great World Texts 2016-2017");
		
		var textHeight = 0;
		for (var i = 0; i < scrolly.length; i++) {
			textHeight += lineHeight;
		}
		var startHeight = (height - textHeight) / 2;
		
		this.draw = function() {
			background(0);
			textSize(24);
			textFont("Ubuntu Mono");
			textStyle(NORMAL);
			textAlign(CENTER);
			fill(timer > 255 ? 255 : timer);
			for (var i = 0; i < scrolly.length; i++) {
				text(scrolly[i], width / 2, startHeight + i * lineHeight);
			}
		}
		
		this.ending = function() {
			return false;
		}
		
		this.next = function() {
		}
		
	} else if (l == 999) { // Fader
		
		this.draw = function() {
			background(0, 0, 0, Math.ceil(timer / 2));
		}
		
		this.ending = function() {
			return timer >= 64;
		}
		
		this.next = function() {
			level = new Level(next);
		}
		
	} else { // Default
	}
	
}
