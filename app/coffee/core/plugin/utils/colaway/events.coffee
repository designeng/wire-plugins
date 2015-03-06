((define, global, document) ->
    define (require) ->
        
        ###*
        Register a callback to be invoked when events with the supplied name
        occur on the supplied node.
        @param node {Node} DomNode on which to listen for events
        @param name {String} name of the event, e.g. "click"
        @param callback {Function} event handler function to invoke
        ###
        watchNode = (node, name, callback) ->
            doWatchNode node, name, callback
        
        # standard way
        
        # try IE way
        
        # wish there was a way to has("dom-messedup-garbage-colector")
        # we're using inference here, but wth! it's IE 6-8
        
        # oh IE, you pile o' wonder
        # set global unwatcher (only if we're in a browser environment)
        
        # don't bubble since most form events don't anyways
        
        # FIXME: This does not work for custom event types. Need to use ondataavailable
        # or some other standard event type for IE and manage the handlers ourselves.
        squelchedUnwatch = (unwatch) ->
            try
                unwatch()
            return
        'use strict'
        has = undefined
        doWatchNode = undefined
        fireSimpleEvent = undefined
        allUnwatches = undefined
        has = require('./has')
        allUnwatches = []
        if has('dom-addeventlistener')
            doWatchNode = (node, name, callback) ->
                node.addEventListener name, callback, false
                ->
                    node and node.removeEventListener(name, callback, false)
                    return
        else
            doWatchNode = (node, name, callback) ->
                handlerName = undefined
                unwatch = undefined
                handlerName = 'on' + name
                node.attachEvent handlerName, callback
                unwatch = ->
                    node and node.detachEvent(handlerName, callback)
                    return

                allUnwatches.push unwatch
                unwatch

            if 'onunload' of global
                watchNode global, 'unload', ->
                    unwatch = undefined
                    squelchedUnwatch unwatch    while (unwatch = allUnwatches.pop())
                    return

        if has('dom-createevent')
            fireSimpleEvent = (node, type, bubbles, data) ->
                evt = undefined
                evt = document.createEvent('HTMLEvents')
                evt.initEvent type, bubbles, true
                evt.data = data
                node.dispatchEvent evt
                return
        else
            fireSimpleEvent = (node, type, bubbles, data) ->
                evt = undefined
                evt = document.createEventObject()
                evt.data = data
                node.fireEvent 'on' + type, evt
                return
        watchNode: watchNode
        fireSimpleEvent: fireSimpleEvent

    return
) (if typeof define is 'function' then define else (factory) ->
    module.exports = factory(require)
    return
), this, @document