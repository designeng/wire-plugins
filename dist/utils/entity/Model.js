var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["underscore", "eventEmitter"], function(_, EventEmitter) {
  var Model;
  return Model = (function(_super) {
    __extends(Model, _super);

    function Model(object) {
      this._attributes = object || {};
    }

    Model.prototype.getProperty = function(name) {
      if (name === "") {
        throw new Error("Property must not be empty!");
      }
      return this._attributes[name];
    };

    Model.prototype.setProperties = function(properties) {
      var names,
        _this = this;
      if (_.isFunction(properties)) {
        properties = properties();
      }
      names = _.keys(properties);
      _.each(names, function(name) {
        return _this.setProperty(name, properties[name]);
      });
      return this._attributes;
    };

    Model.prototype.setProperty = function(name, value) {
      return this._attributes[name] = value;
    };

    Model.prototype.addSource = function(object) {
      this._attributes = object;
      return this;
    };

    Model.prototype.getAttributes = function() {
      return this._attributes;
    };

    Model.prototype.clearAttributes = function() {
      return this._attributes = {};
    };

    return Model;

  })(EventEmitter);
});
