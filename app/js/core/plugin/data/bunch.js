define(["underscore", "underscore.string", "jquery", "when", "meld", "wire/lib/object", "kefir", "kefirJquery", "eventEmitter"], function(_, _Str, $, When, meld, object, Kefir, KefirJquery, EventEmitter) {
  KefirJquery.init(Kefir, $);
  return function(options) {
    var getByInputStreams, getByPropertyStreams, getClassAndMethod, getEventName, getbyInvocationStreams, isRef, mergeWithCombinedStreams, pluginInstance, removers, valuesBunchFacetReady, valuesSeparatelyFacetReady;
    removers = [];
    isRef = function(it) {
      return it && object.hasOwn(it, '$ref');
    };
    getEventName = function(providerName, propertyName) {
      return propertyName + _Str.capitalize(providerName) + "PropertyEvent";
    };
    getClassAndMethod = function(str) {
      return str.split(".").slice(0, 2);
    };
    mergeWithCombinedStreams = function(streams, combinedStreams) {
      var combined, items;
      items = _.values(combinedStreams);
      combined = [];
      _.forEach(combinedStreams, function(obj, key) {
        var combinator;
        if (_.indexOf(combined, key) !== -1) {
          return null;
        }
        combinator = function(res) {
          return res;
        };
        streams.push(Kefir.combine([
          obj.stream, _.find(items, {
            original: key
          }).stream
        ]));
        combined.push(key);
        return combined.push(obj.original);
      });
      return streams;
    };
    getbyInvocationStreams = function(byInvocation, wire) {
      var aspectModes, combinedStreams, grouped, spec, streams;
      streams = [];
      combinedStreams = {};
      aspectModes = ["before", "after"];
      grouped = _.groupBy(byInvocation, function(item) {
        return item.$ref.split(".")[0];
      });
      spec = _.reduce(grouped, function(result, item, itemName) {
        result.providers[itemName] = {
          $ref: itemName
        };
        return result;
      }, {
        providers: {}
      });
      return wire(spec).then(function(context) {
        _.forEach(context.providers, function(provider, providerName) {
          if (provider.emitter == null) {
            provider.emitter = new EventEmitter();
          }
          return _.forEach(grouped[providerName], function(item) {
            var aspectMode, eventName, invoker, providerClass, _ref;
            _ref = getClassAndMethod(item["$ref"]), providerClass = _ref[0], invoker = _ref[1];
            aspectMode = item["aspectMode"] || "after";
            if (_.indexOf(aspectModes, aspectMode) === -1) {
              throw new Error("Aspect mode should be in [after, before] !");
            }
            eventName = getEventName(providerName, invoker);
            removers.push(meld[aspectMode](provider, invoker, function(result) {
              return provider.emitter.emit(eventName, result);
            }));
            if (item["combineWith"]) {
              return combinedStreams[item["combineWith"]] = {
                original: item["$ref"],
                stream: Kefir.fromEvent(provider.emitter, eventName)
              };
            } else {
              return streams.push(Kefir.fromEvent(provider.emitter, eventName));
            }
          });
        });
        streams = mergeWithCombinedStreams(streams, combinedStreams);
        return streams;
      });
    };
    getByPropertyStreams = function(byProperty, wire) {
      var emitProperty, grouped, spec, streams;
      streams = [];
      emitProperty = function(provider, propertyName) {
        return provider.emit(getEventName(propertyName), provider.getProperty(propertyName));
      };
      grouped = _.groupBy(byProperty, function(item) {
        return item.at.$ref;
      });
      spec = _.reduce(grouped, function(result, item, itemName) {
        result.providers[itemName] = {
          $ref: itemName
        };
        return result;
      }, {
        providers: {}
      });
      return wire(spec).then(function(context) {
        _.forEach(context.providers, function(provider, providerName) {
          removers.push(meld.before(provider, "setProperty", function(propertyName, propertyValue) {
            return provider.emit(getEventName(providerName, propertyName), propertyValue);
          }));
          return _.forEach(grouped[providerName], function(item) {
            return streams.push(Kefir.fromEvent(provider, getEventName(providerName, item.name)));
          });
        });
        return streams;
      });
    };
    getByInputStreams = function(byInput, target) {
      var form, inputs;
      if (byInput != null) {
        form = $(target);
        inputs = [];
      } else {
        return [];
      }
      return _.map(byInput, function(name) {
        var $input, getFieldData;
        $input = form.find("[name='" + name + "']");
        if (!$input.length) {
          throw new Error("Not found input with name '" + name + "'!");
        }
        inputs[name] = $input;
        getFieldData = (function(name) {
          return function() {
            var obj;
            obj = {
              name: name,
              value: inputs[name].val()
            };
            return obj;
          };
        })(name);
        return $input.asKefirStream("change", getFieldData);
      });
    };
    valuesBunchFacetReady = function(resolver, facet, wire) {
      var inputs, promises, target;
      inputs = [];
      target = facet.target;
      promises = [];
      promises.push(getByPropertyStreams(facet.options.byProperty, wire));
      promises.push(getbyInvocationStreams(facet.options.byInvocation, wire));
      promises.push(getByInputStreams(facet.options.byInput, target));
      return When.all(promises).then(function(streams) {
        streams = _.flatten(streams);
        return wire(facet.options).then(function(options) {
          var deliverTo, deliverToCallback;
          deliverTo = options.deliverTo;
          if (_.isPlainObject(deliverTo)) {
            deliverToCallback = function(res) {
              return deliverTo = _.extend(deliverTo, res);
            };
          } else if (_.isFunction(deliverTo)) {
            deliverToCallback = deliverTo;
          } else {
            throw new Error("Option 'deliverTo' should be function or plain js object!");
          }
          Kefir.merge(streams).onValue(deliverToCallback);
          return resolver.resolve();
        });
      });
    };
    valuesSeparatelyFacetReady = function(resolver, facet, wire) {
      var form, inputs, itemAttributes, streams, target;
      inputs = [];
      streams = [];
      target = facet.target;
      form = $(target);
      if (!_.isArray(facet.options)) {
        throw new Error("ValuesSeparately facet value should be Array!");
      }
      itemAttributes = ["field", "consumer"];
      _.each(facet.options, function(item) {
        var deferred, getFieldData;
        _.each(itemAttributes, function(attr) {
          if (!this.hasOwnProperty(attr)) {
            throw new Error("ValuesSeparately facet item should have '" + attr + "' attribute!");
          }
        }, item);
        if (!_.isString(item.field)) {
          throw new Error("ValuesSeparately facet item 'field' should be a string!");
        }
        inputs[item.field] = form.find("[name='" + item.field + "']");
        getFieldData = (function(name) {
          return function() {
            var obj;
            obj = {
              name: name,
              value: inputs[name].val()
            };
            return obj;
          };
        })(item.field);
        deferred = When.defer();
        wire({
          $ref: item.consumer
        }).then(function(consumer) {
          return deferred.resolve(consumer);
        });
        return streams[item.field] = inputs[item.field].asKefirStream("change", getFieldData).onValue(function(value) {
          return When(deferred.promise).then(function(consumer) {
            return consumer(value);
          });
        });
      });
      return resolver.resolve();
    };
    pluginInstance = {
      facets: {
        valuesBunch: {
          "ready": valuesBunchFacetReady
        },
        valuesSeparately: {
          "ready": valuesSeparatelyFacetReady
        }
      }
    };
    return pluginInstance;
  };
});
