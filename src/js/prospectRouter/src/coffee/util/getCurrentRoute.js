define(["hasher"], function(hasher) {
  var getCurrentRoute;
  return getCurrentRoute = function() {
    return hasher.getHash();
  };
});
