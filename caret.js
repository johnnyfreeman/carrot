(function () {
  var isParentNode
    , Caret;

  isParentNode = function (child, possibleParent) {
    while (child) {
      if (child.isEqualNode(possibleParent)) {
        return child;
      } else {
        child = child.parentElement;
      }
    }
    return false;
  };

  Caret = function(element) {
    this.el = element;
    this.document = element.ownerDocument;
    this.window = this.document.defaultView || this.document.parentWindow;
    this.selection = this.window.getSelection() || this.document.selection;
  };

  Caret.prototype.updateRange = function() {
    var range;
    try {
      range = this.selection.getRangeAt(0);
      if (isParentNode(range.startContainer, this.el) || isParentNode(range.endContainer, this.el)) {
        throw new Error();
      }
    }
    catch () {
      range = this.createRange();
      range.setStart(this.el, this.el.childNodes.length);
    }
    return this.setRange(range);
  };

  Caret.prototype.setRange = function(range) {
    this.selection.removeAllRanges();
    this.selection.addRange(range);
    this.range = range;
    return this;
  };

  Caret.prototype.createRange = function() {
    return this.document.createRange();
  };

  Caret.prototype.moveAfter = function(node) {
    var range;
    range = this.createRange();
    range.setStartAfter(node);
    return this.setRange(range);
  };

  Caret.prototype.moveBefore = function(node) {
    var range;
    range = this.createRange();
    range.setStartBefore(node);
    return this.setRange(range);
  };

  Caret.prototype.moveToBeginningOf = function(node) {
    var range;
    range = this.createRange();
    range.setStart(this.el, 0);
    return this.setRange(range);
  };

  Caret.prototype.moveToEndOf = function(node) {
    var range;
    range = this.createRange();
    range.setStart(this.el, this.el.childNodes.length);
    return this.setRange(range);
  };

  Caret.prototype.replace = function(contents) {
    return this.clear().insert(contents);
  };

  Caret.prototype.clear = function() {
    this.range.deleteContents();
    return this;
  };

  Caret.prototype.insert = function(contents) {
    if (typeof contents === "string") {
      contents = this.document.createTextNode(contents);
    }
    this.range.insertNode(contents);
    this.moveAfter(contents);
    return contents;
  };

  Caret.prototype.extend = function(i) {
    var range;
    range = this.createRange();
    range.setStart(this.range.startContainer, this.range.startOffset + i);
    range.setEnd(this.range.endContainer, this.range.endOffset);
    return this.setRange(range);
  };

  Caret.prototype.select = function(node, start, end) {
    var range;
    range = this.createRange();
    range.setStart(node, 30);
    range.setEnd(node, 38);
    return this.setRange(range);
  };

  Caret.prototype.focus = function() {
    return this.setRange(this.range.cloneRange());
  };

  window.Caret = Caret;
})();