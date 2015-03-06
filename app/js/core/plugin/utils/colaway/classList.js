(function(define) {
  define(function(require, exports) {
    /**
    Returns the list of class names on a node as an array.
    @param node {HTMLElement}
    @returns {Array}
    */

    var addClass, classRx, closeRx, getClassList, getClassSet, innerRx, innerSpacesRx, openRx, outerSpacesRx, removeClass, setClassList, setClassSet, spliceClassNames, splitClassNameRx, splitClassNamesRx, trim, trimLeadingRx;
    getClassList = function(node) {
      return node.className.split(splitClassNameRx);
    };
    /**
    Adds a list of class names on a node and optionally removes some.
    @param node {HTMLElement}
    @param list {Array|Object} a list of class names to add.
    @param [list.add] {Array} a list of class names to add.
    @param [list.remove] {Array} a list of class names to remove.
    @returns {Array} the resulting class names on the node
    
    @description The list param may be supplied with any of the following:
    simple array:
    setClassList(node, ['foo-box', 'bar-box']) (all added)
    simple array w/ remove property:
    list = ['foo-box', 'bar-box'];
    list.remove = ['baz-box'];
    setClassList(node, list);
    object with add and remove array properties:
    list = {
    add: ['foo-box', 'bar-box'],
    remove: ['baz-box']
    };
    setClassList(node, list);
    */

    setClassList = function(node, list) {
      var adds, removes;
      adds = void 0;
      removes = void 0;
      if (list) {
        adds = list.add || list || [];
        removes = list.remove || [];
        node.className = spliceClassNames(node.className, removes, adds);
      }
      return getClassList(node);
    };
    getClassSet = function(node) {
      var className, classNames, set;
      set = void 0;
      classNames = void 0;
      className = void 0;
      set = {};
      classNames = node.className.split(splitClassNameRx);
      while ((className = classNames.pop())) {
        set[className] = true;
      }
      return set;
    };
    /**
    @param node
    @param classSet {Object}
    @description
    Example bindings:
    stepsCompleted: {
    node: 'viewNode',
    prop: 'classList',
    enumSet: ['one', 'two', 'three']
    },
    permissions: {
    node: 'myview',
    prop: 'classList',
    enumSet: {
    modify: 'can-edit-data',
    create: 'can-add-data',
    remove: 'can-delete-data'
    }
    }
    */

    setClassSet = function(node, classSet) {
      var adds, newList, p, removes;
      removes = void 0;
      adds = void 0;
      p = void 0;
      newList = void 0;
      removes = [];
      adds = [];
      for (p in classSet) {
        if (p) {
          if (classSet[p]) {
            adds.push(p);
          } else {
            removes.push(p);
          }
        }
      }
      return node.className = spliceClassNames(node.className, removes, adds);
    };
    /**
    Adds and removes class names to a string.
    @private
    @param className {String} current className
    @param removes {Array} class names to remove
    @param adds {Array} class names to add
    @returns {String} modified className
    */

    spliceClassNames = function(className, removes, adds) {
      var leftovers, rx;
      rx = void 0;
      leftovers = void 0;
      removes = trim(removes.concat(adds).join(' '));
      adds = trim(adds.join(' '));
      rx = new RegExp(openRx + removes.replace(innerSpacesRx, innerRx) + closeRx, 'g');
      return trim(className.replace(rx, function(m) {
        if (!m && adds) {
          return ' ' + adds;
        } else {
          return '';
        }
      }));
    };
    trim = function(str) {
      return str.replace(outerSpacesRx, '');
    };
    addClass = function(className, str) {
      var newClass;
      newClass = removeClass(className, str);
      if (newClass && className) {
        newClass += ' ';
      }
      return newClass + className;
    };
    removeClass = function(removes, tokens) {
      var rx;
      rx = void 0;
      if (!removes) {
        return tokens;
      }
      removes = removes.replace(splitClassNamesRx, function(m, inner, edge) {
        if (edge) {
          return '';
        } else {
          return '|';
        }
      });
      rx = new RegExp(classRx.replace('classNames', removes), 'g');
      return tokens.replace(rx, '').replace(trimLeadingRx, '');
    };
    splitClassNameRx = /\s+/;
    classRx = '(\\s+|^)(classNames)(\\b(?![\\-_])|$)';
    trimLeadingRx = /^\s+/;
    splitClassNamesRx = /(\b\s+\b)|(\s+)/g;
    openRx = void 0;
    closeRx = void 0;
    innerRx = void 0;
    innerSpacesRx = void 0;
    outerSpacesRx = void 0;
    openRx = '(?:\\b\\s+|^\\s*)(';
    closeRx = ')(?:\\b(?!-))|(?:\\s*)$';
    innerRx = '|';
    innerSpacesRx = /\b\s+\b/;
    outerSpacesRx = /^\s+|\s+$/;
    return {
      addClass: addClass,
      removeClass: removeClass,
      getClassList: getClassList,
      setClassList: setClassList,
      getClassSet: getClassSet,
      setClassSet: setClassSet
    };
  });
})((typeof define === 'function' ? define : function(factory) {
  module.exports = factory(require);
}));
