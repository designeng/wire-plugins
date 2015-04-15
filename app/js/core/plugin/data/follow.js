define(["underscore", "underscore.string", "meld", "wire/lib/object"], function(_, _Str, meld, object) {
  return function(options) {
    var followFacetDestroy, followFacetReady, isRef, removers;
    removers = [];
    isRef = function(it) {
      return it && object.hasOwn(it, '$ref');
    };
    followFacetReady = function(resolver, facet, wire) {
      _.each(facet.options, function(providerFieldValue, consumerFieldName) {
        var provider, providerRefArray;
        if (isRef(providerFieldValue)) {
          providerRefArray = providerFieldValue.$ref.split(".").slice(0, 2);
          provider = {
            "class": providerRefArray[0],
            "method": providerRefArray[1]
          };
          return wire({
            $ref: provider["class"]
          }).then(function(providerClass) {
            var providerFieldSetterName;
            providerFieldSetterName = "set" + _Str.capitalize(provider["method"]);
            if (!_.isFunction(providerClass[providerFieldSetterName])) {
              throw new Error("Method " + providerFieldSetterName + " should be defined in object " + provider["class"] + " !");
            } else {
              return removers.push(meld.after(providerClass, providerFieldSetterName, function(value) {
                return facet.target[consumerFieldName] = value;
              }));
            }
          });
        } else {
          return resolver.reject("Provide wire reference ($ref) as value for key '" + field + "'!");
        }
      });
      return resolver.resolve();
    };
    followFacetDestroy = function(resolver, facet, wire) {
      var remover, _i, _len;
      for (_i = 0, _len = removers.length; _i < _len; _i++) {
        remover = removers[_i];
        remover.remove();
      }
      return resolver.resolve();
    };
    return {
      facets: {
        follow: {
          "ready": followFacetReady,
          "destroy": followFacetDestroy
        }
      }
    };
  };
});
