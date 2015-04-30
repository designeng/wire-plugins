define(["underscore", "jquery", "when/pipeline", "plugins/utils/normalize", "kefir", "kefirJquery"], function(_, $, pipeline, normalize, Kefir, KefirJquery) {
  var alternativeRegExp, beforeRegExp, filterRegExp;
  KefirJquery.init(Kefir, $);
  filterRegExp = /filter:/g;
  beforeRegExp = /before:/g;
  alternativeRegExp = /alternative:/g;
  return function(options) {
    var pluginObject, streamsFacet;
    streamsFacet = function(resolver, facet, wire) {
      return wire(facet.options).then(function(options) {
        var controller, eventMap, events, fieldNames, form, hooks, submitEvent;
        controller = facet.target;
        eventMap = options.eventMap;
        hooks = options.hooks;
        form = controller.form = normalize(controller.form);
        fieldNames = _.keys(controller.fieldNames);
        _.each(fieldNames, function(name) {
          return this.inputs[name] = form.find("[name='" + name + "']");
        }, controller);
        events = _.keys(eventMap);
        submitEvent = "submit";
        _.map(events, function(event) {
          var alternativeTasks, beforeAll, filters, hookPosition, methods, tasks;
          methods = _.map(eventMap[event].split("|"), function(method) {
            return $.trim(method);
          });
          filters = _.filter(methods, function(method) {
            if (method.match(filterRegExp)) {
              return true;
            } else {
              return false;
            }
          });
          beforeAll = _.filter(methods, function(method) {
            if (method.match(beforeRegExp)) {
              return true;
            } else {
              return false;
            }
          });
          alternativeTasks = _.filter(methods, function(method) {
            if (method.match(alternativeRegExp)) {
              return true;
            } else {
              return false;
            }
          });
          tasks = _.difference(methods, _.union(filters, beforeAll, alternativeTasks));
          if (hooks[event] != null) {
            if (hooks[event]["insertBefore"]) {
              hookPosition = "insertBefore";
            } else if (hooks[event]["insertAfter"]) {
              hookPosition = "insertAfter";
            }
            if (!_.isFunction(hooks[event]["hook"])) {
              throw new Error("Hook should be a function!");
            } else if (!hookPosition) {
              throw new Error("insertBefore or insertAfter option should be declared in the hook!");
            } else {
              tasks = _[hookPosition](tasks, hooks[event][hookPosition], hooks[event]["hook"]);
            }
          }
          filters = _.map(filters, function(item) {
            var filter;
            filter = item.split(":")[1];
            _.bindAll(this, filter);
            return this[filter];
          }, this);
          beforeAll = _.map(beforeAll, function(item) {
            var method;
            method = item.split(":")[1];
            _.bindAll(this, method);
            return this[method];
          }, this);
          alternativeTasks = _.map(alternativeTasks, function(item) {
            var task;
            task = item.split(":")[1];
            _.bindAll(this, task);
            return this[task];
          }, this);
          tasks = _.map(tasks, function(task) {
            if (_.isString(task)) {
              _.bindAll(this, task);
              return this[task];
            } else if (_.isFunction(task)) {
              return task;
            }
          }, this);
          if (event !== submitEvent) {
            return _.each(fieldNames, function(name) {
              var alternativeTasksFunc, beforeAllFilterFunc, filterFunc, getFieldData;
              getFieldData = (function(target, name) {
                return function() {
                  var obj;
                  obj = {
                    event: event,
                    name: name,
                    value: target.inputs[name].val()
                  };
                  return obj;
                };
              })(this, name);
              beforeAllFilterFunc = function() {
                var args;
                args = Array.prototype.slice.call(arguments, 0);
                return _.each(beforeAll, function(method) {
                  return method.apply(null, args);
                });
              };
              alternativeTasksFunc = function(data) {
                return pipeline(alternativeTasks, data);
              };
              filterFunc = function() {
                var args, res;
                args = Array.prototype.slice.call(arguments, 0);
                res = _.reduce(filters, function(res, filter) {
                  return res && filter.apply(null, args);
                }, true);
                if (!res) {
                  alternativeTasksFunc(args[0]);
                }
                return res;
              };
              this.streams[event] = this.inputs[name].asKefirStream(event, getFieldData).tap(beforeAllFilterFunc).filter(filterFunc);
              return this.streams[event].onValue(function(data) {
                return pipeline(tasks, data);
              });
            }, this);
          } else if (event === submitEvent) {
            return this.streams[submitEvent] = form.asKefirStream(submitEvent).onValue(function(value) {
              return pipeline(tasks, value);
            });
          }
        }, controller);
        return resolver.resolve();
      });
    };
    pluginObject = {
      context: {
        destroy: function(resolver, wire) {
          return resolver.resolve();
        }
      },
      facets: {
        streams: {
          ready: streamsFacet
        }
      }
    };
    return pluginObject;
  };
});
