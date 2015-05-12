var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["jquery", "underscore"], function($, _) {
  var Controller;
  return Controller = (function() {
    function Controller() {
      this.displayWarning = __bind(this.displayWarning, this);
      this.addContact = __bind(this.addContact, this);
    }

    Controller.prototype.contactsRootElement = null;

    Controller.prototype.onReady = function() {
      this.contactsPreloader = $(".contacts-preloader");
      this.contacts.onKeyRepeat(this.displayWarning);
      return this.loadContacts();
    };

    Controller.prototype.loadContacts = function() {
      var _this = this;
      return setTimeout(function() {
        _this.contactsPreloader.hide();
        _this.contacts.addItem({
          firstName: "JOHN",
          lastName: "STARKY",
          email: "john@el.com"
        });
        return _this.contacts.addItem({
          firstName: "RICHARD",
          lastName: "TEDDY",
          email: "rich@el.com"
        });
      }, 1000);
    };

    Controller.prototype.onSubmit = function() {
      return false;
    };

    Controller.prototype.onListItemClick = function(event) {
      return console.debug("onListItemClick", $(event.target).closest("li"));
    };

    Controller.prototype.onDialogConfirmation = function() {
      return console.debug("onDialogConfirmation");
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
