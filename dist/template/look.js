define(["underscore", "jquery", "when"], function(_, $, When) {
  return function(options) {
    var clearAllItems, createElement, ensureListRootNode, insertItem, insertItems, look, lookFacet, pluginInstance, updateItem;
    createElement = function(template, item) {
      return $.parseHTML(template(item));
    };
    insertItem = function(listNode, item, itemPattern, transform) {
      var element, fieldKey, transformer;
      item = _.clone(item);
      if (transform != null) {
        for (fieldKey in transform) {
          transformer = transform[fieldKey];
          if (item[fieldKey]) {
            item[fieldKey] = transformer(item[fieldKey]);
          }
        }
      }
      listNode = $(listNode);
      element = createElement(itemPattern, item);
      return listNode.append(element);
    };
    insertItems = function(listNode, items, itemPattern, transform) {
      if (_.isArray(items) && items.length) {
        return _.each(items, function(item) {
          return insertItem(listNode, item, itemPattern, transform);
        });
      } else {
        return clearAllItems(listNode);
      }
    };
    updateItem = function(listNode, item, itemPattern, transform) {
      var element, fieldKey, itemNode, transformer;
      item = _.clone(item);
      if (transform != null) {
        for (fieldKey in transform) {
          transformer = transform[fieldKey];
          if (item[fieldKey]) {
            item[fieldKey] = transformer(item[fieldKey]);
          }
        }
      }
      listNode = $(listNode);
      element = createElement(itemPattern, item);
      return itemNode = listNode.find("#" + item["_id"]).replaceWith(element);
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
      target = $(facet.target);
      return wire(facet.options).then(function(options) {
        var collection, itemPattern, listPattern, signal, transform;
        collection = options.to.collection;
        listPattern = options.listPattern;
        itemPattern = options.itemPattern;
        transform = options.transform;
        signal = collection.getSignal();
        return signal.add(function(event, entity) {
          var items, listNode;
          if (event === "add") {
            listNode = ensureListRootNode(target, listPattern, entity);
            insertItem(listNode, entity, itemPattern, transform);
          }
          if (event === "update") {
            listNode = ensureListRootNode(target, listPattern, entity);
            updateItem(listNode, entity, itemPattern, transform);
          }
          if (event === "reset") {
            listNode = ensureListRootNode(target, listPattern);
            return insertItems(listNode, items = entity, itemPattern, transform);
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
