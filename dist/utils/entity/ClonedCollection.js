var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["./Collection"], function(Collection) {
  var ClonedCollection, _ref;
  return ClonedCollection = (function(_super) {
    __extends(ClonedCollection, _super);

    function ClonedCollection() {
      _ref = ClonedCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ClonedCollection.prototype.cloneSource = function(array) {
      var source;
      source = this.addSource(array);
      this._clonedSource = source;
      return source;
    };

    ClonedCollection.prototype.getClonedSource = function() {
      return this._clonedSource;
    };

    ClonedCollection.prototype.restoreLastSourceRevision = function() {
      return this.source = this._clonedSource;
    };

    return ClonedCollection;

  })(Collection);
});
