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

	it('should add the button if theres stuff to clip', function () {
		$test.etCetera({ characters: 2 });
		assert.equal(1, $test.next().length);
		assert.isTrue($test.next().is('button'));
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
		it('should add the provided class to the trigger', function () {
			$test.etCetera({
				buttonClass: 'foo-boo',
				characters: 3
			});

			var $trig = $test.next();
			assert.equal($trig.length, 1);
			assert.isTrue($test.next().hasClass('foo-boo'));
		});

		it('should default to "ion-more"', function () {
			$test.etCetera({
				characters: 3
			});

			var $trig = $test.next();
			assert.equal($trig.length, 1);
			assert.isTrue($test.next().hasClass('ion-more'));
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

	describe('`options.buttonLabel`', function () {
		it('should add the provided text as the aria-label for the ellipsis button', function () {
			var buttonText = 'First, Research, Educate, Decide';
			$test.etCetera({ characters: 5, buttonClass: 'fred', buttonLabel: buttonText });
			assert.equal($test.next('.fred').length, 1);
			assert.equal($test.next('.fred').attr('aria-label'), buttonText);
		});

		it('should not add an aria-label to the ellipsis button by default', function () {
			$test.etCetera({ characters: 5, buttonClass: 'cold-brew' });
			assert.equal($test.next('.cold-brew').length, 1);
			assert.isUndefined($test.next('.cold-brew').attr('aria-label'));
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
