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

// Sprite IDs (enum: values don't matter, as long as they're unique)
var S_A113    = 0;
var S_MAP     = 1;
var S_PLAYER  = 2;
var S_NPC     = 3;
var S_BARREL  = 4;
var S_CRATE   = 5;
var S_COCONUT = 6;
var S_ROCK    = 7;

/**
 * Sprite constructor
 * 
 * @param img Image loaded from setup()
 */
function Sprite(x, y, w, h, img, type) {
	
	this.contact = false;
	this.width = w;
	this.height = h;
	
	this.img = img;
	this.enclose = false;
	// Relative positions to sprite's contact origin
	this.imgX = 0;
	this.imgY = 0;
	this.imgWidth = w;
	this.imgHeight = h;
	
	this.color = (0, 0, 0);
	
	this.type = type;
	
	// Sprite position //
	
	this.getLeft = function() { return this.x; }
	this.getRight = function() { return this.x + this.width; }
	this.getTop = function() { return this.y; }
	this.getBottom = function() { return this.y + this.height; }
	this.getCenterX = function() {
		return this.x + this.width / 2;
	}
	this.getCenterY = function() { return this.y + this.height / 2; }
	
	this.getImgLeft = function() { return this.x + this.imgX; }
	this.getImgRight = function() { return this.x + this.imgX + this.imgWidth; }
	this.getImgTop = function() { return this.y + this.imgY; }
	this.getImgBottom = function() { return this.y + this.imgY + this.imgHeight; }
	
	// Basic sprite movement //
	
	this.gotoX = function(x) { this.x = x; return this; }
	this.gotoY = function(y) { this.y = y; return this; }
	this.goto = function(x, y) {
		this.gotoX(x);
		this.gotoY(y);
		return this;
	}
	
	this.gotoCenterX = function(x) { this.x = x - this.width / 2; return this; }
	this.gotoCenterY = function(y) { this.y = y - this.height / 2; return this; }
	this.gotoCenter = function(x, y) {
		this.gotoCenterX(x);
		this.gotoCenterY(y);
		return this;
	}
	
	this.gotoMapX = function(x) { this.x = charMap.x + x; return this; }
	this.gotoMapY = function(y) { this.y = charMap.y + y; return this; }
	this.gotoMap = function(x, y) {
		this.gotoMapX(x);
		this.gotoMapY(y);
		return this;
	}
	
	// *Fancy* sprite movement //
	
	this.move = function(x, y) {
		var canMoveX = true;
		var canMoveY = true;
		
		// Keep sprite inside of canvas
		if (this.enclose) {
			if ((this.getLeft() + x < 0 || this.getRight() + x > width) && (this.getLeft() >= 0 && this.getRight() <= width)) {
				canMoveX = false;
			}
			if ((this.getTop() + y < 0 || this.getBottom() + y > height) && (this.getTop() >= 0 && this.getBottom() <= height)) {
				canMoveY = false;
			}
			
			if (level.id >= 1 && level.id < 10) { // Keep charMain inside lvl1's narrow borders
				if (this.getLeft() + x < 256 || this.getRight() + x > 768) {
					canMoveX = false;
				}
			}
		}
		
		// Keep sprites from intersecting
		for (var i = 0; i < charList.length; i++) {
			var c = charList[i];
			
			// Note: This basic method of contact box movement will cause extremely thin objects to skip past each other
			
			// Determine whether the new position will be outside of the object
			var toLeft  = this.getRight()  + x <= c.getLeft();
			var toRight = this.getLeft()   + x >= c.getRight();
			var above   = this.getBottom() + y <= c.getTop();
			var below   = this.getTop()    + y >= c.getBottom();
			
			if (!(toLeft || toRight || above || below)) {
				canMoveX = false;
				canMoveY = false;
			}
			
		}
		
		this.x += canMoveX ? x : 0;
		this.y += canMoveY ? y : 0;
		
		return this;
	}
	
	this.display = function() {
		/*if (this.img.width <= 1) {
			fill(this.color);
			noStroke();
			rect(this.getImgLeft(), this.getImgTop(), this.imgWidth, this.imgHeight);
		} else*/
			image(this.img, this.getImgLeft(), this.getImgTop(), this.imgWidth, this.imgHeight);
			
			return this;
	}
	
	// Assign AI by sprite type
	if (this.type == S_BARREL || this.type == S_COCONUT) {
		this.ai = function() {
			this.y += 2;
			
			// Is charMain to the barrel's left? Right?
			var toLeft  = this.getRight() <= charMain.getLeft();
			var toRight = this.getLeft()  >= charMain.getRight();
			var below   = this.getTop()   >= charMain.getBottom();
			
			// If charMain is touching from below, give him some blow
			if (!(toLeft || toRight || below) && charMain.getTop() <= this.getBottom()) {
				//if (blowforth == 0) {
				//charMain.y = this.getBottom();
				blowback = 16; // Shoot the player back at this speed
				lvlSpeed = Math.floor(lvlSpeed * 2 / 3); // Slow down the level, but not to 0
				lvlSpeed += lvlSpeed < 1 ? 1 : 0;
				//}
				
			} else {
			}
			
			return this;
		}
	} else {
		this.ai = function() { return this; }
	}
	
	this.goto(x, y);
	
}
