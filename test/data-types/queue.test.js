'use strict';

var expect = require('chai').expect;

var Queue = require('../../src/data-types/queue');

describe('Queue', function() {
	describe('#enqueue()', function() {
		it('should enqueue an element', function() {
			var q = new Queue();
			q.enqueue('foo');
		});

		it('should not enqueue undefined', function() {
			var q = new Queue();
			expect(
				function() {
					q.enqueue(undefined);
				}
			).to.throw();
		});

		it('should enqueue multiple elements', function() {
			var q = new Queue();
			q.enqueue('foo');
			q.enqueue('bar');
		});
	});

	describe('#dequeue()', function() {
		it('should return undefined when no elements have been queued', function() {
			var q = new Queue();

			expect(q.dequeue()).to.be.undefined;
		});

		it('should dequeue items on the queue', function() {
			var expected = 'test';

			var q = new Queue();
			q.enqueue(expected);

			expect(q.dequeue()).to.equal(expected);
		});

		it('should dequeue the elements in the order that they are queued', function() {
			var expectedA = 'foo';
			var expectedB = 'bar';

			var q = new Queue();

			q.enqueue(expectedA);
			q.enqueue(expectedB);

			expect(q.dequeue()).to.equal(expectedA);
			expect(q.dequeue()).to.equal(expectedB);
			expect(q.dequeue()).to.be.undefined;
		});
	});

	describe('#isEmpty()', function() {
		it('should return true when there are no items in the queue', function() {
			var q = new Queue();
			expect(q.isEmpty()).to.be.true;
		});

		it('should return false when items have been queued', function() {
			var q = new Queue();
			q.enqueue('foo');

			expect(q.isEmpty()).to.be.false;
		});
	});

	describe('#@@iterator', function() {
		it('should iterate with for..of', function() {
			var q = new Queue();
			q.enqueue('foo');
			q.enqueue('bar');

			var values = [];
			for (var item of q) {
				values.push(item);
			}

			expect(values).to.have.members([ 'foo', 'bar' ]);
		});

		it('should exhaust the queue', function() {
			var q = new Queue();
			q.enqueue('foo');

			var iterator = q[Symbol.iterator]();

			iterator.next();

			expect(q.isEmpty()).to.be.true;
		});

		it('should iterate in the correct order', function() {
			var q = new Queue();
			q.enqueue('foo');
			q.enqueue('bar');

			var iterator = q[Symbol.iterator]();

			expect(iterator.next().value).to.equal('foo');
			expect(iterator.next().value).to.equal('bar');
			expect(iterator.next().done).to.be.true;
		});

		it('should populate correctly if more is enqueued', function() {
			var q = new Queue();
			q.enqueue('foo');
			q.enqueue('bar');

			var iterator = q[Symbol.iterator]();

			expect(iterator.next().value).to.equal('foo');
			expect(iterator.next().value).to.equal('bar');
			expect(iterator.next().done).to.be.true;

			q.enqueue('baz');

			expect(iterator.next().value).to.equal('baz');
			expect(iterator.next().done).to.be.true;

			q.enqueue('foo');
			q.enqueue('bar');


			expect(iterator.next().value).to.equal('foo');
			q.enqueue('baz');
			expect(iterator.next().value).to.equal('bar');
			expect(iterator.next().value).to.equal('baz');
			expect(iterator.next().done).to.be.true;
		})
	});
});
