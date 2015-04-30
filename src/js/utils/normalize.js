define(["underscore", "jquery"], function(_, $) {
  var normalize;
  return normalize = function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    if (args.length > 1) {
      return _.map(args, function(view) {
        return $(view);
      });
    } else if (args.length === 1) {
      return $(args[0]);
    }
  };
});
