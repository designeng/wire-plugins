var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["jquery", "underscore", "./hashCode"], function($, _, hashCode) {
  var Controller;
  return Controller = (function() {
    function Controller() {
      this.displayWarning = __bind(this.displayWarning, this);
      this.addContact = __bind(this.addContact, this);
    }

    Controller.prototype.contactsRootElement = null;

    Controller.prototype.onReady = function() {
      var _this = this;
      this.contactsPreloader = $(".contacts-preloader");
      this.contacts.onKeyRepeat(this.displayWarning);
      return setTimeout(function() {
        return _this.add();
      }, 1000);
    };

    Controller.prototype.add = function() {
      this.contactsPreloader.hide();
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

    Controller.prototype.onSubmit = function() {
      return false;
    };

    Controller.prototype.addContact = function(item) {
      this.clearAllWarnings();
      return this.contacts.addItem(item);
    };

    Controller.prototype.clearAllWarnings = function() {
      return _.forEach(this.contactsList.getElementsByTagName("li"), function(element) {
        return $(element).removeClass("list-group-item-warning");
      });
    };

    Controller.prototype.displayWarning = function(item) {
      var key;
      key = this.transformer(item._id);
      return $("#" + key).addClass("list-group-item-warning");
    };

    return Controller;

  })();
});
