(function(define, global, document) {
  define(function(require) {
    /**
    Register a callback to be invoked when events with the supplied name
    occur on the supplied node.
    @param node {Node} DomNode on which to listen for events
    @param name {String} name of the event, e.g. "click"
    @param callback {Function} event handler function to invoke
    */

    var allUnwatches, doWatchNode, fireSimpleEvent, has, squelchedUnwatch, watchNode;
    watchNode = function(node, name, callback) {
      return doWatchNode(node, name, callback);
    };
    squelchedUnwatch = function(unwatch) {
      try {
        unwatch();
      } catch (_error) {}
    };
    'use strict';
    has = void 0;
    doWatchNode = void 0;
    fireSimpleEvent = void 0;
    allUnwatches = void 0;
    has = require('./has');
    allUnwatches = [];
    if (has('dom-addeventlistener')) {
      doWatchNode = function(node, name, callback) {
        node.addEventListener(name, callback, false);
        return function() {
          node && node.removeEventListener(name, callback, false);
        };
      };
    } else {
      doWatchNode = function(node, name, callback) {
        var handlerName, unwatch;
        handlerName = void 0;
        unwatch = void 0;
        handlerName = 'on' + name;
        node.attachEvent(handlerName, callback);
        unwatch = function() {
          node && node.detachEvent(handlerName, callback);
        };
        allUnwatches.push(unwatch);
        return unwatch;
      };
      if ('onunload' in global) {
        watchNode(global, 'unload', function() {
          var unwatch;
          unwatch = void 0;
          while ((unwatch = allUnwatches.pop())) {
            squelchedUnwatch(unwatch);
          }
        });
      }
    }
    if (has('dom-createevent')) {
      fireSimpleEvent = function(node, type, bubbles, data) {
        var evt;
        evt = void 0;
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(type, bubbles, true);
        evt.data = data;
        node.dispatchEvent(evt);
      };
    } else {
      fireSimpleEvent = function(node, type, bubbles, data) {
        var evt;
        evt = void 0;
        evt = document.createEventObject();
        evt.data = data;
        node.fireEvent('on' + type, evt);
      };
    }
    return {
      watchNode: watchNode,
      fireSimpleEvent: fireSimpleEvent
    };
  });
})((typeof define === 'function' ? define : function(factory) {
  module.exports = factory(require);
}), this, this.document);
