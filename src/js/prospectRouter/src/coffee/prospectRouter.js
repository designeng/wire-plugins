define(["underscore", "./util/getCurrentRoute", "crossroads", "hasher", 'when', 'wire/lib/object', 'when/sequence'], function(_, getCurrentRoute, crossroads, hasher, When, object, sequence) {
  return function(options) {
    var childRoutes, createRouter, currentContext, currentProspectSpec, errorHandler, filterStrategy, initializeRouter, injectBechavior, isRef, parseHash, pluginInstance, routeBinding, sequenceBehavior, startChildRouteWiring, tempRouter, wireChildRoute;
    currentContext = null;
    currentProspectSpec = void 0;
    tempRouter = void 0;
    filterStrategy = void 0;
    childRoutes = void 0;
    errorHandler = function(error) {
      return console.error(error.stack);
    };
    parseHash = function(newHash, oldHash) {
      return tempRouter.parse(newHash);
    };
    createRouter = function(compDef, wire) {
      return When.promise(function(resolve) {
        tempRouter = crossroads.create();
        return resolve(tempRouter);
      });
    };
    isRef = function(it) {
      return it && object.hasOwn(it, '$ref');
    };
    injectBechavior = function(childSpecObj, behavior) {
      if (!childSpecObj.$plugins) {
        childSpecObj.$plugins = [];
      }
      childSpecObj.$plugins.push("core/plugin/behavior");
      return childSpecObj.behavior = behavior;
    };
    sequenceBehavior = function(childCTX, route, wire) {
      return When(wire.getProxy(childCTX.behavior), function(behaviorObj) {
        var tasks;
        tasks = behaviorObj.target;
        return sequence(tasks, childCTX, route);
      }, function() {});
    };
    startChildRouteWiring = function(route, wire) {
      var childRouteObject, properties;
      childRouteObject = filterStrategy(childRoutes, route, getCurrentRoute().slice(1));
      properties = {
        spec: childRouteObject.spec,
        slot: childRouteObject.slot,
        behavior: childRouteObject.behavior,
        subSpecs: childRouteObject.subSpecs,
        route: childRouteObject.route,
        options: childRouteObject.options
      };
      return wireChildRoute(properties, wire);
    };
    wireChildRoute = function(properties, wire) {
      return wire.loadModule(properties.spec).then(function(childSpecObj) {
        childSpecObj.slot = properties.slot;
        if (properties.behavior) {
          injectBechavior(childSpecObj, properties.behavior);
        }
        if (properties.options) {
          childSpecObj.options = properties.options;
        }
        return wire.createChild(childSpecObj).then(function(childCTX) {
          var subSpec, _i, _len, _ref, _results;
          sequenceBehavior(childCTX, properties.route, wire);
          if (properties.subSpecs) {
            _ref = properties.subSpecs;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              subSpec = _ref[_i];
              subSpec.route = properties.route;
              _results.push(wireChildRoute(subSpec, wire));
            }
            return _results;
          }
        });
      });
    };
    routeBinding = function(tempRouter, compDef, wire) {
      var behavior, oneRoute, route, routeFn, routeObject, rules, slot, spec, _ref, _results;
      _ref = compDef.options.routes;
      _results = [];
      for (route in _ref) {
        routeObject = _ref[route];
        spec = routeObject.spec;
        slot = routeObject.slot;
        rules = routeObject.rules;
        behavior = routeObject.behavior;
        routeFn = (function(spec, slot, route, behavior, wire) {
          if (spec !== currentProspectSpec) {
            return wire.loadModule(spec).then(function(specObj) {
              if (currentContext != null) {
                currentContext.destroy();
              }
              specObj.slot = slot;
              if (behavior) {
                injectBechavior(specObj, behavior);
              }
              return wire.createChild(specObj).then(function(ctx) {
                sequenceBehavior(ctx, route, wire);
                return When(ctx.renderingController.isReady()).then(function() {
                  currentContext = ctx;
                  currentProspectSpec = spec;
                  return startChildRouteWiring(route, wire);
                });
              }, errorHandler);
            });
          } else {
            return startChildRouteWiring(route, wire);
          }
        }).bind(null, spec, slot, route, behavior, wire);
        oneRoute = tempRouter.addRoute(route);
        oneRoute.rules = rules;
        oneRoute.matched.add(routeFn);
        hasher.initialized.add(parseHash);
        _results.push(hasher.changed.add(parseHash));
      }
      return _results;
    };
    initializeRouter = function(resolver, compDef, wire) {
      if (isRef(compDef.options.childRoutes)) {
        wire(compDef.options.childRoutes).then(function(routes) {
          return childRoutes = routes;
        });
      }
      if (isRef(compDef.options.routeFilterStrategy)) {
        wire(compDef.options.routeFilterStrategy).then(function(strategy) {
          return filterStrategy = strategy;
        });
      } else {

      }
      return createRouter(compDef, wire).then(function(tempRouter) {
        routeBinding(tempRouter, compDef, wire);
        return resolver.resolve(tempRouter);
      }, function(error) {
        return console.error(error.stack);
      });
    };
    pluginInstance = {
      ready: function(resolver, proxy, wire) {
        return resolver.resolve();
      },
      destroy: function(resolver, proxy, wire) {
        tempRouter.dispose();
        return resolver.resolve();
      },
      factories: {
        prospectRouter: initializeRouter
      }
    };
    return pluginInstance;
  };
});
