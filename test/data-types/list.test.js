var expect = require('chai').expect;

var List = require('../../src/data-types/list');

describe('List', function() {
	describe('#add', function() {
		it('should add items', function() {
			var list = new List();

			list.add('test');

			expect(list.length).to.equal(1);
		});

		it('should add duplicate items only once', function() {
			var expected = 'foo';

			var list = new List();

			list.add(expected);
			list.add(expected);

			expect(list.length).to.equal(1);
		});

		it('should error on adding undefined items', function() {
			var list = new List();

			expect(
				function() {
					list.add(undefined);
				}
			).to.throw();
		});
	});

	describe('#delete', function() {
		it('should delete an item', function() {
			var list = new List([ 'foo', 'bar', 'baz' ]);
			var beforeLength = list.length;

			list.delete('baz');

			expect(list.length).to.be.below(beforeLength);
			expect(list.isMember('baz')).to.be.false;
		});

		it('should do nothing when item does not exist', function() {
			var list = new List([ 'foo', 'bar' ]);
			var beforeLength = list.length;

			list.delete('baz');

			expect(list.length).to.equal(beforeLength);
		});
	});

	describe('#get', function() {
		it('should get items', function() {
			var list = new List([ 'foo', 'bar' ]);

			expect(list.get(0)).to.equal('foo');
			expect(list.get(1)).to.equal('bar');
		});

		it('should return undefined for non-existant values', function() {
			var list = new List([ 'foo', 'bar' ])
			expect(list.get(2)).to.be.undefined;
		});
	});

	describe('#head', function() {
		it('should return the first item', function() {
			var list = new List([ 'foo', 'bar' ]);

			expect(list.head()).to.equal('foo');
		});

		it('should return undefined if empty', function() {
			var list = new List();

			expect(list.head()).to.be.undefined;
		});
	});

	describe('#tail', function() {
		it('should return everything but the first', function() {
			var list = new List([ 'foo', 'bar', 'baz' ]);

			expect(list.tail()).to.have.members([ 'bar', 'baz' ]);
			expect(list.tail()).to.not.have.members([ 'foo' ]);
		});

		it('should return an empty array when there are not enough', function() {
			var listA = new List([ 'foo' ]);
			var listB = new List();

			expect(listA.tail()).to.be.empty;
			expect(listB.tail()).to.be.empty;
		})
	});

	describe('#append', function() {
		it('should return a list with the contents of the sources', function() {
			var listA = new List([ 'foo' ]);
			var listB = new List([ 'bar' ]);

			var listC = listA.append(listB);
			var listD = listB.append(listA);

			expect(listC.length).to.equal(2);
			expect(listC.contains('foo')).be.true;
			expect(listC.contains('bar')).be.true;

			expect(listD.length).to.equal(2);
			expect(listD.contains('foo')).to.be.true;
			expect(listD.contains('bar')).to.be.true;
		});

		it('should not affect the source lists', function() {
			var listA = new List([ 'foo' ]);
			var listB = new List([ 'bar' ]);

			listA.append(listB);

			expect(listA.length).to.equal(1);
			expect(listA.get(0)).to.equal('foo');

			expect(listB.length).to.equal(1);
			expect(listB.get(0)).to.equal('bar');
		});
	});

	describe('#filter', function() {
		it('should return a list without the filtered items', function() {
			var list = new List([ 'foo', 'bar', 'baz' ]);

			var newList = list.filter(function(e) {
				return e.indexOf('b') === 0;
			});

			expect(newList.length).to.equal(2);

			var values = [];
			values.push(newList.get(0));
			values.push(newList.get(1));

			expect(values).to.have.members([ 'bar', 'baz' ]);
		});

		it('should not affect the source list', function() {
			var list = new List([ 'foo' ]);

			var newList = list.filter(function() { return false; });

			expect(newList.length).to.equal(0);
			expect(list.length).to.equal(1);
		});

		it('should error on an invalid predicate', function() {
			var list = new List();

			expect(function() { list.filter(); }).to.throw;
			expect(function() { list.filter('invalid'); }).to.throw;
		});
	});

	describe('#some', function() {
		it('should error when predicate is invalid', function() {
			var list = new List();

			expect(
				function() { list.some('invalid'); }
			).to.throw;
		});

		it('should return true when all items match predicate', function() {
			var list = new List(['bar', 'boo', 'baz']);
			expect(
				list.some(function(e) { return e.indexOf('b') === 0; })
			).to.be.true;
		});

		it('should return true when not every item matches the predicate', function() {
			var list = new List([ 'bar', 'foo', 'baz' ])

			expect(
				list.some(function(e) { return e.indexOf('b') === 0; })
			).to.be.true;
		});

		it('should return false when no item matches the predicate', function() {
			var list = new List([ 'foo', 'far', 'faz' ])

			expect(
				list.some(function(e) { return e.indexOf('b') === 0; })
			).to.be.false;
		});
	});

	describe('#every', function() {
		it('should error when predicate is invalid', function() {
			var list = new List();

			expect(
				function() { list.every('invalid'); }
			).to.throw;
		});

		it('should return true when all items match predicate', function() {
			var list = new List([ 'boo', 'bar', 'baz' ]);
			expect(
				list.every(function(e) { return e.indexOf('b') === 0; })
			).to.be.true;
		});

		it('should return false when not every item matches the predicate', function() {
			var list = new List([ 'bar', 'foo', 'baz' ])

			expect(
				list.every(function(e) { return e.indexOf('b') === 0; })
			).to.be.false;
		});

		it('should return false when no item matches the predicate', function() {
			var list = new List([ 'foo', 'far', 'faz' ])

			expect(
				list.every(function(e) { return e.indexOf('b') === 0; })
			).to.be.false;
		});
	});

	describe('#isEmpty', function() {
		it('should be true when no items are added', function() {
			var list = new List();

			expect(list.isEmpty()).to.be.true;
		});

		it('should be false when items exist', function() {
			var list = new List([ 'foo', 'bar' ]);

			list.delete('bar');

			expect(list.isEmpty()).to.be.false;
		});

		it('should be true when all items are deleted', function() {
			var list = new List([ 'foo', 'bar' ]);

			list.delete('foo');
			list.delete('bar');

			expect(list.isEmpty()).to.be.true;
		})
	});

	describe('#@@iterator', function() {
		it('should iterate with a for loop', function() {
			var list = new List([ 'foo', 'bar', 'baz' ]);

			var values = [];
			for (var value of list) {
				values.push(value);
			}

			expect(values).to.have.members([ 'foo', 'bar', 'baz' ]);
		});

		it('should iterate the same item multiple times', function() {
			var list = new List([ 'foo', 'foo', 'foo' ]);

			var iterator = list[Symbol.iterator]();

			expect(iterator.next().value).to.equal('foo');
			expect(iterator.next().value).to.equal('foo');
			expect(iterator.next().value).to.equal('foo');
			expect(iterator.next().done).to.be.true;
		});
	});
});
