# Et Cetera

* Et Cetera will ellipsis-ify an element's text by clipping off desired portion of string and replacing that with an ellipsis button ('...')
* This jQuery plugin accepts one single param: `maxLen`
	* `maxLen` can be a number (the number of characters to display) |or| a function that returns the portion of the text to be displayed

## Installation / Usage
* After forking or cloning this repo, assuming node is installed run `npm install`
* Once the deps are installed, running `gulp` will build everything into the `'build'` directory
* The example page will be found in `build/index.html`
* Example usage:

	```js
	jQuery('#foo').etCetera(50); // will clip #foo after 50 characters
	```
	OR

	```js
		jQuery('#foo')
			.etCetera(function (txt) {
				return txt.substr(0, txt.lastIndexOf('/')) // will clip foo at its last slash
			});
	 ```
