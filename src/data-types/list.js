'use strict';

function ValueIterator(members) {
	this._members = members;
	this._index = 0;
}

ValueIterator.prototype.next = function() {
	if (this._index < this._members.length) {
		return {
			value: this._members[this._index++],
			done: false
		};
	} else {
		return {
			done: true
		};
	}
}

function List(members) {
	this._members = members || [];
}

List.prototype.get = function(index, defaultValue) {
	if (index < 0 || index > this._members.length) {
		return defaultValue;
	}

	return this._members[index];
};

List.prototype.add = function(member) {
	if (typeof member === 'undefined') {
		throw 'cannot add `undefined`';
	}

	if (this.isMember(member)) {
		return;
	}

	this._members.push(member);
};
List.prototype.delete = function(member) {
	var index = this._members.indexOf(member);

	if (index >= 0) {
		this._members.splice(index, 1);
	}
};

List.prototype.contains = function(member) {
	return this._members.indexOf(member) >= 0;
};

List.prototype.isMember = List.prototype.contains;

List.prototype.head = function() {
	if (this._members.length === 0) {
		return undefined;
	}

	return this._members[0];
};

List.prototype.tail = function() {
	return this._members.slice(1);
};

List.prototype.append = function(list) {
	if (!(list instanceof List)) {
		throw "invalid list";
	}

	return new List(this._members.concat(list._members));
};

List.prototype.filter = function(predicate) {
	if (typeof predicate !== 'function') {
		throw 'invalid predicate';
	}

	return new List(this._members.filter(predicate));
};

/**
 * Returns true if some element in the list satisfies the predicate f.
 * Returns false for an empty list.
 */
List.prototype.some = function(predicate) {
	if (typeof predicate !== 'function') {
		throw 'invalid predicate';
	}

	for (var i = 0; i < this._members.length; i++) {
		if (predicate(this._members[i])) {
			return true;
		}
	}

	return false;
};

/**
 * Returns true if every element in the list satisfies the predicate f.
 * Returns true for an empty list.
 */
List.prototype.every = function(predicate) {
	if (typeof predicate !== 'function') {
		throw 'invalid predicate';
	}

	for (var i = 0; i < this._members.length; i++) {
		if (!predicate(this._members[i])) {
			return false;
		}
	}

	return true;
};

List.prototype.isEmpty = function() {
	return this._members.length === 0;
};

List.prototype[Symbol.iterator] = function() {
	return new ValueIterator(this._members);
}

Object.defineProperty(List.prototype, "length", {
	get: function getLength() {
		return this._members.length;
	}
})

module.exports = List;
