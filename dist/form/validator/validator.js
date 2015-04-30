var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["underscore", "jquery", "when"], function(_, $, When) {
  var Validator, firstLevelExtend;
  firstLevelExtend = function(original, provider) {
    var prop, value;
    for (prop in provider) {
      value = provider[prop];
      if (_.isObject(original[prop])) {
        original[prop] = _.extend(original[prop], provider[prop]);
      } else {
        original[prop] = provider[prop];
      }
    }
    return original;
  };
  return Validator = (function() {
    Validator.prototype.parsedStrategy = {};

    Validator.prototype.defaultPoint = {
      rule: function(value) {
        if (value === "") {
          return false;
        } else {
          return true;
        }
      }
    };

    function Validator(options) {
      this.extendStrategy = __bind(this.extendStrategy, this);
      this.removeStrategyField = __bind(this.removeStrategyField, this);
      this.options = options;
      this.defaultPoint.message = options.defaultPointMessage || "Should not be empty!";
      this.setStrategy(options);
    }

    Validator.prototype.setStrategy = function(options) {
      var fieldName, fieldPoints, possibleFields, _ref;
      this.strategy = options.strategy;
      possibleFields = {};
      _ref = options.strategy;
      for (fieldName in _ref) {
        fieldPoints = _ref[fieldName];
        possibleFields[fieldName] = true;
        fieldPoints = this.stuffFieldPointsWithDefault(fieldPoints);
        this.parsedStrategy[fieldName] = this.normalizePoints(fieldPoints);
      }
      return this.fieldNames = possibleFields;
    };

    Validator.prototype.removeStrategyField = function(fieldName) {
      return fieldName;
    };

    Validator.prototype.addStrategyField = function(fieldName) {
      return fieldName;
    };

    Validator.prototype.getStrategy = function() {
      return this.strategy;
    };

    Validator.prototype.validate = function(fieldName, value, formInputs, controller) {
      var getDependencies, iterator, points, result;
      if (_.isString(value)) {
        value = $.trim(value);
      }
      points = this.parsedStrategy[fieldName];
      getDependencies = function(dependsOn) {
        var obj;
        obj = {};
        _.forEach(dependsOn.split(","), function(dependency) {
          dependency = $.trim(dependency);
          return obj[dependency] = formInputs[dependency].val();
        });
        return obj;
      };
      iterator = function(result, point) {
        var dependencies;
        if (result.errors) {
          return result;
        } else {
          if ((point != null ? point.transform : void 0) != null) {
            value = point.transform(value);
          }
          if (point.dependsOn != null) {
            dependencies = getDependencies(point.dependsOn);
          }
          if (point.invoke != null) {
            if (point.invoke.condition != null) {
              controller.invoke(point.invoke.name, point.invoke.condition);
            }
          }
          if (!point.rule(value, fieldName, dependencies, formInputs, controller)) {
            result["errors"] = [];
            result["errors"].push(point.message);
          }
          return result;
        }
      };
      result = _.reduce(points, iterator, {});
      return result;
    };

    Validator.prototype.stuffFieldPointsWithDefault = function(fieldPoints) {
      var defaultPoint, _ref, _ref1;
      fieldPoints = _.clone(fieldPoints);
      if (!((_ref = fieldPoints.common) != null ? _ref.optional : void 0)) {
        defaultPoint = this.getDefaultPoint(fieldPoints);
        fieldPoints[0] = defaultPoint;
      }
      if ((_ref1 = fieldPoints.common) != null ? _ref1.transform : void 0) {
        _.forEach(fieldPoints, function(point) {
          if (point != null) {
            return point.transform = fieldPoints.common.transform;
          }
        });
      }
      delete fieldPoints.common;
      return fieldPoints;
    };

    Validator.prototype.getDefaultPoint = function(fieldPoints) {
      var defaultPoint;
      if (fieldPoints.common != null) {
        defaultPoint = _.clone(this.defaultPoint);
        defaultPoint = _.extend(defaultPoint, fieldPoints.common);
      } else {
        defaultPoint = this.defaultPoint;
      }
      return defaultPoint;
    };

    Validator.prototype.normalizePoints = function(points) {
      var _this = this;
      points = _.filter(points, function(item, key, index) {
        if (key === "hint") {
          return false;
        } else {
          return true;
        }
      });
      points = _.map(points, function(item, key, index) {
        item.rule = _this.normalizeRule(item.rule);
        return item;
      });
      return points;
    };

    Validator.prototype.normalizeRule = function(rule) {
      if (_.isFunction(rule)) {
        return rule;
      } else if (_.isRegExp(rule)) {
        return function(value) {
          return value.match(rule);
        };
      }
    };

    Validator.prototype.extendStrategy = function(additionalStrategy) {
      return this.setStrategy({
        strategy: firstLevelExtend(this.strategy, additionalStrategy)
      });
    };

    return Validator;

  })();
});
