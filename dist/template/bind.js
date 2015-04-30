define(["underscore", "jquery", "when", "meld", "lib/form"], function(_, $, When, meld, formAdapter) {
  return function(options) {
    var bindClassesFacet, bindClassesImplementation, bindFacet, bindFacetDestroy, bindImplementation, noop, pluginInstance, removers;
    removers = null;
    noop = function() {};
    bindImplementation = function(facet, options, wire) {
      var target;
      target = $(facet.target);
      removers = [];
      return wire(facet.options).then(function(options) {
        var attributes, elements, essentialMethods, essentialObjects, isForm, method, model, modelAttributesKeys, opt, renderValue, renderValues, _i, _j, _len, _len1;
        essentialObjects = ["to"];
        for (_i = 0, _len = essentialObjects.length; _i < _len; _i++) {
          opt = essentialObjects[_i];
          if (options[opt] == null) {
            throw new Error("" + opt + " option should be provided for bindModel plugin!");
          }
        }
        model = options["to"];
        isForm = function(form) {
          return form.elements;
        };
        renderValue = function(elements, name, value) {
          var e;
          try {
            return elements[name].html(value);
          } catch (_error) {
            e = _error;
            return noop();
          }
        };
        renderValues = function(elements, attributes) {
          return _.forEach(attributes, function(value, name) {
            return renderValue(elements, name, value);
          });
        };
        essentialMethods = ["trigger", "addListener", "removeListener"];
        for (_j = 0, _len1 = essentialMethods.length; _j < _len1; _j++) {
          method = essentialMethods[_j];
          if (model[method] == null) {
            throw new Error("Model showld have method '" + method + "'!");
          }
        }
        modelAttributesKeys = _.keys(model._attributes);
        attributes = model._attributes;
        if (isForm(facet.target)) {
          return removers.push(meld.before(model, "setProperty", function(name, value) {
            var attrs, e;
            attrs = {};
            attrs[name] = value;
            try {
              return formAdapter.setValues(facet.target, attrs);
            } catch (_error) {
              e = _error;
            }
          }));
        } else {
          elements = {};
          _.forEach(attributes, function(value, key) {
            var element;
            element = target.find("#" + key);
            return elements[key] = element;
          });
          renderValues(elements, attributes);
          return removers.push(meld.before(model, "setProperty", function(name, value) {
            return renderValue(elements, name, value);
          }));
        }
      });
    };
    bindFacet = function(resolver, facet, wire) {
      return resolver.resolve(bindImplementation(facet, options, wire));
    };
    bindClassesImplementation = function(facet, options, wire) {
      var target;
      target = $(facet.target);
      return wire(facet.options).then(function(options) {
        return _.each(options, function(item) {
          var className, id;
          id = _.keys(item)[0];
          className = _.values(item)[0];
          return target.find("#" + id).addClass(className);
        });
      });
    };
    bindClassesFacet = function(resolver, facet, wire) {
      return resolver.resolve(bindClassesImplementation(facet, options, wire));
    };
    bindFacetDestroy = function(resolver, facet, wire) {
      var remover, _i, _len;
      for (_i = 0, _len = removers.length; _i < _len; _i++) {
        remover = removers[_i];
        remover.remove();
      }
      return resolver.resolve();
    };
    return pluginInstance = {
      facets: {
        bind: {
          "ready:before": bindFacet,
          "destroy": bindFacetDestroy
        },
        bindClasses: {
          "ready:after": bindClassesFacet
        }
      }
    };
  };
});
