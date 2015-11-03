'use strict';

/**
 * Clips an element's text and replaces
 * the clipped portion with an ellipsis button
 * 
 * @param  {Number|Function} userMaxLength A number of characters to accept |or| a function that returns the clipped string
 * @return {jQuery}          this	
 */
jQuery.fn.etCetera = function (userMaxLength) {
	return this.each(function () {
		etc(this, userMaxLength);
	});
};

function etc(el, userMaxLength) {
	var maxLen = userMaxLength || 50;

	var $el = jQuery(el);

	var fullText = $el.text(); // cache all of the text
	var visibleText;

	// get the text to be displayed (without the clipped portion)
	if (typeof maxLen === 'function') {
		visibleText = maxLen($el.text());
	} else {
		visibleText = $el.text().substr(0, maxLen);
	}

	if (visibleText === fullText) {
		return; // no need to clip...
	}

	// replace the full text with the calculated visible text
	$el.text(visibleText);

	// append the ellipsis button
	var $ellipsiBtn = jQuery('<button />').addClass('ion-more');
	$ellipsiBtn.insertAfter($el);

	// show the full text
	$ellipsiBtn.on('click', function () {
		console.log(fullText);
	});
}
