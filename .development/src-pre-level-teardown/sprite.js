/*
 * Tempest 1
 * © 2018 Owen Graham
 */

// TODO Add vector system

// Sprite IDs (enum: values don't matter, as long as they're unique)
var S_DEFAULT = 0x1000;
var S_MAP     = 0x1001;
var S_PLAYER  = 0x1002;
var S_NPC     = 0x1003;
var S_BARREL  = 0x1004;
var S_CRATE   = 0x1005;
var S_COCONUT = 0x1006;
var S_ROCK    = 0x1007;

/**
 * Sprite constructor
 *
 * @param img Image loaded from setup()
 */
function Sprite(vPos, vSize, img, type) {

	this.contact = false;
	this.pos  = vPos;
	this.size = vSize;

	this.img = img;
	this.enclose = false;
	// relative positions to sprite's contact origin
	this.imgPos  = vect(0, 0);
	this.imgSize = vSize;

	this.color = "#000000";

	this.type = type;

	// Assign AI by sprite type
	if (this.type == S_BARREL || this.type == S_COCONUT) {
		this.ai = function() {
			this.pos.y += 2;

			// Is charMain to the barrel's left? Right?
			var toLeft  = this.getRight() <= charMain.getLeft();
			var toRight = this.getLeft()  >= charMain.getRight();
			var below   = this.getTop()   >= charMain.getBottom();

			// If charMain is touching from below, give him some blow
			if (!(toLeft || toRight || below) && charMain.getTop() <= this.getBottom()) {
				//if (blowforth == 0) {
				//charMain.pos.y = this.getBottom();
				blowback = 16; // Shoot the player back at this speed
				lvlSpeed = Math.floor(lvlSpeed * 2 / 3); // Slow down the level, but not to 0
				lvlSpeed += lvlSpeed < 1 ? 1 : 0;
				//}

			} else {
			}

			return this;
		}
	}

}

// Sprite position //

Sprite.prototype.getLeft = function() { return this.pos.x; }
Sprite.prototype.getRight = function() { return this.pos.x + this.size.x; }
Sprite.prototype.getTop = function() { return this.pos.y; }
Sprite.prototype.getBottom = function() { return this.pos.y + this.size.y; }
Sprite.prototype.getCenter = function() { return vect(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2); }

Sprite.prototype.getImgLeft = function() { return this.pos.x + this.imgPos.x; }
Sprite.prototype.getImgRight = function() { return this.pos.x + this.imgPos.x + this.imgSize.x; }
Sprite.prototype.getImgTop = function() { return this.pos.y + this.imgPos.y; }
Sprite.prototype.getImgBottom = function() { return this.pos.y + this.imgPos.y + this.imgSize.y; }

// Basic sprite movement //

Sprite.prototype.gotoX = function(x) { this.pos.x = x; return this; }
Sprite.prototype.gotoY = function(y) { this.pos.y = y; return this; }
Sprite.prototype.goto = function(v, y) {
	if (!(v instanceof Vector)) v = vect(v, y);
	return this.gotoX(v.x).gotoY(v.y);
}

Sprite.prototype.gotoCenterX = function(x) { this.pos.x = x - this.size.x / 2; return this; }
Sprite.prototype.gotoCenterY = function(y) { this.pos.y = y - this.size.y / 2; return this; }
Sprite.prototype.gotoCenter = function(v, y) {
	if (!(v instanceof Vector)) v = vect(v, y);
	return this.gotoCenterX(v.x).gotoCenterY(v.y);
}

Sprite.prototype.gotoMapX = function(x) { this.pos.x = charMap.pos.x + x; return this; }
Sprite.prototype.gotoMapY = function(y) { this.pos.y = charMap.pos.y + y; return this; }
Sprite.prototype.gotoMap = function(x, y) {
	if (!(v instanceof Vector)) v = vect(v, y);
	return this.gotoMapX(v.x).gotoMapY(v.y);
}

// *Fancy* sprite movement //

Sprite.prototype.move = function(v, y) {
	let x;
	if (v instanceof Vector) {
		x = v.x;
		y = v.y;
	} else {
		x = v;
	}

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

	this.pos.x += canMoveX ? x : 0;
	this.pos.y += canMoveY ? y : 0;

	return this;
}

Sprite.prototype.display = function() {
	/*if (this.img.width <= 1) {
		fill(this.color);
		noStroke();
		rect(this.getImgLeft(), this.getImgTop(), this.imgSize.x, this.imgSize.y);
		return;
	}*/
	image(this.img, this.getImgLeft(), this.getImgTop(), this.imgSize.x, this.imgSize.y);

	return this;
}

Sprite.prototype.ai = function() { return this; }
