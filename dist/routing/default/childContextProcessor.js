define(["underscore", "when", "when/pipeline", "when/sequence", "./tasksFactory", "core/util/navigation/navigate"], function(_, When, pipeline, sequence, TasksFactory, navigate) {
  var ChildContextProcessor;
  return ChildContextProcessor = (function() {
    ChildContextProcessor.prototype.parentContext = void 0;

    function ChildContextProcessor() {
      var tasks;
      _.bindAll(this);
      tasks = ["wireChildContext", "checkForAccess", "sequenceBehavior", "synchronize"];
      this.tasksFactory = new TasksFactory(this, tasks);
    }

    ChildContextProcessor.prototype.deliver = function(parentContext, bundle) {
      var childQueue,
        _this = this;
      this.parentContext = parentContext;
      childQueue = _.map(bundle, function(item, index) {
        return function() {
          var options;
          options = {};
          item.childContext = _this.contextController.getRegistredContext(item.route, "child");
          if (index === 0) {
            _this.mainSpecification = item.spec;
          }
          if (item.childContext != null) {
            options.skip = [0, 1];
            return _this.tasksFactory.runTasks(item.childContext, null, options);
          } else {
            return _this.tasksFactory.runTasks(item);
          }
        };
      });
      return sequence(childQueue).then(function(result) {
        if (_this.afterChildrenLoaded) {
          return _this.afterChildrenLoaded();
        }
      });
    };

    ChildContextProcessor.prototype.wireChildContext = function(child) {
      var environment,
        _this = this;
      if (child.childContext != null) {
        return child.childContext;
      } else {
        environment = {
          __environmentVars: {
            spec: child.spec,
            replaceable: child.replaceable,
            route: child.route,
            destroyOnBlur: child.destroyOnBlur
          },
          slot: child.slot
        };
        if (typeof child.behavior !== "undefined") {
          environment["behavior"] = this.prepareBehavior(child.behavior);
        }
        return When(this.environment.loadInEnvironment(child.spec, child.mergeWith, environment, this.parentContext)).then(function(childContext) {
          if (!child.noCache) {
            _this.contextController.register(_this.parentContext, childContext, child);
          }
          if (child.clearCache) {
            _this.contextController.clearCache();
          }
          return childContext;
        }, function(rejectReason) {
          return console.debug("ChildContextProcessor::wireChildContext:rejectReason:", rejectReason);
        });
      }
    };

    ChildContextProcessor.prototype.checkForAccess = function(childContext) {
      var access;
      access = this.accessPolicyProcessor.askForAccess(childContext);
      if (access) {
        return childContext;
      } else {
        return {};
      }
    };

    ChildContextProcessor.prototype.sequenceBehavior = function(childContext) {
      if ((childContext.behavior != null) && childContext.__environmentVars.spec === this.mainSpecification) {
        return this.behaviorProcessor.sequenceBehavior(childContext);
      } else {
        return childContext;
      }
    };

    ChildContextProcessor.prototype.synchronize = function(childContext) {
      var isActive,
        _this = this;
      isActive = function(context) {
        return context.__environmentVars.route === _this.routeStrategy.getChild(_this.appRouterController.getCurrentRoute().route._pattern).route;
      };
      if (isActive(childContext) && typeof childContext.synchronizeWithRoute !== "undefined") {
        childContext.synchronizeWithRoute.call(childContext);
      }
      return childContext;
    };

    return ChildContextProcessor;

  })();
});
