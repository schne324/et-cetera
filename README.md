# Et Cetera

* Et Cetera will ellipsis-ify an element's text by clipping off desired portion of string and replacing that with an ellipsis button ('...')

## Installation / Usage
* After forking or cloning this repo, assuming node is installed run `npm install`
* Once the deps are installed, running `gulp` will build everything into the `build` directory
* The example page will be found in `build/index.html`

### Bower
* `bower install et-cetera`

## Options
* `characters`: _{Number|Function}_ Either the number of characters to display (clip the rest off) OR a function that returns the characters to display
	* (defaults to `50`)
* `onClick`: _{Function}_ A function that is called when the ellipsis trigger is clicked.  This function will receive the trigger element as well as the clipped element's full text
* `buttonClass`: _{String}_ A class to be added to the ellipsis button (also accepts multiple space-separated classes)
	* (defaults to `'ion-more'`)
* `selectText`: _{Boolean}_ Whether or not to select the text in the given element when its clicked
	* (defaults to `true`)
* Example usage:

```js
jQuery('#foo').etCetera({
	characters: 50
}); // will clip #foo after 50 characters
```

OR


```js
jQuery('#foo').etCetera({
	characters: function (trigger, text) {
		return text.substr(0, text.lastIndexOf('/')) // will clip #foo at its last slash
	}
}
});

```


OR

```js
jQuery('#foo').etCetera({
	buttonClass: 'my-button',
	characters: 29,
	onClick: function (ellipsiBtn, fullText) {
		console.log('clicked: ', ellipsiBtn);
		alert('this full text is: ', fullText);
	}
})
```

## Tests
* Run tests with `gulp test`
