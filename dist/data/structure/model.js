define(['underscore'], function(_) {
  return function(options) {
    var getPropertyResolver, pluginInstance;
    getPropertyResolver = function(resolver, name, refObj, wire) {
      var resolverOptions;
      resolverOptions = {
        from: refObj.from,
        transform: refObj.transform || function(value) {
          return value;
        }
      };
      return wire(resolverOptions).then(function(options) {
        return resolver.resolve(options.transform(options.from.getProperty(name)));
      });
    };
    return pluginInstance = {
      resolvers: {
        getProperty: getPropertyResolver
      }
    };
  };
});
