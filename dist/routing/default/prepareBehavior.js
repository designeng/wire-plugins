define(["underscore"], function(_) {
  var prepareBehavior;
  return prepareBehavior = function(behavior) {
    var argumentsRef, behaviorRef, length;
    if (_.isArray(behavior)) {
      length = behavior.length;
      behaviorRef = _.reduce(behavior, function(result, item, index) {
        var suffix;
        if (index < length - 1) {
          suffix = ",";
        } else {
          suffix = "";
        }
        return result += _.pick(item, "method")["method"] + suffix;
      }, "behavior!");
      argumentsRef = _.reduce(behavior, function(result, item, index) {
        var args, suffix;
        if (index < length - 1) {
          suffix = ",";
        } else {
          suffix = "";
        }
        args = _.pick(item, "args")["args"];
        result.push(args);
        return result;
      }, []);
      behavior = {
        apply: {
          $ref: behaviorRef,
          args: argumentsRef
        }
      };
      return behavior;
    } else if (_.isObject(behavior)) {
      return behavior;
    }
  };
});
