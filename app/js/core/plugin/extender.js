var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["underscore", "when"], function(_, When) {
  return function(options) {
    var extend, extendWithFactory;
    extend = function(componentDefinition, wire) {
      return When.promise(function(resolve) {
        if (!componentDefinition.options["with"]) {
          throw "no 'with' option specified";
        }
        if (componentDefinition.options.module) {
          return wire.loadModule(componentDefinition.options.module).then(function(Module) {
            var Extended, i, key, _i, _keys, _len, _ref, _values;
            _keys = _.keys(componentDefinition.options["with"]);
            _values = _.values(componentDefinition.options["with"]);
            Extended = (function(_super) {
              __extends(Extended, _super);

              function Extended() {
                _ref = Extended.__super__.constructor.apply(this, arguments);
                return _ref;
              }

              return Extended;

            })(Module);
            i = 0;
            for (_i = 0, _len = _keys.length; _i < _len; _i++) {
              key = _keys[_i];
              Extended.prototype[key] = _values[i];
              i++;
            }
            return resolve(Extended);
          }, function(error) {
            return reject(error);
          });
        } else {
          throw "no 'module' option specified";
        }
      });
    };
    extendWithFactory = function(resolver, componentDefinition, wire) {
      return extend(componentDefinition, wire).then(function(extended) {
        return resolver.resolve(extended);
      }, function(error) {
        return console.error(error.stack);
      });
    };
    return {
      context: {
        ready: function(resolver, wire) {
          return resolver.resolve();
        }
      },
      factories: {
        extend: extendWithFactory
      }
    };
  };
});
