(function(define) {
  define(function(require) {
    var attrToProp, classList, customAccessors, formClickableRx, formValueNodeRx, getNodePropOrAttr, guess, guessEventsFor, guessPropFor, has, initSetGet, isClickableFormNode, isFormValueNode, setNodePropOrAttr;
    isFormValueNode = function(node) {
      return formValueNodeRx.test(node.tagName);
    };
    isClickableFormNode = function(node) {
      return isFormValueNode(node) && formClickableRx.test(node.type);
    };
    guessEventsFor = function(node) {
      if (Array.isArray(node)) {
        return node.reduce(function(events, node) {
          return events.concat(guessEventsFor(node).filter(function(event) {
            return event && events.indexOf(event) < 0;
          }));
        }, []);
      } else if (isFormValueNode(node)) {
        return [(isClickableFormNode(node) ? 'click' : 'change'), 'focusout'];
      }
      return [];
    };
    guessPropFor = function(node) {
      if (isFormValueNode(node)) {
        if (isClickableFormNode(node)) {
          return 'checked';
        } else {
          return 'value';
        }
      } else {
        return 'textContent';
      }
    };
    /**
    Returns a property or attribute of a node.
    @param node {Node}
    @param name {String}
    @returns the value of the property or attribute
    */

    getNodePropOrAttr = function(node, name) {
      var accessor, prop;
      accessor = void 0;
      prop = void 0;
      accessor = customAccessors[name];
      prop = attrToProp[name] || name;
      if (accessor) {
        return accessor.get(node);
      } else if (prop in node) {
        return node[prop];
      } else {
        return node.getAttribute(prop);
      }
    };
    /**
    Sets a property of a node.
    @param node {Node}
    @param name {String}
    @param value
    */

    setNodePropOrAttr = function(node, name, value) {
      var accessor, prop;
      accessor = void 0;
      prop = void 0;
      accessor = customAccessors[name];
      prop = attrToProp[name] || name;
      if (node.nodeName === 'option' && prop === 'innerText') {
        prop = 'text';
      }
      if (accessor) {
        return accessor.set(node, value);
      } else if (prop in node) {
        node[prop] = value;
      } else {
        node.setAttribute(prop, value);
      }
      return value;
    };
    /**
    Initializes the dom setter and getter at first invocation.
    @private
    @param node
    @param attr
    @param [value]
    @return {*}
    */

    initSetGet = function(node, attr, value) {
      attrToProp.textContent = ('textContent' in node ? 'textContent' : 'innerText');
      guess.setNodePropOrAttr = setNodePropOrAttr;
      guess.getNodePropOrAttr = getNodePropOrAttr;
      if (arguments.length === 3) {
        return setNodePropOrAttr(node, attr, value);
      } else {
        return getNodePropOrAttr(node, attr);
      }
    };
    'use strict';
    guess = void 0;
    has = void 0;
    classList = void 0;
    formValueNodeRx = void 0;
    formClickableRx = void 0;
    attrToProp = void 0;
    customAccessors = void 0;
    has = require('./has');
    classList = require('./classList');
    formValueNodeRx = /^(input|select|textarea)$/i;
    formClickableRx = /^(checkbox|radio)/i;
    attrToProp = {
      "class": 'className',
      "for": 'htmlFor'
    };
    customAccessors = {
      classList: {
        get: classList.getClassList,
        set: classList.setClassList
      },
      classSet: {
        get: classList.getClassSet,
        set: classList.setClassSet
      }
    };
    guess = {
      isFormValueNode: isFormValueNode,
      eventsForNode: guessEventsFor,
      propForNode: guessPropFor,
      getNodePropOrAttr: initSetGet,
      setNodePropOrAttr: initSetGet
    };
    return guess;
  });
})((typeof define === 'function' ? define : function(factory) {
  module.exports = factory(require);
}));
