define(["jquery", "underscore"], function($, _) {
  var Controller;
  return Controller = (function() {
    function Controller() {}

    Controller.prototype.onReady = function() {
      return console.debug("controller");
    };

    return Controller;

  })();
});
