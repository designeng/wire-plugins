define(["underscore", "jquery", "when", "handlebars"], function(_, $, When, Handlebars) {
  return function(options) {
    var clearAllItems, createElement, ensureListRootNode, insertItem, insertItems, look, lookFacet, pluginInstance;
    createElement = function(template, item) {
      return $.parseHTML(template(item));
    };
    insertItem = function(listNode, item, itemPattern) {
      listNode = $(listNode);
      return listNode.append(createElement(itemPattern, item));
    };
    insertItems = function(listNode, items, itemPattern) {
      if (_.isArray(items) && items.length) {
        return _.each(items, function(item) {
          return insertItem(listNode, item, itemPattern);
        });
      } else {
        return clearAllItems(listNode);
      }
    };
    clearAllItems = function(listNode) {
      listNode = $(listNode);
      return listNode.text("");
    };
    ensureListRootNode = function(target, listPattern, item) {
      var rootNodeArr;
      rootNodeArr = target.find("ul");
      if (rootNodeArr.length) {
        return rootNodeArr[0];
      } else {
        target.append(createElement(listPattern, item));
        return ensureListRootNode(target, listPattern, item);
      }
    };
    look = function(facet, options, wire) {
      var target;
      console.debug("look facet");
      target = $(facet.target);
      return wire(facet.options).then(function(options) {
        var collection, itemPattern, listPattern, signal;
        collection = options.to.collection;
        listPattern = options.listPattern;
        itemPattern = options.itemPattern;
        signal = collection.getSignal();
        return signal.add(function(event, entity) {
          var items, listNode;
          console.debug("event::::::::::", event);
          if (event === "add") {
            listNode = ensureListRootNode(target, listPattern, entity);
            insertItem(listNode, entity, itemPattern);
          }
          if (event === "reset") {
            listNode = ensureListRootNode(target, listPattern);
            return insertItems(listNode, items = entity, itemPattern);
          }
        });
      });
    };
    lookFacet = function(resolver, facet, wire) {
      return resolver.resolve(look(facet, options, wire));
    };
    return pluginInstance = {
      facets: {
        look: {
          "ready:before": lookFacet
        }
      }
    };
  };
});
