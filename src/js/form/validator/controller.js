define(["underscore", "jquery", "when/pipeline", "behavior/prospect/scroll"], function(_, $, pipeline, scroll) {
  var Controller;
  return Controller = (function() {
    function Controller() {}

    Controller.prototype.form = null;

    Controller.prototype.inputs = {};

    Controller.prototype.streams = {};

    Controller.prototype.errors = {};

    Controller.prototype.successed = {};

    Controller.prototype.forgotten = [];

    Controller.prototype.isActualField = function(obj) {
      if (this.fieldNames.hasOwnProperty(obj.name)) {
        return true;
      } else {
        return false;
      }
    };

    Controller.prototype.checkAndShowRegisteredError = function(obj) {
      var result;
      result = this.checkForRegisteredError(obj);
      if (result) {
        this.validate(obj);
      }
      return result;
    };

    Controller.prototype.checkForRegisteredError = function(obj) {
      if (this.errors[obj.name]) {
        return true;
      } else {
        return false;
      }
    };

    Controller.prototype.getRegisteredError = function(obj) {
      obj["errors"] = this.errors[obj.name];
      return obj;
    };

    Controller.prototype.scrollToFocusInput = function(obj) {
      var $input, $wrapper;
      $input = $('input[name=' + obj.name + ']');
      if ($input.length) {
        if (!$input.is('[type=date]')) {
          $wrapper = $input.closest('.layoutPage__sliderSlot');
          return scroll.focusToElement($input, $wrapper, 'blur');
        }
      }
    };

    Controller.prototype.hideError = function(obj) {
      return this.messageDisplay.controller.hideError();
    };

    Controller.prototype.displayError = function(obj) {
      this.messageDisplay.controller.displayMessage(obj.errors, "error", obj.name);
      return obj;
    };

    Controller.prototype.displayHint = function(obj) {
      var hint, _ref;
      hint = (_ref = this.validator.strategy[obj.name]) != null ? _ref["hint"] : void 0;
      if (!this.successed[obj.name] && (hint != null)) {
        this.messageDisplay.controller.displayMessage([hint], "hint", obj.name);
      }
      return obj;
    };

    Controller.prototype.validate = function(obj) {
      var res;
      res = this.validator.validate(obj.name, obj.value, this.inputs, this);
      if (res.errors) {
        obj.errors = res.errors;
      }
      return obj;
    };

    Controller.prototype.registerError = function(obj) {
      if (obj.errors) {
        this.errors[obj.name] = obj.errors;
        delete this.successed[obj.name];
      } else {
        this.successed[obj.name] = true;
        delete this.errors[obj.name];
      }
      return obj;
    };

    Controller.prototype.highLight = function(obj) {
      var state;
      if (obj.errors) {
        state = "error";
      } else {
        state = "success";
      }
      this.switchState(this.inputs[obj.name], state);
      return obj;
    };

    Controller.prototype.validateAll = function() {
      var firstDefectObjectInForm, formData, name, obj, res, value, _i, _len, _ref;
      firstDefectObjectInForm = void 0;
      formData = {};
      _ref = _.keys(this.fieldNames);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        value = $.trim(this.inputs[name].val());
        formData[name] = value;
        res = this.validate({
          name: name,
          value: value
        });
        if (res.errors) {
          obj = {
            name: name,
            value: value,
            errors: res.errors
          };
          if (!firstDefectObjectInForm) {
            firstDefectObjectInForm = obj;
          }
          this.highLight(obj);
          this.registerError(obj);
        }
      }
      if (firstDefectObjectInForm) {
        this.displayError(firstDefectObjectInForm);
        return this.focusToField(firstDefectObjectInForm);
      } else {
        return this.successHandler(formData);
      }
    };

    Controller.prototype.switchState = function(element, state) {
      return this.messageDisplay.controller.switchState(element, state);
    };

    Controller.prototype.focusToField = function(obj) {
      return this.inputs[obj.name].focus();
    };

    Controller.prototype.swithToInitialState = function(fieldName) {
      this.switchState(this.inputs[fieldName], "initial");
      return fieldName;
    };

    Controller.prototype.forgetField = function(fieldName) {
      delete this.fieldNames[fieldName];
      this.forgotten.push(fieldName);
      delete this.errors[fieldName];
      delete this.successed[fieldName];
      return fieldName;
    };

    Controller.prototype.addStrategyField = function(fieldName) {
      return this.fieldNames[fieldName] = true;
    };

    Controller.prototype.disableField = function(fieldName) {
      this.swithToInitialState(fieldName);
      this.inputs[fieldName].val("").prop("disabled", true);
      return this.forgetField(fieldName);
    };

    Controller.prototype.enableField = function(fieldName) {
      this.fieldNames[fieldName] = true;
      this.inputs[fieldName].prop("disabled", false);
      return this.addStrategyField(fieldName);
    };

    Controller.prototype.clearFieldErrors = function(fieldName) {
      return delete this.errors[fieldName];
    };

    Controller.prototype.reset = function() {
      var fieldName, isActual, _ref, _results,
        _this = this;
      this.successed = {};
      this.errors = {};
      this.hideError();
      _.forEach(this.forgotten, function(fieldName) {
        return _this.fieldNames[fieldName] = true;
      });
      _ref = this.fieldNames;
      _results = [];
      for (fieldName in _ref) {
        isActual = _ref[fieldName];
        if (isActual === true) {
          this.enableField(fieldName);
          _results.push(this.swithToInitialState(fieldName));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Controller.prototype.invoke = function(name, condition) {
      var doInvoke,
        _this = this;
      doInvoke = function(name) {
        var tasks;
        tasks = [_this.validate, _this.registerError, _this.highLight];
        return pipeline(tasks, {
          name: name,
          value: _this.inputs[name].val()
        });
      };
      if (_.indexOf(["not blank", "blank"], condition) === -1) {
        throw new Error("Condition is not recognized!");
      }
      if (condition === "not blank" && $.trim(this.inputs[name].val())) {
        doInvoke(name);
      }
      if (condition === "blank" && !$.trim(this.inputs[name].val())) {
        return doInvoke(name);
      }
    };

    return Controller;

  })();
});
