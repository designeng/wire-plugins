define(["underscore", "when", "wire", "components/form/validator/spec"], function(_, When, wire, defaultValidator) {
  var unbindAll;
  unbindAll = function() {};
  return function(options) {
    var pluginObject, validateFacet;
    validateFacet = function(resolver, facet, wire) {
      return wire(facet.options).then(function(options) {
        var target;
        target = facet.target;
        if (!options.validator) {
          return wire({
            formView: target,
            validator: {
              wire: {
                spec: defaultValidator,
                provide: {
                  form: target,
                  strategy: options.strategy,
                  slot: options.displaySlot
                }
              }
            }
          }).then(function(context) {
            return resolver.resolve();
          });
        } else {
          return resolver.resolve();
        }
      });
    };
    pluginObject = {
      context: {
        destroy: function(resolver, wire) {
          unbindAll();
          return resolver.resolve();
        }
      },
      facets: {
        validate: {
          ready: validateFacet
        }
      }
    };
    return pluginObject;
  };
});
