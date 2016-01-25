var expect = require('chai').expect;

var OrderedSet = require('../../src/data-types/ordered-set');

describe('OrderedSet', function() {
	describe('#add', function() {
		it('should add items', function() {
			var set = new OrderedSet();

			set.add('test');

			expect(set.length).to.equal(1);
		});

		it('should add duplicate items only once', function() {
			var expected = 'foo';

			var set = new OrderedSet();

			set.add(expected);
			set.add(expected);

			expect(set.length).to.equal(1);
		});

		it('should error on adding undefined items', function() {
			var set = new OrderedSet();

			expect(
				function() {
					set.add(undefined);
				}
			).to.throw();
		});
	});

	describe('#delete', function() {
		it('should delete an item', function() {
			var set = new OrderedSet([ 'foo', 'bar', 'baz' ]);
			var beforeLength = set.length;

			set.delete('baz');

			expect(set.length).to.be.below(beforeLength);
			expect(set.isMember('baz')).to.be.false;
		});

		it('should do nothing when item does not exist', function() {
			var set = new OrderedSet([ 'foo', 'bar' ]);
			var beforeLength = set.length;

			set.delete('baz');

			expect(set.length).to.equal(beforeLength);
		});
	});

	describe('#union', function() {
		it('should error when the parameter is not a set', function() {
			var set = new OrderedSet();

			expect(
				function() { set.union([ 'foo' ]); }
			).to.throw();

			expect(
				function() { set.union(); }
			).to.throw();
		});

		it('should add elements to the called set', function() {
			var setA = new OrderedSet([ 'foo', 'bar' ]);
			var setB = new OrderedSet([ 'baz' ]);

			setA.union(setB);

			expect(setA.length).to.equal(3);
			expect(setA.isMember('baz')).to.be.true;
		});

		it('should only modify the called set', function() {
			var setA = new OrderedSet([ 'foo', 'bar' ]);
			var setB = new OrderedSet([ 'baz' ]);

			var beforeLength = setB.length;

			setA.union(setB);

			expect(setB.length).to.equal(beforeLength);
			expect(setB.isMember('baz')).to.be.true;
		});
	});

	describe('#clear', function() {
		it('should clear items', function() {
			var set = new OrderedSet([ 'test' ]);
			expect(set.length).to.equal(1);
			set.clear();
			expect(set.length).to.equal(0);
		});

		it('should clear items even when empty', function() {
			var set = new OrderedSet();
			set.clear();
			expect(set.length).to.equal(0);
		});
	});

	describe('#isMember', function() {
		it('should be true for items that exist', function() {
			var expected = 'foo';
			var set = new OrderedSet([ expected ]);
			expect(set.isMember(expected)).to.be.true;
		});

		it('should be false for items that do not exist', function() {
			var set = new OrderedSet(['foo']);
			expect(set.isMember('bar')).to.be.false;
		});
	});

	describe('#some', function() {
		it('should error when predicate is invalid', function() {
			var set = new OrderedSet();

			expect(
				function() { set.some('invalid'); }
			).to.throw;
		});

		it('should return true when all items match predicate', function() {
			var set = new OrderedSet(['bar', 'boo', 'baz']);
			expect(
				set.some(function(e) { return e.indexOf('b') === 0; })
			).to.be.true;
		});

		it('should return true when not every item matches the predicate', function() {
			var set = new OrderedSet([ 'bar', 'foo', 'baz' ])

			expect(
				set.some(function(e) { return e.indexOf('b') === 0; })
			).to.be.true;
		});

		it('should return false when no item matches the predicate', function() {
			var set = new OrderedSet([ 'foo', 'far', 'faz' ])

			expect(
				set.some(function(e) { return e.indexOf('b') === 0; })
			).to.be.false;
		});
	});

	describe('#every', function() {
		it('should error when predicate is invalid', function() {
			var set = new OrderedSet();

			expect(
				function() { set.every('invalid'); }
			).to.throw;
		});

		it('should return true when all items match predicate', function() {
			var set = new OrderedSet([ 'boo', 'bar', 'baz' ]);
			expect(
				set.every(function(e) { return e.indexOf('b') === 0; })
			).to.be.true;
		});

		it('should return false when not every item matches the predicate', function() {
			var set = new OrderedSet([ 'bar', 'foo', 'baz' ])

			expect(
				set.every(function(e) { return e.indexOf('b') === 0; })
			).to.be.false;
		});

		it('should return false when no item matches the predicate', function() {
			var set = new OrderedSet([ 'foo', 'far', 'faz' ])

			expect(
				set.every(function(e) { return e.indexOf('b') === 0; })
			).to.be.false;
		});
	});

	describe('#hasIntersection', function() {
		it('should intersect with itself', function() {
			var set = new OrderedSet([ 'foo', 'bar' ]);

			expect(set.hasIntersection(set)).to.be.true;
		});

		it('should be true when all items intersect', function() {
			var setA = new OrderedSet([ 'foo', 'bar' ]);
			var setB = new OrderedSet([ 'foo', 'bar' ]);

			expect(setA.hasIntersection(setB)).to.be.true;
			expect(setB.hasIntersection(setA)).to.be.true;
		});

		it('should be true when some items intersect', function() {
			var setA = new OrderedSet([ 'foo', 'bar' ]);
			var setB = new OrderedSet([ 'bar', 'baz' ]);

			expect(setA.hasIntersection(setB)).to.be.true;
			expect(setB.hasIntersection(setA)).to.be.true;
		});

		it('should be false when no intersects exist', function() {
			var setA = new OrderedSet([ 'foo', 'far' ]);
			var setB = new OrderedSet([ 'boo', 'bar' ]);

			expect(setA.hasIntersection(setB)).to.be.false;
			expect(setB.hasIntersection(setA)).to.be.false;
		});
	});

	describe('#isEmpty', function() {
		it('should be true when no items are added', function() {
			var set = new OrderedSet();

			expect(set.isEmpty()).to.be.true;
		});

		it('should be false when items exist', function() {
			var set = new OrderedSet([ 'foo', 'bar' ]);

			set.delete('bar');

			expect(set.isEmpty()).to.be.false;
		});

		it('should be true when all items are deleted', function() {
			var set = new OrderedSet([ 'foo', 'bar' ]);

			set.delete('foo');
			set.delete('bar');

			expect(set.isEmpty()).to.be.true;
		})
	});

	describe('#toList', function() {
		it('should return a list with the same number of items', function() {
			var set = new OrderedSet([ 'foo', 'bar' ]);

			expect(set.toList().length).to.equal(set.length);
		});
	});

	describe('#@@iterator', function() {
		it('should iterate with a for loop', function() {
			var set = new OrderedSet([ 'foo', 'bar', 'baz' ]);

			var values = [];
			for (var value of set) {
				values.push(value);
			}

			expect(values).to.have.members([ 'foo', 'bar', 'baz' ]);
		});

		it('should not iterate the same item multiple times', function() {
			var set = new OrderedSet([ 'foo', 'foo', 'foo' ]);

			var iterator = set[Symbol.iterator]();

			expect(iterator.next().value).to.equal('foo');
			expect(iterator.next().done).to.be.true;
		});
	});
});
