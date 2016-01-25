'use strict';

function QueueIterator(queue) {
	this._queue = queue;
}

QueueIterator.prototype.next = function() {
	if (!this._queue.isEmpty()) {
		return {
			value: this._queue.dequeue(),
			done: false
		};
	} else {
		return {
			done: true
		};
	}
};

function Queue() {
	this._members = [];
}

Queue.prototype.enqueue = function(item) {
	if (typeof item === 'undefined') {
		throw 'cannot enqueue `undefined`';
	}

	this._members.push(item);
};

Queue.prototype.dequeue = function() {
	if (this._members.length === 0) {
		return undefined;
	}

	return this._members.shift();
};

Queue.prototype.isEmpty = function() {
	return this._members.length === 0;
};

Queue.prototype[Symbol.iterator] = function() {
	return new QueueIterator(this);
}

module.exports = Queue;
