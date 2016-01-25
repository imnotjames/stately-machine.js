'use strict';

var List = require('./list');

function hasIntersect(a, b) {
	return a.filter(function(n) {
		return b.indexOf(n) != -1;
	}).length > 0;
}

function OrderedSet(members) {
	this._members = [];

	if (Array.isArray(members)) {
		for (var i = 0; i < members.length; i++) {
			this.add(members[i]);
		}
	}
}

OrderedSet.prototype.add = function(member) {
	if (typeof member === 'undefined') {
		throw 'cannot add `undefined`';
	}

	if (this.isMember(member)) {
		return;
	}

	this._members.push(member);
};

OrderedSet.prototype.delete = function(member) {
	var index = this._members.indexOf(member);

	if (index >= 0) {
		this._members.splice(index, 1);
	}
};

OrderedSet.prototype.union = function(set) {
	if (!(set instanceof OrderedSet)) {
		throw 'invalid set';
	}

	for (var i = 0; i < set._members.length; i++) {
		this.add(set._members[i]);
	}
};

OrderedSet.prototype.clear = function() {
	this._members.length = 0;
};

OrderedSet.prototype.contains = List.prototype.contains;

OrderedSet.prototype.isMember = OrderedSet.prototype.contains;

OrderedSet.prototype.some = List.prototype.some;

OrderedSet.prototype.every = List.prototype.every;

OrderedSet.prototype.hasIntersection = function(set) {
	if (!(set instanceof OrderedSet)) {
		throw 'invalid set';
	}

	return hasIntersect(this._members, set._members);
};

OrderedSet.prototype.isEmpty = List.prototype.isEmpty;

OrderedSet.prototype.toList = function() {
	return new List(this._members);
};

OrderedSet.prototype[Symbol.iterator] = List.prototype[Symbol.iterator];

Object.defineProperty(OrderedSet.prototype, "length", {
	get: function getLength() {
		return this._members.length;
	}
})

module.exports = OrderedSet;
