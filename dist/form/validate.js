define(["underscore", "when", "wire", "plugins/utils/form/displayListItemPattern"], function(_, When, wire, displayListItemPattern) {
  var createPluginApi, createValidatorPromise, getFieldNames, isElement;
  isElement = function(node) {
    return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
  };
  getFieldNames = function(strategy) {
    var key, result, _i, _len, _ref;
    result = {};
    _ref = _.keys(strategy);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      result[key] = true;
    }
    return result;
  };
  createPluginApi = function(facet, context, validatorDeferred, resolver) {
    var validator;
    validator = {};
    validator["getStrategy"] = function(strategy) {
      return context.validator.validator.getStrategy(res);
    };
    validator["extendStrategy"] = function(strategy) {
      return context.validator.validator.extendStrategy(res);
    };
    validator["removeStrategyField"] = function(fieldName) {
      return context.validator.validator.removeStrategyField(res);
    };
    validator["addStrategyField"] = function(fieldName) {
      return context.validator.validator.addStrategyField(fieldName);
    };
    validator["disableField"] = function(fieldName) {
      return context.validator.controller.disableField(fieldName);
    };
    validator["enableField"] = function(fieldName) {
      return context.validator.controller.enableField(fieldName);
    };
    validator["validateField"] = function(fieldName, condition) {
      condition = condition || "not blank";
      return context.validator.controller.invoke(fieldName, condition);
    };
    validator["validateAll"] = function(fieldName) {
      return context.validator.controller.validateAll();
    };
    validator["clearFieldErrors"] = function(fieldName) {
      return context.validator.controller.clearFieldErrors(fieldName);
    };
    validator["reset"] = function(fieldName) {
      return context.validator.controller.reset();
    };
    facet.target["validator"] = validator;
    validatorDeferred.resolve(validator);
    return resolver.resolve();
  };
  createValidatorPromise = function(facet, validatorDeferred) {
    return facet.target["validatorIsReady"] = validatorDeferred.promise;
  };
  return function(options) {
    var pluginObject, validateFacet;
    validateFacet = function(resolver, facet, wire) {
      return wire(facet.options).then(function(options) {
        var essential, opt, target, validatorDeferred, _i, _len;
        validatorDeferred = When.defer();
        target = options.form ? options.form : facet.target;
        if (!isElement(facet.target)) {
          createValidatorPromise(facet, validatorDeferred);
        }
        if (!options.validator) {
          essential = ["strategy", "successHandler", "displaySlot", "displaySlotClass"];
          for (_i = 0, _len = essential.length; _i < _len; _i++) {
            opt = essential[_i];
            if (!options[opt]) {
              throw new Error("" + opt + " should be provided!");
            }
          }
          return wire({
            formView: target,
            validator: {
              wire: {
                spec: "plugins/form/validator/spec",
                provide: {
                  form: target || "<form></form>",
                  target: facet.target || {},
                  fieldNames: getFieldNames(options.strategy) || {},
                  strategy: options.strategy || {},
                  successHandler: options.successHandler || function() {},
                  streamsHooks: options.streamsHooks || {},
                  displaySlot: options.displaySlot || {
                    length: 0
                  },
                  displaySlotClass: options.displaySlotClass || "",
                  displayViewTemplate: options.displayViewTemplate || "<ul></ul>",
                  displayListItemPattern: options.displayListItemPattern || displayListItemPattern
                }
              }
            }
          }).then(function(context) {
            if (!isElement(facet.target)) {
              return createPluginApi(facet, context, validatorDeferred, resolver);
            } else {
              return resolver.resolve();
            }
          });
        } else {
          return resolver.resolve();
        }
      });
    };
    pluginObject = {
      facets: {
        validate: {
          "ready:before": validateFacet
        }
      }
    };
    return pluginObject;
  };
});
