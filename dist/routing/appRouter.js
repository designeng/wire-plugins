define(["underscore", "plugins/utils/routing/appRouterController"], function(_, appRouterController) {
  return function(options) {
    var appRouterFactory, pluginInstance;
    appRouterFactory = function(resolver, compDef, wire) {
      var essentialObjects, opt, _i, _len;
      essentialObjects = ["groundRoutes", "childRoutes"];
      for (_i = 0, _len = essentialObjects.length; _i < _len; _i++) {
        opt = essentialObjects[_i];
        if (compDef.options[opt] == null) {
          throw new Error("" + opt + " option should be provided for appRouter plugin usage!");
        }
        if (!_.isObject(compDef.options[opt])) {
          throw new Error("" + opt + " option should be Object!");
        }
      }
      return wire({
        appRouterController: {
          literal: appRouterController
        },
        root: {
          wire: {
            spec: "plugins/routing/default/spec",
            provide: {
              pluginWireFn: wire,
              appRouterController: {
                $ref: 'appRouterController'
              },
              groundRoutes: compDef.options.groundRoutes,
              childRoutes: compDef.options.childRoutes,
              afterChildrenLoaded: compDef.options.afterChildrenLoaded
            }
          }
        }
      }).then(function(context) {
        return resolver.resolve(context);
      });
    };
    pluginInstance = {
      ready: function(resolver, proxy, wire) {
        return resolver.resolve();
      },
      destroy: function(resolver, proxy, wire) {
        appRouterController.dispose();
        return resolver.resolve();
      },
      factories: {
        appRouter: appRouterFactory
      }
    };
    return pluginInstance;
  };
});
