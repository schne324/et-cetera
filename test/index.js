'use strict';

describe('etCetera', function () {
	var $test;
	var jQuery = window.jQuery;
	beforeEach(function () {
		var $fixture = jQuery('#fixture');
		$fixture
			.empty()
			.append(jQuery('<div class="test">foo-bar-baz</div>'));

		$test = $fixture.find('.test');
	});

	after(function () {
		jQuery('#fixture').empty();
	});

	it('should chain', function () {
		assert($test.etCetera().addClass('foo'));
	});

	it('should not add the button if the there is nothing to clip off', function () {
		$test.etCetera();
		assert.equal(0, $test.next().length);
	});

	it('should add the button if theres stuff to clip', function (done) {
		$test.etCetera({ characters: 2 });
		setTimeout(function () {
			assert.equal(1, $test.next().length);
			assert.isTrue($test.next().is('button'));
			done();
		});
	});

	describe('`options.characters`', function () {
		describe('as a number', function () {
			it('should clip properly', function () {
				$test.etCetera({
					characters: 3
				});

				assert.equal('foo', $test.text());
			});
		});

		describe('as a function', function () {
			it('should pass the full text as param', function () {
				$test.etCetera({
					characters: function (text) {
						assert.equal('foo-bar-baz', text);
					}
				});
			});

			it('should clip properly (function)', function () {
				$test.etCetera({
					characters: function (text) {
						return text.substr(0, text.lastIndexOf('-'));
					}
				});

				assert.equal('foo-bar', $test.text());
			});
		});
	});

	describe('`options.onClick`', function () {
		it('should pass the trigger and the full text in as the params', function (done) {
			$test.etCetera({
				characters: 3,
				onClick: function (trigger, text) {
					assert.isTrue(jQuery(trigger).is('.ion-more'));
					assert.equal(text, 'foo-bar-baz');
					done();
				}
			});
			setTimeout(function () {
				jQuery('.ion-more').trigger('click');
			});

		});
	});

	describe('`options.buttonClass`', function () {
		it('should add the provided class to the trigger', function (done) {
			$test.etCetera({
				buttonClass: 'foo-boo',
				characters: 3
			});

			setTimeout(function () {
				var $trig = $test.next();
				assert.equal($trig.length, 1);
				assert.isTrue($test.next().hasClass('foo-boo'));
				done();
			});
		});

		it('should default to "ion-more"', function (done) {
			$test.etCetera({
				characters: 3
			});

			setTimeout(function () {
				var $trig = $test.next();
				assert.equal($trig.length, 1);
				assert.isTrue($test.next().hasClass('ion-more'));
				done();
			});
		});
	});

	// unfortunately, phantom doesn't support certain DOM
	// methods such as window.getSelection so we can only
	// run this test if it is being run in browser
	describe('`options.selectText`', function () {
		if (window.mochaPhantomJS) {
			it('should select text on click if text not clipped', function (done) {
				$test.etCetera({
					selectText: true,
					characters: 9999
				});

				$test.trigger('click');

				setTimeout(function () {
					assert.equal(getSelectionText(), 'foo-bar-baz');
					done();
				});
			});
		} else {
			it('can only run this test when running in a browser (run open `test/index.html`)');
		}
	});


	describe('`options.insertAs`', function () {
			describe('nextSibling', function () {
				it('should insert the button as the next sibling of the text element', function () {
					$test.etCetera({ insertAs: 'nextSibling', buttonClass: 'monkeys', characters: 5 });
					assert.isTrue($test.next().hasClass('monkeys'));
				});

				it('should default to nextSibling', function () {
					$test.etCetera({ buttonClass: 'boognish', characters: 5 });
					assert.isTrue($test.next().hasClass('boognish'));
				});
			});

			describe('prevSibling', function () {
				it('should insert the button as the previous sibling of the text element', function () {
					$test.etCetera({ insertAs: 'prevSibling', characters: 5, buttonClass: 'salsa' });
					assert.isTrue($test.prev().hasClass('salsa'));
				});
			});

			describe('firstChild', function () {
				it('should insert the button as the first child of the text element', function () {
					$test.etCetera({ insertAs: 'firstChild', characters: 5, buttonClass: 'cornmeal' });
					assert.isTrue($test.children().first().hasClass('cornmeal'));
				});
			});

			describe('lastChild', function () {
				it('should insert the button as the last child of the text element', function () {
					$test.etCetera({ insertAs: 'lastChild', characters: 5, buttonClass: 'bears' });
					assert.isTrue($test.children().last().hasClass('bears'));
				});
			});
	});
});

function getSelectionText() {
	var text = '';
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != 'Control') {
		text = document.selection.createRange().text;
	}
	return text;
}
