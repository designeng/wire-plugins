define(["plugins/utils/routing/appRouterController"], function(appRouterController) {
  var Route;
  return Route = (function() {
    function Route(route, rules, handler) {
      this._route = appRouterController.addRoute(route);
      this.applyRules(rules);
      this.applyHandler(handler);
    }

    Route.prototype.applyRules = function(rules) {
      return this._route.rules = rules;
    };

    Route.prototype.applyHandler = function(handler) {
      return this._route.matched.add(handler);
    };

    return Route;

  })();
});
