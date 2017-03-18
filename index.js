
/**
 * Expose `EtCetera`
 */

if (typeof module !== 'undefined') {
  module.exports = EtCetera;
}

function EtCetera(el, opts) {
  if (!el) {
    throw new Error('No element provided (can be selector, element, or array of elements)');
  }

  var element = elHandler(el);
  this.options = extend({
    characters: 50,
    buttonClass: 'et-cetera-trigger',
    selectText: true,
    insertAs: 'nextSibling',
    buttonLabel: null
  }, opts || {});

  this.buildItems(element.length ? element : [element]);
}

EtCetera.prototype.buildItems = function (elements) {
  this.items = [];

  elements.forEach(function (element) {
    this.items.push({
      element: element,
      fullText: element.innerText
    });
  });

  this.evaluate();
  this.attachEvents();
};

EtCetera.prototype.evaluate = function () {
  // evaluate each region
  this.items.forEach(function (item) {
    item.visibleText = 'function' === typeof this.options.characters ?
      options.characters(item.text) :
      item.text.substr(0, this.options.characters);

      // options.characters did not dictate any text modification
      if (item.visibleText === item.fullText) { return; }

      // replace full text with clipped text
      item.element.innerText = item.visibleText;
      // create/append ellipsis button
      var ellipsisButton = document.createElement('button');
      ellipsisButton.type = 'button';
      ellipsisButton.className = this.options.buttonClass || '';

      if (this.options.buttonLabel) {
        ellipsisButton.setAttribute('aria-label', this.options.buttonLabel);
      }

      appendHandler(this.options.insertAs, ellipsisButton, item.element);

      if (this.options.onClick) {
        ellipsisButton.addEventListener(
          'click',
          this.options.onClick(ellipsisButton, item.fullText)
        );
      }
  }.bind(this));
};

EtCetera.prototype.attachEvents = function () {
  this.items.each(function (item) {
    item.element.addEventListener('click', function () {
      if (this.options.selectText) { selectText(item.element); }
    }.bind(this));
  }.bind(this));
};

function elHandler(el) {
  return 'string' === typeof el ? queryAll(el) : el;
}

function appendHandler(method, button, target) {
  switch (method) {
    case 'nextSibling':
      target.parentNode.insertBefore(button, target.nextSibling);
      break;
    case 'prevSibling':
      target.parentNode.insertBefore(button, target);
      break;
    case 'lastChild':
      target.appendChild(button);
      break;
    case 'firstChild':
      target.insertBefore(button, target.firstChild);
      break;
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

function queryAll(selector, context) {
  context = context || document;
  return Array.prototype.slice.call(
    context.querySelectorAll(selector)
  );
}

function extend(obj, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) obj[key] = src[key];
  }
  return obj;
}
