define(["crossroads", "hasher", "when"], function(crossroads, hasher, When) {
  return function(options) {
    var createRouter, currentContext, initializeRouter, parseHash, routeBinding, tempRouter;
    parseHash = function(newHash, oldHash) {
      return tempRouter.parse(newHash);
    };
    currentContext = null;
    tempRouter = void 0;
    createRouter = function(compDef, wire) {
      return When.promise(function(resolve) {
        tempRouter = crossroads.create();
        return resolve(tempRouter);
      });
    };
    routeBinding = function(tempRouter, compDef, wire) {
      var route, routeFn, routeObject, spec, _ref, _results;
      _ref = compDef.options.routes;
      _results = [];
      for (route in _ref) {
        routeObject = _ref[route];
        spec = routeObject.spec;
        routeFn = (function(spec) {
          return wire.loadModule(spec).then(function(specObj) {
            if (currentContext != null) {
              currentContext.destroy();
            }
            specObj.slot = routeObject.slot;
            return wire.createChild(specObj).then(function(ctx) {
              return currentContext = ctx;
            }, function(error) {
              return console.error(error.stack);
            });
          });
        }).bind(null, spec);
        tempRouter.addRoute(route, routeFn);
        hasher.initialized.add(parseHash);
        _results.push(hasher.changed.add(parseHash));
      }
      return _results;
    };
    initializeRouter = function(resolver, compDef, wire) {
      return createRouter(compDef, wire).then(function(tempRouter) {
        routeBinding(tempRouter, compDef, wire);
        return resolver.resolve(tempRouter);
      }, function(error) {
        return console.error(error.stack);
      });
    };
    return {
      destroy: function(resolver, proxy, wire) {
        return tempRouter.dispose();
      },
      factories: {
        contextRouter: initializeRouter
      }
    };
  };
});
