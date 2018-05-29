/*
 * Vectors, a simple coordinate interface
 * © 2018 Gramkraxor
 */


// object with x and y components
function Vector(x, y) {
	//if (!(this instanceof Vector)) return new Vector(x, y);
	this.x = isNaN(x)? 0 : x;
	this.y = isNaN(y)? 0 : y;
}

function vect(x, y) {
	return new Vector(x, y);
}

Vector.prototype.plus = function(v, y) {
	if (!(v instanceof Vector)) v = new Vector(v, y);
	return new Vector(this.x + v.x, this.y + v.y);
}

Vector.prototype.add = function(v, y) {
	let vNew = this.plus(v, y);
	this.x = vNew.x;
	this.y = vNew.y;
	return this;
}

Vector.prototype.times = function(n) {
	return new Vector(this.x * n, this.y * n);
}

Vector.prototype.scale = function(n) {
	let vNew = this.scale(n);
	this.x = vNew.x;
	this.y = vNew.y;
	return this;
}

Vector.prototype.length = function() {
	return Math.hypot(this.x, this.y);
}

Vector.dot = function(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y;
}

Vector.prototype.dot = function(v) {
	return Vector.dot(this, v);
}
