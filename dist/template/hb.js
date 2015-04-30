define(["underscore", "when", "handlebars"], function(_, When, Handlebars) {
  var acceptTransformations, ensureElement, processCollection, registerPartials, sum;
  sum = function(memo, text) {
    return memo + text;
  };
  ensureElement = function(rootElement) {
    var attr, element, fragments, val;
    if (rootElement == null) {
      rootElement = {
        tagName: "ul"
      };
    }
    fragments = [];
    fragments.push(rootElement.tagName);
    for (attr in rootElement.attributes) {
      val = rootElement.attributes[attr];
      fragments.push("" + attr + "=" + val);
    }
    element = {
      open: "<" + fragments.join(" ") + ">",
      close: "</" + rootElement + ">"
    };
    return element;
  };
  processCollection = function(rootElement, itemPattern, list, zeroPattern) {
    var element, item, result, resultHtml, _i, _len;
    result = [];
    if (!list.length && (zeroPattern != null)) {
      result.push(zeroPattern);
    } else {
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        item = list[_i];
        result.push(itemPattern(item));
      }
    }
    element = ensureElement(rootElement);
    result.unshift(element.open);
    result.push(element.close);
    resultHtml = _.reduce(result, sum, "");
    return resultHtml;
  };
  registerPartials = function(partials) {
    var partial, _results;
    _results = [];
    for (partial in partials) {
      _results.push(Handlebars.registerPartial(partial, partials[partial]));
    }
    return _results;
  };
  acceptTransformations = function(list, itemTransformations) {
    var fieldCount, fieldName, fields, item, transformations, _i, _j, _len, _len1;
    if (_.isEmpty(itemTransformations)) {
      return list;
    }
    fields = _.keys(itemTransformations);
    transformations = _.values(itemTransformations);
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      fieldCount = 0;
      for (_j = 0, _len1 = fields.length; _j < _len1; _j++) {
        fieldName = fields[_j];
        item[fieldName] = transformations[fieldCount].call(item, fieldName);
      }
    }
    return list;
  };
  return function(options) {
    return {
      factories: {
        templateSource: function(resolver, componentDef, wire) {
          return wire(componentDef.options).then(function(options) {
            var fillWith, itemPattern, itemTransformations, partials, pattern, rootElement, zeroPattern;
            pattern = options.pattern;
            fillWith = options.fillWith;
            itemPattern = options.itemPattern;
            partials = options.partials;
            rootElement = options.rootElement;
            zeroPattern = options.zeroPattern;
            itemTransformations = options.itemTransformations;
            if (typeof fillWith === "undefined") {
              throw new Error("fillWith should not be undefined!");
            }
            if (fillWith === null) {
              if (pattern instanceof Function) {
                return pattern();
              } else if (pattern instanceof String) {
                return pattern;
              }
            } else {
              if (partials != null) {
                registerPartials(partials);
              }
              if (fillWith instanceof Function) {
                if (pattern != null) {
                  pattern(fillWith());
                } else {
                  fillWith = fillWith();
                }
              }
              if (fillWith instanceof Array) {
                if (itemPattern == null) {
                  throw new Error("itemPattern option should be defined!");
                }
                if (itemTransformations != null) {
                  fillWith = acceptTransformations(fillWith, itemTransformations);
                }
                return processCollection(rootElement, itemPattern, fillWith, zeroPattern);
              } else {
                if (pattern == null) {
                  throw new Error("pattern option should be defined!");
                }
                return pattern(fillWith);
              }
            }
          }).then(resolver.resolve, resolver.reject);
        }
      }
    };
  };
});
