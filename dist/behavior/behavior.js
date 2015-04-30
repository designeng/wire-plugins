define(['behavior/index'], function(behavior) {
  return function(options) {
    var applyFactory, getBehaviorMethod, pluginInstance, resolveBehavior, trim;
    trim = function(str) {
      return str.replace(/^\s+|\s+$/g, '');
    };
    getBehaviorMethod = function(name) {
      name = trim(name);
      if (behavior[name] == null) {
        throw new Error("No behavior method with name '" + name + "' provided!");
      } else {
        return behavior[name];
      }
    };
    resolveBehavior = function(resolver, name, refObj, wire) {
      var funcs, names, _i, _len;
      funcs = [];
      if (name.indexOf(",") !== -1) {
        names = name.split(",");
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          funcs.push(getBehaviorMethod(name));
        }
      } else {
        funcs.push(getBehaviorMethod(name));
      }
      return resolver.resolve(funcs);
    };
    applyFactory = function(resolver, componentDef, wire) {
      var args;
      args = componentDef.options.args;
      return wire(componentDef.options).then(function(resultFunctions) {
        return wire(args).then(function(args) {
          var funcs;
          funcs = _.reduce(resultFunctions, function(result, funcItem, index) {
            result.push(function() {
              return funcItem.apply(this, args[index]);
            });
            return result;
          }, []);
          return resolver.resolve(funcs);
        });
      });
    };
    return pluginInstance = {
      resolvers: {
        behavior: resolveBehavior
      },
      factories: {
        apply: applyFactory
      }
    };
  };
});
