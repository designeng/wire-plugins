(function(define) {
  define(function(require) {
    /**
    @param rootNode {HTMLElement} the node at which to base the
    nodeFinder searches
    @param options {Object}
    @param options.nodeFinder {Function} querySelector, querySelectorAll, or
    another function that returns HTML elements given a string and a DOM
    node to search from: function (string, root) { return nodeOrList; }
    @return {Function} the returned function creates a binding handler
    for a given binding. it is assumed that the binding has been
    normalized. function (binding, prop) { return handler; }
    */

    var configureHandlerCreator, createInverseHandler, createSafeNodeFinder, defaultInverseNodeHandler, defaultNodeHandler, defaultNodeListHandler, form, guess, normalizeBindings, slice, toArray;
    normalizeBindings = function(binding, defaultProp) {
      var normalized;
      normalized = void 0;
      normalized = [].concat(binding);
      return normalized.map(function(binding) {
        var norm;
        norm = void 0;
        if (typeof binding === 'string') {
          norm = {
            selector: binding
          };
        } else {
          norm = Object.create(binding);
        }
        norm.each = binding.each || binding.handler || defaultNodeHandler;
        if (!norm.prop) {
          norm.prop = defaultProp;
        }
        return norm;
      });
    };
    defaultNodeListHandler = function(nodes, data, info) {
      nodes.forEach(function(node) {
        defaultNodeHandler(node, data, info);
      });
    };
    defaultNodeHandler = function(node, data, info) {
      var attr, current, value;
      attr = void 0;
      value = void 0;
      current = void 0;
      if (node.form) {
        form.setValues(node.form, data, function(_, name) {
          return name === info.prop;
        });
      } else {
        attr = info.attr || guess.propForNode(node);
        value = data[info.prop];
        current = guess.getNodePropOrAttr(node, attr);
        if (current !== value) {
          guess.setNodePropOrAttr(node, attr, value);
        }
      }
    };
    defaultInverseNodeHandler = function(node, data, info) {
      var attr, value;
      attr = void 0;
      value = void 0;
      if (node.form) {
        value = form.getValues(node.form, function(el) {
          return el === node || el.name === node.name;
        });
        data[info.prop] = value[info.prop];
      } else {
        attr = info.attr || guess.propForNode(node);
        data[info.prop] = guess.getNodePropOrAttr(node, attr);
      }
    };
    createInverseHandler = function(binding, propToDom) {
      var domToProp;
      domToProp = binding.inverse || binding.each.inverse;
      return function(item, e) {
        var node;
        node = e.target;
        if (item) {
          domToProp(node, item, binding);
        }
        propToDom(item);
      };
    };
    createSafeNodeFinder = function(nodeFinder) {
      return function(selector, rootNode) {
        if (!selector) {
          return [rootNode];
        } else {
          return toArray(nodeFinder.apply(this, arguments));
        }
      };
    };
    toArray = function(any) {
      if (!any) {
        return [];
      } else if (Array.isArray(any)) {
        return any;
      } else if (any.length) {
        return slice.call(any);
      } else {
        return [any];
      }
    };
    'use strict';
    slice = void 0;
    guess = void 0;
    form = void 0;
    slice = Array.prototype.slice;
    guess = require('./guess');
    form = require('./form');
    defaultNodeHandler.inverse = defaultInverseNodeHandler;
    return configureHandlerCreator = function(rootNode, options) {
      var createBindingHandler, eventBinder, nodeFinder;
      nodeFinder = void 0;
      eventBinder = void 0;
      nodeFinder = options.nodeFinder || options.querySelectorAll || options.querySelector;
      eventBinder = options.on;
      if (!nodeFinder) {
        throw new Error('bindingHandler: options.nodeFinder must be provided');
      }
      nodeFinder = createSafeNodeFinder(nodeFinder);
      return createBindingHandler = function(binding, prop) {
        var addEventListeners, bindingsAsArray, currItem, handler, unlistenAll, unlisteners;
        handler = function(item) {
          var currItem;
          currItem = item;
          bindingsAsArray.forEach(function(binding) {
            var all, each, nodes;
            each = void 0;
            all = void 0;
            nodes = void 0;
            each = binding.each;
            all = binding.all;
            nodes = nodeFinder(binding.selector, rootNode);
            if (all) {
              all(nodes, item, binding, defaultNodeListHandler);
            }
            nodes.forEach(function(node) {
              each(node, item, binding, defaultNodeHandler);
            });
          });
        };
        unlistenAll = function() {
          unlisteners.forEach(function(unlisten) {
            unlisten();
          });
        };
        addEventListeners = function() {
          return bindingsAsArray.reduce((function(unlisteners, binding) {
            var doInverse, events, inverse;
            doInverse = function(e) {
              inverse.call(this, currItem, e);
            };
            inverse = void 0;
            events = void 0;
            events = guess.eventsForNode(nodeFinder(binding.selector, rootNode));
            if (events.length > 0) {
              inverse = createInverseHandler(binding, handler);
              events.forEach(function(event) {
                unlisteners.push(eventBinder(rootNode, event, doInverse, binding.selector));
              });
            }
            return unlisteners;
          }), []);
        };
        bindingsAsArray = void 0;
        unlisteners = void 0;
        currItem = void 0;
        bindingsAsArray = normalizeBindings(binding, prop);
        unlisteners = addEventListeners();
        handler.unlisten = unlistenAll;
        return handler;
      };
    };
  });
})((typeof define === 'function' && define.amd ? define : function(factory) {
  module.exports = factory(require);
}));
