define(['underscore'], function(_) {
  return function(options) {
    var hbsResolver, pluginInstance;
    hbsResolver = function(resolver, name, refObj, wire) {
      return require(["hbs!" + name], function(result) {
        return resolver.resolve(result);
      });
    };
    return pluginInstance = {
      resolvers: {
        hbsResolver: hbsResolver
      }
    };
  };
});
