define(["underscore"], function(_) {
  var RouteStrategy, getBaseRouteRecursive, getCurrentRoute, getRouteFragments, memoGroupedByLength, scanZipped, withoutTheLast;
  memoGroupedByLength = null;
  getRouteFragments = function(route) {
    return route.split("/");
  };
  withoutTheLast = function(array) {
    return _.initial(array);
  };
  getBaseRouteRecursive = function(route, fragments, level) {
    var base, parentFragments;
    if (level === 1) {
      return route;
    } else {
      base = _.where(memoGroupedByLength[level], {
        route: route,
        base: true
      })[0];
      if (base != null) {
        return base.route;
      } else {
        parentFragments = withoutTheLast(fragments);
        return getBaseRouteRecursive(parentFragments.join("/"), parentFragments, parentFragments.length);
      }
    }
  };
  scanZipped = function(memo, pair) {
    var first, last;
    first = pair[0];
    last = pair[1];
    if (_.isUndefined(first)) {
      return memo * 0;
    }
    if (first.match("\\{(.*)}") && !_.isUndefined(last)) {
      return memo * 1;
    }
    if (first !== last) {
      return memo * 0;
    } else {
      return memo * 1;
    }
  };
  getCurrentRoute = function() {
    return this.appRouterController.getCurrentRoute();
  };
  return RouteStrategy = (function() {
    function RouteStrategy(options) {
      if (options != null) {
        this.childRoutes = options.childRoutes;
        this.groundRoutes = options.groundRoutes;
      }
    }

    RouteStrategy.prototype.groupByLength = function() {
      return _.groupBy(_.keys(this.childRoutes), function(route) {
        return getRouteFragments(route).length;
      });
    };

    RouteStrategy.prototype.getComponentRoute = function(spec, routeMask) {
      return _.findKey(this.childRoutes, function(routeObject, routeKey) {
        var condition;
        if (routeMask.length < routeKey.length) {
          condition = routeKey.substring(0, routeMask.length) === routeMask;
        } else {
          condition = routeMask.substring(0, routeKey.length) === routeKey;
        }
        return routeObject.spec === spec && condition;
      });
    };

    RouteStrategy.prototype.getBaseRoute = function(route) {
      var baseRoute, fragments, keys,
        _this = this;
      if (memoGroupedByLength == null) {
        keys = _.keys(this.childRoutes);
        memoGroupedByLength = _.reduce(keys, function(result, item, index) {
          var element, fragmentsLength;
          fragmentsLength = getRouteFragments(item).length;
          if (result[fragmentsLength] == null) {
            result[fragmentsLength] = [];
          }
          element = {
            route: item
          };
          if (_this.childRoutes[item].base) {
            element["base"] = true;
          }
          result[fragmentsLength].push(element);
          return result;
        }, {});
      }
      fragments = getRouteFragments(route);
      baseRoute = getBaseRouteRecursive(route, fragments, fragments.length);
      return baseRoute;
    };

    RouteStrategy.prototype.getChild = function(route) {
      var childRouteObject, childRoutesKeys, fragments, res, routeKey, routeParams, zipped, _i, _len;
      routeParams = getCurrentRoute.call(this).params;
      childRoutesKeys = _.keys(this.childRoutes);
      for (_i = 0, _len = childRoutesKeys.length; _i < _len; _i++) {
        routeKey = childRoutesKeys[_i];
        fragments = routeKey.split("/");
        zipped = _.zip(fragments, routeParams);
        res = _.reduce(zipped, scanZipped, 1);
        if (res) {
          childRouteObject = this.childRoutes[routeKey];
          childRouteObject.route = routeKey;
          childRouteObject.params = routeParams;
          return childRouteObject;
        }
      }
      return void 0;
    };

    return RouteStrategy;

  })();
});
