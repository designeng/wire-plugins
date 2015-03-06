define(["crossroads", "underscore", "hasher"], function(crossroads, _, hasher) {
  return function(options) {
    var parseHash, routeBinding, specRouterBinding, target;
    target = null;
    parseHash = function(newHash, oldHash) {
      return target.router.parse(newHash);
    };
    routeBinding = function(facet, options, wire) {
      var handler, route, _ref;
      target = facet.target;
      if (!target["router"]) {
        target.router = crossroads.create();
      } else {
        throw Error("target has router yet!");
      }
      _ref = facet.options.routes;
      for (route in _ref) {
        handler = _ref[route];
        if (target[handler]) {
          _.bindAll(target, handler);
          target.router.addRoute(route, target[handler]);
        } else {
          throw Error("target has not handler '" + handler + "'");
        }
      }
      if (facet.options.routes) {
        hasher.prependHash = "";
        hasher.initialized.add(parseHash);
        return hasher.changed.add(parseHash);
      }
    };
    specRouterBinding = function(resolver, facet, wire) {
      return resolver.resolve(routeBinding(facet, options, wire));
    };
    return {
      context: {
        destroy: function(resolver, wire) {
          return target.router.dispose();
        }
      },
      facets: {
        specRouter: {
          ready: specRouterBinding
        }
      }
    };
  };
});
