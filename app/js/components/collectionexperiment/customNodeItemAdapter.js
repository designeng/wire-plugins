define(["jquery", "underscore"], function($, _) {
  var CustomNodeItemAdapter;
  CustomNodeItemAdapter = (function() {
    function CustomNodeItemAdapter(rootNode, options) {
      console.log("CustomNodeItemAdapter", rootNode, options);
      this._rootNode = rootNode;
      this._options = options;
    }

    CustomNodeItemAdapter.prototype.getOptions = function() {
      return this._options;
    };

    CustomNodeItemAdapter.prototype.set = function(item) {
      console.log("SET:::", item, this.rootNode);
      return $(this._rootNode).text("::::" + item.port);
    };

    CustomNodeItemAdapter.prototype.update = function(item) {};

    CustomNodeItemAdapter.prototype.destroy = function() {};

    CustomNodeItemAdapter.prototype.properties = function(lambda) {
      return lambda(this._item);
    };

    return CustomNodeItemAdapter;

  })();
  CustomNodeItemAdapter.canHandle = function(obj) {
    return obj && obj.tagName && obj.getAttribute && obj.setAttribute;
  };
  return CustomNodeItemAdapter;
});
