(function (jQuery) {
	'use strict';

	/**
	 * Clips an element's text and replaces
	 * the clipped portion with an ellipsis button
	 * 
	 * @param  {Object} options User's options
	 * @return {jQuery}          this	
	 */
	jQuery.fn.etCetera = function (userOptions) {
		var options = jQuery.extend({
			characters: 50, // can be a number or a function that returns characters to display
			buttonClass: 'ion-more',
			selectText: true
		}, userOptions);
		return this.each(function () {
			etc(this, options);
		});
	};

	function etc(el, options) {
		var $el = jQuery(el);

		var fullText = $el.text(); // cache all of the text
		var visibleText;

		// get the text to be displayed (without the clipped portion)
		if (typeof options.characters === 'function') {
			visibleText = options.characters($el.text());
		} else {
			visibleText = $el.text().substr(0, options.characters);
		}

		if (visibleText === fullText) { 
			// options.characters did not dictate any modification of the text
			if (options.selectText) {
				$el.on('click', function () {
					selectText(this);
				});
			}

			return; // no need to clip or add any sort of button...
		}

		// replace the full text with the calculated visible text
		$el.text(visibleText);

		// append the ellipsis button
		var $ellipsiBtn = jQuery('<button type="button" />');
		$ellipsiBtn.insertAfter($el);
		if (options.buttonClass) {
			$ellipsiBtn.addClass(options.buttonClass);
		}

		if (options.onClick) {
			$ellipsiBtn
				.off('click')
				.on('click', function () {
					options.onClick(this, fullText);
				});
		}
	}

	/**
	 * Selects the text of `element`
	 * @param  {HTMLElement} element the element in which the text will be selected/highlighted
	 */
	function selectText(element) {
		var range, selection;

		if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		} else if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
}(jQuery));
