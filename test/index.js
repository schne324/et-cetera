'use strict';
/*global assert*/
describe('etCetera', function () {
	var $test;
	var jQuery = window.jQuery;
	beforeEach(function () {
		jQuery('#fixture')
			.empty()
			.append(jQuery('<div class="test">foo-bar-baz</div>'));

		$test = jQuery('.test');
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
		
});