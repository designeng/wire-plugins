(function(define, global, document) {
  define(function() {
    var has;
    has = function(feature) {
      var test;
      test = has.cache[feature];
      if (typeof test === 'function') {
        test = (has.cache[feature] = has.cache[feature]());
      }
      return test;
    };
    'use strict';
    has.cache = {
      'dom-addeventlistener': function() {
        return document && 'addEventListener' in document || 'addEventListener' in global;
      },
      'dom-createevent': function() {
        return document && 'createEvent' in document;
      }
    };
    return has;
  });
})((typeof define === 'function' ? define : function(factory) {
  module.exports = factory();
}), this, this.document);
