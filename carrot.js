(function () {
  var isParentNode
    , Carrot;

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

  Carrot = function(element) {
    this.el = element;
    this.document = element.ownerDocument;
    this.window = this.document.defaultView || this.document.parentWindow;
    this.selection = this.window.getSelection() || this.document.selection;
  };

  Carrot.prototype.updateRange = function() {
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

  Carrot.prototype.setRange = function(range) {
    this.selection.removeAllRanges();
    this.selection.addRange(range);
    this.range = range;
    return this;
  };

  Carrot.prototype.createRange = function() {
    return this.document.createRange();
  };

  Carrot.prototype.moveAfter = function(node) {
    var range;
    range = this.createRange();
    range.setStartAfter(node);
    return this.setRange(range);
  };

  Carrot.prototype.moveBefore = function(node) {
    var range;
    range = this.createRange();
    range.setStartBefore(node);
    return this.setRange(range);
  };

  Carrot.prototype.moveToBeginningOf = function(node) {
    var range;
    range = this.createRange();
    range.setStart(this.el, 0);
    return this.setRange(range);
  };

  Carrot.prototype.moveToEndOf = function(node) {
    var range;
    range = this.createRange();
    range.setStart(this.el, this.el.childNodes.length);
    return this.setRange(range);
  };

  Carrot.prototype.replace = function(contents) {
    return this.clear().insert(contents);
  };

  Carrot.prototype.clear = function() {
    this.range.deleteContents();
    return this;
  };

  Carrot.prototype.insert = function(contents) {
    if (typeof contents === "string") {
      contents = this.document.createTextNode(contents);
    }
    this.range.insertNode(contents);
    this.moveAfter(contents);
    return contents;
  };

  Carrot.prototype.extend = function(i) {
    var range;
    range = this.createRange();
    range.setStart(this.range.startContainer, this.range.startOffset + i);
    range.setEnd(this.range.endContainer, this.range.endOffset);
    return this.setRange(range);
  };

  Carrot.prototype.select = function(node, start, end) {
    var range;
    range = this.createRange();
    range.setStart(node, 30);
    range.setEnd(node, 38);
    return this.setRange(range);
  };

  Carrot.prototype.focus = function() {
    return this.setRange(this.range.cloneRange());
  };

  window.Carrot = Carrot;
})();
