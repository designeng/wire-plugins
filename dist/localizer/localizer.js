define(["underscore", "when", "i18n!nls/general"], function(_, When, localized) {
  return function(options) {
    var doLocalize, localizeFacet;
    doLocalize = function(facet, options, wire) {
      var parseTemplateRx, target;
      target = facet.target;
      parseTemplateRx = /\$\{([^}]*)\}/g;
      return When(wire({
        options: facet.options
      }), function(options) {
        var res, whatToLocalize;
        whatToLocalize = _.result(target, facet.options);
        res = whatToLocalize.replace(parseTemplateRx, function(m, token) {
          return localized[token];
        });
        target[facet.options] = res;
        return target;
      });
    };
    localizeFacet = function(resolver, facet, wire) {
      return resolver.resolve(doLocalize(facet, options, wire));
    };
    return {
      context: {
        "ready:before": function(resolver, wire) {
          return resolver.resolve();
        }
      },
      facets: {
        localize: {
          "ready:before": localizeFacet
        }
      }
    };
  };
});
