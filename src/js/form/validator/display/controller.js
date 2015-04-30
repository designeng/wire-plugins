define(["underscore", "jquery", "plugins/utils/normalize"], function(_, $, normalize) {
  var Controller;
  return Controller = (function() {
    function Controller() {}

    Controller.prototype.currentErrorClass = void 0;

    Controller.prototype.basePrefixes = {
      "text": {
        prefix: "formInput__state_show_",
        suffix: "Input"
      },
      "date": {
        prefix: "formInput__state_show_",
        suffix: "Input"
      },
      "select": {
        prefix: "formSelect__state_show_",
        suffix: "Select"
      },
      "number": {
        prefix: "formInput__state_show_",
        suffix: "Input"
      },
      "tel": {
        prefix: "formInput__state_show_",
        suffix: "Input"
      },
      "email": {
        prefix: "formInput__state_show_",
        suffix: "Input"
      },
      "hidden": {
        prefix: "formInput__state_show_",
        suffix: "Input"
      }
    };

    Controller.prototype.onReady = function() {
      var _ref;
      _ref = normalize(this.displayView, this.displaySlot), this.displayView = _ref[0], this.displaySlot = _ref[1];
      return this.listRootNode = this.displayView.find("ul");
    };

    Controller.prototype.displayMessage = function(messages, type, name) {
      var classMessage, htmlTags,
        _this = this;
      if (!messages || !messages.length) {
        return this.displaySlot.hide();
      } else {
        messages = _.flatten(messages);
        htmlTags = _.reduce(messages, function(content, text) {
          if (text) {
            content += _this.listItemPattern({
              text: text,
              type: type
            });
          }
          return content;
        }, "");
        if (htmlTags) {
          this.listRootNode.html(htmlTags);
          classMessage = this.displaySlotClass + "__" + name;
          if (type) {
            classMessage += ' ' + this.displaySlotClass + "_type_" + type;
          }
          this.displaySlot.removeClass(this.currentErrorClass).addClass(classMessage);
          this.currentErrorClass = classMessage;
          return this.displaySlot.show();
        }
      }
    };

    Controller.prototype.hideError = function() {
      return this.displaySlot.hide();
    };

    Controller.prototype.switchState = function(input, state) {
      var basePrefix, classesToRemove, inputType, stateErrorClass, stateSemaphoreElement;
      if (input.size() === 0) {
        return false;
      }
      if (input.attr("data-input-exclusion") === "exclusion") {
        stateErrorClass = input.attr("data-state-error-class");
        stateSemaphoreElement = input.prev();
        if (state === "success" || state === "error") {
          stateSemaphoreElement.addClass(stateErrorClass);
        } else {
          stateSemaphoreElement.removeClass(stateErrorClass);
        }
      } else {
        inputType = input.attr("type");
        basePrefix = this.basePrefixes[inputType].prefix;
        classesToRemove = _.reduce(["success", "error"], function(result, state) {
          return result += basePrefix + state + " ";
        }, "");
        stateSemaphoreElement = input.closest(".form" + this.basePrefixes[inputType].suffix);
        stateSemaphoreElement.removeClass(classesToRemove);
        if (state === "success" || state === "error") {
          stateSemaphoreElement.addClass(basePrefix + state);
        }
      }
      if (state === "success") {
        return this.hideError();
      }
    };

    return Controller;

  })();
});
