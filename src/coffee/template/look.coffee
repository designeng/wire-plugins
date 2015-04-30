define [
    "underscore"
    "jquery"
    "when"
    "handlebars"
], (_, $, When, Handlebars) ->

    return (options) ->

        createElement = (template, item) ->
            return $.parseHTML template(item)

        # @param {Function} itemPattern - it should be function after handlebars pre-compilation
        insertItem = (listNode, item, itemPattern) ->
            listNode = $(listNode)
            listNode.append createElement(itemPattern, item)

        insertItems = (listNode, items, itemPattern) ->
            if _.isArray(items) and items.length
                _.each items, (item) ->
                    insertItem(listNode, item, itemPattern)
            else
                clearAllItems(listNode)

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

                signal = collection.getSignal()
                signal.add (event, entity) ->
                    if event is "add"
                        listNode = ensureListRootNode(target, listPattern, entity)
                        insertItem(listNode, entity, itemPattern)
                    if event is "reset"
                        listNode = ensureListRootNode(target, listPattern)
                        # entity is array
                        insertItems(listNode, items = entity, itemPattern)

        lookFacet = (resolver, facet, wire) ->
            resolver.resolve(look(facet, options, wire))

        return pluginInstance = 
            facets:
                look:
                    ready       : lookFacet
