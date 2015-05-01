define(["underscore", "when", "./route"], function(_, When, Route) {
  var Controller;
  return Controller = (function() {
    function Controller() {}

    Controller.prototype.registerGroundRoutes = function() {
      var _this = this;
      return _.forEach(this.groundRoutes, function(routeValue, routeKey) {
        var routeHandler, routeObject;
        routeObject = _.extend({}, routeValue, {
          route: routeKey
        });
        routeHandler = (function(routeObject) {
          return function() {
            return _this.routeHandlerFactory.createHandler(routeObject);
          };
        })(routeObject);
        return new Route(routeKey, routeValue.rules, routeHandler);
      });
    };

    return Controller;

  })();
});
