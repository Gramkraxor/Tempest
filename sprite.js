/**
 * Calculus AB / Great World Texts: The Tempest
 * 
 * Tempest, a game by:
 * @author Owen Graham
 * @author Isaac Zaman
 * @author Justin Garza
 * @author Colemen Johnson
 * @author Panya Xiong
 */

/**
 * Sprite constructor
 * 
 * @param img Image loaded from setup()
 */
function Sprite(x, y, w, h, img) {
	
	this.img = img;
	this.enclose = false;
	this.width = w;
	this.height = h;
	
	this.getLeft = function() {
		return this.x;
	}
	this.getRight = function() {
		return this.x + this.width;
	}
	this.getTop = function() {
		return this.y;
	}
	this.getBottom = function() {
		return this.y + this.height;
	}
	this.getCenterX = function() {
		return this.x + this.width / 2;
	}
	this.getCenterY = function() {
		return this.y + this.height / 2;
	}
	
	this.contact = false;
	// Relative positions to sprite's origin
	this.contactX = 0;
	this.contactY = 0;
	this.contactWidth = w;
	this.contactHeight = h;
	this.getContactLeft = function() {
		return this.x + this.contactX;
	}
	this.getContactRight = function() {
		return this.x + this.contactX + this.contactWidth;
	}
	this.getContactTop = function() {
		return this.y + this.contactY;
	}
	this.getContactBottom = function() {
		return this.y + this.contactY + this.contactHeight;
	}
	
	this.gotoX = function(x) {
		this.x = x;
	}
	this.gotoY = function(y) {
		this.y = y;
	}
	this.goto = function(x, y) {
		this.gotoX(x);
		this.gotoY(y);
	}
	
	this.gotoCenterX = function(x) {
		this.x = x - this.width / 2;
	}
	this.gotoCenterY = function(y) {
		this.y = y - this.height / 2;
	}
	this.gotoCenter = function(x, y) {
		this.gotoCenterX(x);
		this.gotoCenterY(y);
	}
	
	this.gotoMapX = function(x) {
		this.x = charMap.x + x;
	}
	this.gotoMapY = function(y) {
		this.y = charMap.y + y;
	}
	this.gotoMap = function(x, y) {
		this.gotoMapX(x);
		this.gotoMapY(y);
	}
	
	this.move = function(x, y) {
		var canMoveX = true;
		var canMoveY = true;
		// Keep sprite inside of canvas
		if ((this.getLeft() + x < 0 || this.getRight() + x > width) && this.enclose) {
			canMoveX = false;
		}
		if ((this.getTop() + y < 0 || this.getBottom() + y > height) && this.enclose) {
			canMoveY = false;
		}
		
		// Keep sprites from intersecting
		for (var i = 0; i < charList.length; i++) {
			var c = charList[i];
			
			// Note: This basic method of contact box movement will cause extremely thin objects to skip past each other
			
			/*
			// Can this pass above or below other sprites?
			if (!(this.getContactBottom() + y <= c.getContactTop() || this.getContactTop() + y >= c.getContactBottom())) {
				// If not, will it go far enough to hit them?
				if (!(this.getContactRight() + x <= c.getContactLeft() || this.getContactLeft() + x >= c.getContactRight())) {
					//canMoveX = false;
				}
			}
			if (!(this.getContactBottom() + y <= c.getContactTop() || this.getContactTop() + y >= c.getContactBottom())) {
				if (!(this.getContactRight() + x <= c.getContactLeft() || this.getContactLeft() + x >= c.getContactRight())) {
					//canMoveY = false;
				}
			}
			//*/
			
			// Determine whether the new position will be outside of the object
			var toLeft  = this.getContactRight()  + x <= c.getContactLeft();
			var toRight = this.getContactLeft()   + x >= c.getContactRight();
			var above   = this.getContactBottom() + y <= c.getContactTop();
			var below   = this.getContactTop()    + y >= c.getContactBottom();
			
			/*/
			$("#footer").append(
				(this.getContactRight()  + x) + " <= " + c.getContactLeft()   + " = " + toLeft  + "<br>" +
				(this.getContactLeft()   + x) + " >= " + c.getContactRight()  + " = " + toRight + "<br>" +
				(this.getContactBottom() + y) + " <= " + c.getContactTop()    + " = " + above   + "<br>" +
				(this.getContactTop()    + y) + " >= " + c.getContactBottom() + " = " + below
				
			);
			//*/
			
			if (!(toLeft || toRight || above || below)) {
				canMoveX = false;
				canMoveY = false;
			}
			
		}
		
		if (canMoveX) {
			this.x += x;
		}
		if (canMoveY) {
			this.y += y;
		}
	}
	
	this.display = function() {
		try {
			image(this.img, this.x, this.y, this.width, this.height);
		} catch (e) {
		}
	}
	
	this.ai = function() {}
	
	this.goto(x, y);
	
}
