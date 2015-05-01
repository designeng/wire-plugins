var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["underscore", "when", "when/pipeline"], function(_, When, pipeline) {
  var TasksFactory;
  return TasksFactory = (function() {
    TasksFactory.prototype.allowedReasons = ["CACHED"];

    TasksFactory.prototype.noop = function(object) {
      return object;
    };

    function TasksFactory(target, tasks) {
      this.distributive = this.provideFunctions(target, this.prepareTasks(tasks));
      return this;
    }

    TasksFactory.prototype.prepareTasks = function(tasks) {
      var distributive;
      distributive = {};
      distributive["tasks"] = tasks;
      return distributive;
    };

    TasksFactory.prototype.provideFunctions = function(target, distributive) {
      var result;
      result = {};
      _.each(distributive, function(methods, key) {
        return result[key] = _.map(methods, function(method) {
          if (!target[method]) {
            throw new Error("No method with name '" + method + "' provided!");
          } else {
            return target[method];
          }
        }, target);
      }, target);
      return result;
    };

    TasksFactory.prototype.runTasks = function(item, callback, options) {
      var tasks,
        _this = this;
      if (!_.isFunction(callback)) {
        callback = this.noop;
      }
      if (options != null ? options.skip : void 0) {
        tasks = _.filter(this.distributive["tasks"], function(methodToSkip, index) {
          if (__indexOf.call(options.skip, index) >= 0) {
            return false;
          } else {
            return true;
          }
        });
      } else {
        tasks = this.distributive["tasks"];
      }
      return pipeline(tasks, item).then(function(result) {
        return callback(result);
      }, function(reason) {
        if (__indexOf.call(_this.allowedReasons, reason) >= 0) {
          return _this.noop();
        } else {
          return console.error("PIPELINE TASKS ERROR:::", reason);
        }
      });
    };

    return TasksFactory;

  })();
});
