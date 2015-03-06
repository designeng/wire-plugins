define(["underscore", "when", "meld", "rest", "rest/interceptor/mime", "rest/interceptor/entity", "core/servicehub/serviceMap", "core/servicehub/response/index", "core/util/net/isOnline", "core/util/navigation/navigate", "core/util/navigation/navigateToError"], function(_, When, meld, rest, mime, entity, serviceMap, serviceResponse, isOnline, navigate, navigateToError) {
  return function(options) {
    var afterSendRequestAspect, bindToServiceFacet, patchPathWithData, removers, service;
    removers = [];
    patchPathWithData = function(path, data) {
      var dataKeys, dataValues, i, key, _i, _len;
      dataKeys = _.map(_.keys(data), function(key) {
        return "{" + key + "}";
      });
      dataValues = _.values(data);
      i = 0;
      for (_i = 0, _len = dataKeys.length; _i < _len; _i++) {
        key = dataKeys[_i];
        path = path.replace(key, dataValues[i]);
        i++;
      }
      return path;
    };
    afterSendRequestAspect = function(target) {
      var _this = this;
      if (target["afterSendRequest"]) {
        return removers.push(meld.after(target, "sendRequest", function(resultEntityPromise) {
          return When(resultEntityPromise).then(function(resultEntity) {
            return target["afterSendRequest"].call(target, resultEntity);
          });
        }));
      }
    };
    service = function(facet, options, wire) {
      var deferred, serv, services, target, _i, _len, _results;
      target = facet.target;
      services = facet.options;
      if (_.isArray(services)) {
        deferred = When.defer();
        target.services = {};
        target.client = rest.wrap(mime).wrap(entity);
        target["sendRequestSuccess"] = function(response, serviceName) {
          return deferred.resolve(response);
        };
        target["sendRequestErrback"] = function(response) {
          return navigateToError('js', 'Server response error');
        };
        target["sendRequest"] = function(serviceName, data, method) {
          var normalizePath, path, talkWithClient;
          data = data || {};
          if (this.services[serviceName]) {
            path = this.services[serviceName].path;
          }
          method = method || "GET";
          normalizePath = function(path, data) {
            if (!path) {
              throw new Error("Path is not defined in service '" + serviceName + "'!");
            }
            switch (method) {
              case "GET":
                path = patchPathWithData(path, data);
            }
            return path;
          };
          path = normalizePath(path, data);
          talkWithClient = (function(target, serviceName) {
            return target.client({
              path: path,
              data: data,
              method: method
            }).done(function(response) {
              return target["sendRequestSuccess"](response, serviceName);
            }, function(response) {
              return target["sendRequestErrback"](response);
            });
          }).bind(null, target, serviceName);
          console.time("sendRequest");
          console.timeStamp();
          When(isOnline()).then(talkWithClient, talkWithClient);
          return deferred.promise;
        };
        afterSendRequestAspect(target);
        _.bindAll(target, "sendRequest");
        _results = [];
        for (_i = 0, _len = services.length; _i < _len; _i++) {
          serv = services[_i];
          if (serviceMap[serv]) {
            _results.push(target.services[serv] = serviceMap[serv]);
          } else {
            throw new Error("Service is not defined! - " + serv);
          }
        }
        return _results;
      }
    };
    bindToServiceFacet = function(resolver, facet, wire) {
      return resolver.resolve(service(facet, options, wire));
    };
    return {
      facets: {
        bindToService: {
          ready: bindToServiceFacet,
          destroy: function(resolver, proxy, wire) {
            var remover, _i, _len;
            for (_i = 0, _len = removers.length; _i < _len; _i++) {
              remover = removers[_i];
              remover.remove();
            }
            return resolver.resolve();
          }
        }
      }
    };
  };
});
