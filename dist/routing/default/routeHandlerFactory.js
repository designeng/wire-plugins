define(["underscore", "when", "plugins/utils/navigateToError", "./tasksFactory"], function(_, When, navigateToError, TasksFactory) {
  var RouteHandlerFactory;
  return RouteHandlerFactory = (function() {
    function RouteHandlerFactory() {
      var tasks;
      _.bindAll(this);
      tasks = ["defineChildObject", "getCached", "loadNotCached", "sequenceBehavior"];
      this.tasksFactory = new TasksFactory(this, tasks);
    }

    RouteHandlerFactory.prototype.createHandler = function(routeObject) {
      return this.tasksFactory.runTasks(routeObject);
    };

    RouteHandlerFactory.prototype.defineChildObject = function(routeObject) {
      this.child = this.routeStrategy.getChild(routeObject.route);
      this.contextController.startContextHashRevision(this.child);
      return routeObject;
    };

    RouteHandlerFactory.prototype.getCached = function(routeObject) {
      var deferred, parentContext;
      deferred = When.defer();
      parentContext = this.contextController.getRegistredContext(this.child.route, "parent");
      if (parentContext != null) {
        this.processChildRoute(parentContext, this.child);
        deferred.reject("CACHED");
      } else {
        deferred.resolve(routeObject);
      }
      return deferred.promise;
    };

    RouteHandlerFactory.prototype.loadNotCached = function(routeObject) {
      var environment,
        _this = this;
      environment = {
        slot: routeObject.slot
      };
      return When(this.environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, environment)).then(function(parentContext) {
        _this.processChildRoute(parentContext);
        return parentContext;
      }).otherwise(function(error) {
        return navigateToError("js", error);
      });
    };

    RouteHandlerFactory.prototype.processChildRoute = function(context) {
      var bundle, findDefinitionInRoutes, relativeComponentDefinition,
        _this = this;
      bundle = [];
      bundle.push(this.child);
      findDefinitionInRoutes = function(childRoutes, attributes, routeMask) {
        var definition, route;
        route = _this.routeStrategy.getComponentRoute(attributes.spec, routeMask);
        if (route) {
          definition = childRoutes[route];
          definition["route"] = route;
          return definition;
        } else {
          throw new Error("Component definition not found in childRoutes!");
        }
      };
      if (_.isString(this.child.relative)) {
        relativeComponentDefinition = findDefinitionInRoutes(this.childRoutes, {
          spec: this.child.relative
        }, this.child.route);
        bundle.push(relativeComponentDefinition);
      } else if (_.isArray(this.child.relative)) {
        _.each(this.child.relative, function(relativeItem) {
          relativeComponentDefinition = {};
          if (_.isString(relativeItem)) {
            relativeComponentDefinition = findDefinitionInRoutes(_this.childRoutes, {
              spec: relativeItem
            }, _this.child.route);
          } else if (_.isObject(relativeItem)) {
            relativeComponentDefinition = findDefinitionInRoutes(_this.childRoutes, {
              spec: relativeItem.spec
            }, _this.child.route);
          }
          return bundle.push(relativeComponentDefinition);
        });
      }
      return this.childContextProcessor.deliver(context, bundle);
    };

    RouteHandlerFactory.prototype.sequenceBehavior = function(context) {
      if (context.behavior != null) {
        return this.behaviorProcessor.sequenceBehavior(context);
      } else {
        return context;
      }
    };

    return RouteHandlerFactory;

  })();
});
