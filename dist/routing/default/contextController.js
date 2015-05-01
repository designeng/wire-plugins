var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["underscore", "plugins/utils/entity/Collection"], function(_, Collection) {
  var ContextController;
  return ContextController = (function() {
    function ContextController() {
      this.guessContextResetRoutePositions = __bind(this.guessContextResetRoutePositions, this);
    }

    ContextController.prototype.currentParams = [];

    ContextController.prototype.routeObserver = null;

    ContextController.prototype._contextHash = new Collection();

    ContextController.prototype.updateCachedItem = function(route, options) {
      var cachedContext;
      cachedContext = this._contextHash.find({
        route: route
      });
      if (cachedContext == null) {
        return this._contextHash.addItem(_.extend({
          route: route
        }, options));
      } else {
        return this._contextHash.update({
          route: route
        }, options);
      }
    };

    ContextController.prototype.register = function(parentContext, childContext, child) {
      var baseRoute, hash, _ref;
      baseRoute = this.routeStrategy.getBaseRoute(child.route);
      hash = (_ref = child.params) != null ? _ref["input"] : void 0;
      this.updateCachedItem(baseRoute, {
        "parentContext": parentContext,
        "hash": hash
      });
      return this.updateCachedItem(child.route, {
        "childContext": childContext,
        "hash": hash
      });
    };

    ContextController.prototype.unregister = function(route) {
      var types,
        _this = this;
      types = ["child", "parent"];
      _.each(types, function(type) {
        var context;
        context = _this.getRegistredContext(route, type);
        return context != null ? context.destroy() : void 0;
      });
      return this._contextHash.reset();
    };

    ContextController.prototype.onHashChanged = function(parsedHashObject) {
      return this.destroyOnBlur(parsedHashObject.oldHash);
    };

    ContextController.prototype.destroyOnBlur = function(hash) {
      var cachedItemWithChildContext, cachedItems, item, _ref;
      cachedItems = this._contextHash.where({
        hash: hash
      });
      item = cachedItemWithChildContext = _.filter(cachedItems, function(item) {
        return item["childContext"] != null;
      })[0];
      if ((item != null) && ((_ref = item["childContext"]) != null ? _ref.__environmentVars.destroyOnBlur : void 0)) {
        item["childContext"].destroy();
        return this._contextHash.remove(item["_id"]);
      }
    };

    ContextController.prototype.clearCache = function() {
      this._contextHash.each(function(item) {
        var _ref, _ref1;
        if ((_ref = item["childContext"]) != null) {
          _ref.destroy();
        }
        return (_ref1 = item["parentContext"]) != null ? _ref1.destroy() : void 0;
      });
      return this._contextHash.reset();
    };

    ContextController.prototype.getRegistredContext = function(route, type) {
      var baseRoute, _ref, _ref1;
      if (type === "parent") {
        baseRoute = this.routeStrategy.getBaseRoute(route);
        return (_ref = this._contextHash.find({
          route: baseRoute
        })) != null ? _ref.parentContext : void 0;
      } else if (type === "child") {
        return (_ref1 = this._contextHash.find({
          route: route
        })) != null ? _ref1.childContext : void 0;
      }
    };

    ContextController.prototype.ensureContext = function(context) {
      if (context.destroy && context.resolve && context.wire) {
        return true;
      } else {
        return false;
      }
    };

    ContextController.prototype.startContextHashRevision = function(child) {
      var mutations, positions;
      positions = this.calculatePositions(child);
      if (!this.theSame(child.params, this.currentParams)) {
        mutations = this.indexesOfMutation(child.params, this.currentParams);
        if (this.changesOccurred(mutations, positions)) {
          this.unregister(child.route);
          return this.currentParams = child.params;
        }
      }
    };

    ContextController.prototype.guessContextResetRoutePositions = function(route) {
      var fragments, res;
      fragments = this.normalizeRoute(route);
      res = _.reduce(fragments, function(result, item, index) {
        if (item.match("\\{(.*)}")) {
          result.push(index);
        }
        return result;
      }, []);
      return res;
    };

    ContextController.prototype.normalizeRoute = function(route) {
      if (_.isArray(route)) {
        return route;
      } else if (_.isString(route)) {
        return route.split("/");
      }
    };

    ContextController.prototype.validate = function(emphasizedPositions, positions) {
      return _.reduce(emphasizedPositions, function(result, positionValue) {
        if (_.indexOf(positions, positionValue) === -1) {
          result = result * 0;
        }
        return result;
      }, 1);
    };

    ContextController.prototype.calculatePositions = function(child) {
      var emphasizedPositions, isValid, positions;
      positions = this.guessContextResetRoutePositions(child.route);
      emphasizedPositions = child.contextResetRoutePositions;
      if (emphasizedPositions) {
        isValid = this.validate(emphasizedPositions, positions);
        if (!isValid) {
          throw new Error("Provided for child route '" + child.route + "' contextResetRoutePositions is not valid!");
        }
        return emphasizedPositions;
      } else {
        return positions;
      }
    };

    ContextController.prototype.theSame = function(a, b) {
      return _.all(_.zip(a, b), function(x) {
        return x[0] === x[1];
      });
    };

    ContextController.prototype.indexesOfMutation = function(a, b) {
      return _.reduce(_.zip(a, b), function(result, item, index) {
        if (item[0] !== item[1]) {
          result.push(index);
        }
        return result;
      }, []);
    };

    ContextController.prototype.changesOccurred = function(mutations, positions) {
      return !!_.intersection(mutations, positions).length;
    };

    return ContextController;

  })();
});
