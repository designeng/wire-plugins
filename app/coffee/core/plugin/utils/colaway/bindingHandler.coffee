((define) ->
    define (require) ->
        
        #
        #	TODO: inverse bind handler:
        #	V create "on!" wire reference resolver
        #	2. look for inverse property in spec that acts as an each.inverse
        #	3. look for inverse on "each" handler
        #	4. provide an inverse function for our defaultNodeHandler
        #	5. use guess.js to guess events
        #	 
        
        #
        #	bind: {
        #		to: { $ref: 'colaThing' },
        #		map: {
        #			prop1: [
        #				{ selector: 'input.my' , attr: 'value' },
        #				{ selector: 'a selector', handler: { $ref: 'someFunction' } },
        #				{ selector: '.selector', attr: 'text', handler: { $ref: 'aNodeHandlerFunction' } }
        #				{
        #					selector: '.many',
        #					attr: 'text',
        #					each: { $ref: 'aNodeHandlerFunction' },
        #					all: { $ref: 'aNodeListHandlerFunction' }
        #				}
        #			]
        #		}
        #	}
        #
        #	function aNodeHandlerFunction (node, data, info, doDefault) {
        #		var selector, attr, data, prop;
        #		selector = info.selector;
        #		attr = info.attr;
        #		prop = info.prop;
        #		doDefault(node, info);
        #	}
        #
        #	function aNodeListHandlerFunction (nodes, data, info, doDefault) {
        #		var selector, attr, data, prop;
        #		selector = info.selector;
        #		attr = info.attr;
        #		prop = info.prop;
        #		nodes.forEach(function (node) {
        #			doDefault(node, info);
        #		});
        #	}
        #
        #	
        
        ###*
        @param rootNode {HTMLElement} the node at which to base the
        nodeFinder searches
        @param options {Object}
        @param options.nodeFinder {Function} querySelector, querySelectorAll, or
        another function that returns HTML elements given a string and a DOM
        node to search from: function (string, root) { return nodeOrList; }
        @return {Function} the returned function creates a binding handler
        for a given binding. it is assumed that the binding has been
        normalized. function (binding, prop) { return handler; }
        ###
        
        # get all affected nodes
        
        # run handler for entire nodelist, if any
        
        # run custom or default handler for each node
        
        # grab some nodes to use to guess events to watch
        normalizeBindings = (binding, defaultProp) ->
            normalized = undefined
            normalized = [].concat(binding)
            normalized.map (binding) ->
                norm = undefined
                if typeof binding is 'string'
                    norm = selector: binding
                else
                    norm = Object.create(binding)
                norm.each = binding.each or binding.handler or defaultNodeHandler
                norm.prop = defaultProp    unless norm.prop
                norm

        defaultNodeListHandler = (nodes, data, info) ->
            nodes.forEach (node) ->
                defaultNodeHandler node, data, info
                return

            return
        defaultNodeHandler = (node, data, info) ->
            attr = undefined
            value = undefined
            current = undefined
            if node.form
                form.setValues node.form, data, (_, name) ->
                    name is info.prop

            else
                attr = info.attr or guess.propForNode(node)
                value = data[info.prop]
                
                # always compare first to try to prevent unnecessary IE reflow/repaint
                current = guess.getNodePropOrAttr(node, attr)
                guess.setNodePropOrAttr node, attr, value    if current isnt value
            return
        defaultInverseNodeHandler = (node, data, info) ->
            attr = undefined
            value = undefined
            if node.form
                value = form.getValues(node.form, (el) ->
                    el is node or el.name is node.name
                )
                data[info.prop] = value[info.prop]
            else
                attr = info.attr or guess.propForNode(node)
                data[info.prop] = guess.getNodePropOrAttr(node, attr)
            return
        createInverseHandler = (binding, propToDom) ->
            domToProp = binding.inverse or binding.each.inverse
            (item, e) ->
                node = e.target
                
                # update item
                domToProp node, item, binding    if item
                
                # is there any other way to know which binding.each/binding.all to execute?
                propToDom item
                return
        createSafeNodeFinder = (nodeFinder) ->
            (selector, rootNode) ->
                unless selector
                    [rootNode]
                else
                    toArray nodeFinder.apply(this, arguments)
        toArray = (any) ->
            unless any # nothin
                []
            else if Array.isArray(any) # array
                any
            else if any.length # nodelist
                slice.call any
            else # single node
                [any]
        'use strict'
        slice = undefined
        guess = undefined
        form = undefined
        slice = Array::slice
        guess = require('./guess')
        form = require('./form')
        defaultNodeHandler.inverse = defaultInverseNodeHandler
        return configureHandlerCreator = (rootNode, options) ->
            nodeFinder = undefined
            eventBinder = undefined
            nodeFinder = options.nodeFinder or options.querySelectorAll or options.querySelector
            eventBinder = options.on
            throw new Error('bindingHandler: options.nodeFinder must be provided')    unless nodeFinder
            nodeFinder = createSafeNodeFinder(nodeFinder)
            createBindingHandler = (binding, prop) ->
                handler = (item) ->
                    currItem = item
                    bindingsAsArray.forEach (binding) ->
                        each = undefined
                        all = undefined
                        nodes = undefined
                        each = binding.each
                        all = binding.all
                        nodes = nodeFinder(binding.selector, rootNode)
                        all nodes, item, binding, defaultNodeListHandler    if all
                        nodes.forEach (node) ->
                            each node, item, binding, defaultNodeHandler
                            return

                        return

                    return
                unlistenAll = ->
                    unlisteners.forEach (unlisten) ->
                        unlisten()
                        return

                    return
                addEventListeners = ->
                    bindingsAsArray.reduce ((unlisteners, binding) ->
                        doInverse = (e) ->
                            inverse.call this, currItem, e
                            return
                        inverse = undefined
                        events = undefined
                        events = guess.eventsForNode(nodeFinder(binding.selector, rootNode))
                        if events.length > 0
                            inverse = createInverseHandler(binding, handler)
                            events.forEach (event) ->
                                unlisteners.push eventBinder(rootNode, event, doInverse, binding.selector)
                                return

                        unlisteners
                    ), []
                bindingsAsArray = undefined
                unlisteners = undefined
                currItem = undefined
                bindingsAsArray = normalizeBindings(binding, prop)
                unlisteners = addEventListeners()
                handler.unlisten = unlistenAll
                return handler
                return

        return

    return
) (if typeof define is 'function' and define.amd then define else (factory) ->
    module.exports = factory(require)
    return
)