var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["jquery", "underscore"], function($, _) {
  var Controller;
  return Controller = (function() {
    function Controller() {
      this.add = __bind(this.add, this);
    }

    Controller.prototype.onReady = function() {
      return _.defer(this.add);
    };

    Controller.prototype.add = function() {
      console.debug("added items");
      this.contacts.addItem({
        firstName: "ONE",
        lastName: "TWO",
        email: "test@r.ru"
      });
      return this.contacts.addItem({
        firstName: "TWO",
        lastName: "THREE",
        email: "test2@r.ru"
      });
    };

    return Controller;

  })();
});
