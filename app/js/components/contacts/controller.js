var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["jquery", "underscore"], function($, _) {
  var Controller;
  return Controller = (function() {
    function Controller() {
      this.clearWarning = __bind(this.clearWarning, this);
      this.displayWarning = __bind(this.displayWarning, this);
      this.addContact = __bind(this.addContact, this);
      this.onDialogClose = __bind(this.onDialogClose, this);
      this.onDialogConfirmation = __bind(this.onDialogConfirmation, this);
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

    Controller.prototype.onListItemClick = function(event) {};

    Controller.prototype.onDialogConfirmation = function() {
      return this.contacts.update({
        _id: this.currentItem._id
      }, this.currentItem);
    };

    Controller.prototype.onDialogClose = function() {
      return this.clearWarning();
    };

    Controller.prototype.addContact = function(item) {
      this.clearAllWarnings();
      this.currentItem = item;
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
      $("#" + key).addClass("list-group-item-warning");
      return true;
    };

    Controller.prototype.clearWarning = function() {
      var key;
      key = this.transformer(this.currentItem._id);
      return $("#" + key).removeClass("list-group-item-warning");
    };

    return Controller;

  })();
});
