define [
    "underscore"
    "jquery"
    "when"
], (_, $, When) ->

    return (options) ->

        createElement = (template, item) ->
            return $.parseHTML template(item)

        # @param {Function} itemPattern - it should be function after handlebars pre-compilation
        insertItem = (listNode, item, itemPattern, transform) ->
            # to propect item mutation
            item = _.clone item

            if transform?
                for fieldKey, transformer of transform
                    if item[fieldKey]
                        item[fieldKey] = transformer item[fieldKey]

            listNode = $(listNode)
            listNode.append createElement(itemPattern, item)

        insertItems = (listNode, items, itemPattern, transform) ->
            if _.isArray(items) and items.length
                _.each items, (item) ->
                    insertItem(listNode, item, itemPattern, transform)
            else
                clearAllItems(listNode)

        updateItem = (listNode, item, itemPattern, transform) ->
            # to propect item mutation
            item = _.clone item
            if transform?
                for fieldKey, transformer of transform
                    if item[fieldKey]
                        item[fieldKey] = transformer item[fieldKey]

            listNode = $(listNode)
            itemNode = listNode.find("#" + item["_id"]).replaceWith createElement(itemPattern, item)

        clearAllItems = (listNode) ->
            listNode = $(listNode)
            listNode.text("")

        # @param {Function} listPattern - it should be function after handlebars pre-compilation
        ensureListRootNode = (target, listPattern, item) ->
            rootNodeArr = target.find("ul")
            if rootNodeArr.length
                return rootNodeArr[0]
            else
                target.append createElement(listPattern, item)
                return ensureListRootNode(target, listPattern, item)

        look = (facet, options, wire) ->
            target = $(facet.target)
            wire(facet.options).then (options) ->
                collection  = options.to.collection
                listPattern = options.listPattern
                itemPattern = options.itemPattern
                transform   = options.transform

                signal = collection.getSignal()
                signal.add (event, entity) ->
                    if event is "add"
                        listNode = ensureListRootNode(target, listPattern, entity)
                        insertItem(listNode, entity, itemPattern, transform)

                    if event is "update"
                        listNode = ensureListRootNode(target, listPattern, entity)
                        updateItem(listNode, entity, itemPattern, transform)

                    if event is "reset"
                        listNode = ensureListRootNode(target, listPattern)
                        # entity is array
                        insertItems(listNode, items = entity, itemPattern, transform)

        lookFacet = (resolver, facet, wire) ->
            resolver.resolve(look(facet, options, wire))

        return pluginInstance = 
            facets:
                look:
                    "ready:before"       : lookFacet