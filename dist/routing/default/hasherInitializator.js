var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["hasher", "core/util/navigation/navigate"], function(hasher, navigate) {
  var HasherInitializator;
  return HasherInitializator = (function() {
    function HasherInitializator() {
      this.initialize = __bind(this.initialize, this);
      this.parseHash = __bind(this.parseHash, this);
    }

    HasherInitializator.prototype.parseHash = function(newHash, oldHash) {
      if (newHash.slice(-1) === "/") {
        navigate(newHash.slice(0, -1), "replace");
        return void 0;
      }
      this.appRouterController.parse(newHash);
      return {
        newHash: newHash,
        oldHash: oldHash
      };
    };

    HasherInitializator.prototype.initialize = function() {
      hasher.initialized.add(this.parseHash);
      hasher.changed.add(this.parseHash);
      hasher.prependHash = "";
      return hasher.init();
    };

    return HasherInitializator;

  })();
});
