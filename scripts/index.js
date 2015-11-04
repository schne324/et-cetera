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
		buttonClass: 'ion-more'
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
		return; // no need to clip...
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
