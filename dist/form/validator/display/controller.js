define(["underscore", "jquery", "plugins/utils/normalize"], function(_, $, normalize) {
  var Controller;
  return Controller = (function() {
    function Controller() {}

    Controller.prototype.currentErrorClass = void 0;

    Controller.prototype.onReady = function() {
      var _ref;
      _ref = normalize(this.displayView, this.displaySlot), this.displayView = _ref[0], this.displaySlot = _ref[1];
      return this.listRootNode = this.displayView;
    };

    Controller.prototype.displayMessage = function(messages, type, name) {
      var classMessage, messagesHtml,
        _this = this;
      if (!messages || !messages.length) {
        return this.displaySlot.hide();
      } else {
        messages = _.flatten(messages);
        messagesHtml = _.reduce(messages, function(content, text) {
          if (text) {
            content += _this.displayListItemPattern({
              text: text,
              type: type
            });
          }
          return content;
        }, "");
        if (messagesHtml) {
          this.listRootNode.html(messagesHtml);
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
      if (input.size() === 0) {
        return false;
      }
      if (state === "error") {
        $(input).closest(".form-group").addClass("has-error");
      } else {
        $(input).closest(".form-group").removeClass("has-error");
      }
      if (state === "success") {
        return this.hideError();
      }
    };

    return Controller;

  })();
});
