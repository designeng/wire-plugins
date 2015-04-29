var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["underscore", "jquery", "when", "meld", "wire/lib/object", "core/util/surrogate/ClonedCollection", "kefir", "kefirJquery"], function(_, $, When, meld, object, ClonedCollection, Kefir, KefirJquery) {
  KefirJquery.init(Kefir, $);
  return function(options) {
    var addAspect, addFilterFacetReady, bindFiltersToFieldsFacetReady, checkMethod, cleanRemovers, cloneStructureFactory, getClassAndMethod, isRef, normalizeFilters, onFilteredFacetReady, pluginInstance, removers, targetCollection;
    targetCollection = null;
    removers = [];
    isRef = function(it) {
      return it && object.hasOwn(it, '$ref');
    };
    addAspect = function(filterReferenceObj, wire) {
      var allowedAspects, aspectKeys;
      if (!isRef(filterReferenceObj)) {
        throw new Error("Filter should be described as wire reference!");
      }
      allowedAspects = ["after"];
      aspectKeys = _.filter(_.keys(filterReferenceObj), function(key) {
        return key !== "$ref" && __indexOf.call(allowedAspects, key) >= 0;
      });
      return _.each(aspectKeys, function(aspectKey) {
        var invoker, providerClass, spec, _ref;
        _ref = getClassAndMethod(filterReferenceObj[aspectKey]), providerClass = _ref[0], invoker = _ref[1];
        spec = {
          provider: {
            $ref: providerClass
          },
          filter: filterReferenceObj
        };
        return wire(spec).then(function(specObject) {
          return removers.push(meld[aspectKey](specObject.provider, invoker, function(result) {
            targetCollection["_filterOptions"] = result;
            return targetCollection.applyFilter(specObject.filter);
          }));
        });
      });
    };
    getClassAndMethod = function(str) {
      return str.split(".").slice(0, 2);
    };
    checkMethod = function(classObject, method) {
      if (!_.isFunction(classObject[method])) {
        throw new Error("Method " + method + " should be defined in the object class!");
      }
      return true;
    };
    normalizeFilters = function(filters) {
      if (_.isArray(filters)) {
        return filters;
      } else if (isRef(filters)) {
        return [filters];
      } else if (_.isFunction(filters)) {
        return [filters];
      }
    };
    cloneStructureFactory = function(resolver, compDef, wire) {
      return wire(compDef.options).then(function(structure) {
        targetCollection = new ClonedCollection();
        removers.push(meld.after(structure, "addSource", function(source) {
          return targetCollection.cloneSource(source);
        }));
        targetCollection.cloneSource(structure.getSource());
        return resolver.resolve(targetCollection);
      });
    };
    addFilterFacetReady = function(resolver, facet, wire) {
      var filters;
      filters = normalizeFilters(facet.options);
      _.each(filters, function(filterReferenceObj) {
        return addAspect(filterReferenceObj, wire);
      });
      return resolver.resolve();
    };
    onFilteredFacetReady = function(resolver, facet, wire) {
      return wire(facet.options).then(function(callback) {
        if (!_.isFunction(callback)) {
          throw new Error("Provided to onFiltered facet should be function!");
        }
        removers.push(meld.after(targetCollection, "applyFilter", function(source) {
          return callback(source);
        }));
        return resolver.resolve();
      });
    };
    bindFiltersToFieldsFacetReady = function(resolver, facet, wire) {
      var inputs, streams, target;
      inputs = [];
      streams = [];
      target = facet.target;
      return wire(facet.options).then(function(options) {
        var form;
        form = $(options.form);
        _.each(options.fieldNames, function(name) {
          var getFieldData;
          inputs[name] = form.find("[name='" + name + "']");
          getFieldData = (function(name) {
            return function() {
              var obj;
              obj = {
                event: event,
                name: name,
                value: inputs[name].val()
              };
              return obj;
            };
          })(name);
          return streams["change"] = inputs[name].asKefirStream(event, getFieldData).onValue(function(value) {
            return console.debug("ON VALUE:::", value);
          });
        });
        console.debug("streams", streams);
        return resolver.resolve();
      });
    };
    cleanRemovers = function() {
      return _.each(removers, function(remover) {
        return remover.remove();
      });
    };
    pluginInstance = {
      context: {
        destroy: function(resolver, wire) {
          return resolver.resolve(cleanRemovers);
        }
      },
      factories: {
        cloneStructure: cloneStructureFactory
      },
      facets: {
        addFilter: {
          "ready": addFilterFacetReady
        },
        onFiltered: {
          "ready": onFilteredFacetReady
        },
        bindFiltersToFields: {
          "ready": bindFiltersToFieldsFacetReady
        }
      }
    };
    return pluginInstance;
  };
});
