define(["underscore"], function(_) {
  var innerListTransformation, processCollection, sum;
  sum = function(memo, text) {
    return memo + text;
  };
  processCollection = function(itemPattern, list) {
    var item, result, resultHtml, _i, _len;
    result = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      result.push(_.template(itemPattern, item));
    }
    result.unshift("<ul>");
    result.push("</ul>");
    resultHtml = _.reduce(result, sum, "");
    return resultHtml;
  };
  return innerListTransformation = function(template) {
    return function(fieldName) {
      return processCollection(template, this[fieldName]);
    };
  };
});
