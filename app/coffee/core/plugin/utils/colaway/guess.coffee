((define) ->
    define (require) ->
        
        # textContent is added to this list if necessary
        isFormValueNode = (node) ->
            formValueNodeRx.test node.tagName
        isClickableFormNode = (node) ->
            isFormValueNode(node) and formClickableRx.test(node.type)
        guessEventsFor = (node) ->
            if Array.isArray(node)
                
                # get unique list of events
                return node.reduce((events, node) ->
                    events.concat guessEventsFor(node).filter((event) ->
                        event and events.indexOf(event) < 0
                    )
                , [])
            else if isFormValueNode(node)
                return [
                    (if isClickableFormNode(node) then 'click' else 'change')
                    'focusout'
                ]
            []
        guessPropFor = (node) ->
            (if isFormValueNode(node) then (if isClickableFormNode(node) then 'checked' else 'value') else 'textContent')
        
        ###*
        Returns a property or attribute of a node.
        @param node {Node}
        @param name {String}
        @returns the value of the property or attribute
        ###
        getNodePropOrAttr = (node, name) ->
            accessor = undefined
            prop = undefined
            accessor = customAccessors[name]
            prop = attrToProp[name] or name
            if accessor
                accessor.get node
            else if prop of node
                node[prop]
            else
                node.getAttribute prop
        
        ###*
        Sets a property of a node.
        @param node {Node}
        @param name {String}
        @param value
        ###
        setNodePropOrAttr = (node, name, value) ->
            accessor = undefined
            prop = undefined
            accessor = customAccessors[name]
            prop = attrToProp[name] or name
            
            # this gets around a nasty IE6 bug with <option> elements
            prop = 'text'    if node.nodeName is 'option' and prop is 'innerText'
            if accessor
                return accessor.set(node, value)
            else if prop of node
                node[prop] = value
            else
                node.setAttribute prop, value
            value
        
        ###*
        Initializes the dom setter and getter at first invocation.
        @private
        @param node
        @param attr
        @param [value]
        @return {*}
        ###
        initSetGet = (node, attr, value) ->
            
            # test for innerText/textContent
            attrToProp.textContent = (if ('textContent' of node) then 'textContent' else 'innerText')
            
            # continue normally
            guess.setNodePropOrAttr = setNodePropOrAttr
            guess.getNodePropOrAttr = getNodePropOrAttr
            (if arguments.length is 3 then setNodePropOrAttr(node, attr, value) else getNodePropOrAttr(node, attr))
        'use strict'
        guess = undefined
        has = undefined
        classList = undefined
        formValueNodeRx = undefined
        formClickableRx = undefined
        attrToProp = undefined
        customAccessors = undefined
        has = require('./has')
        classList = require('./classList')
        formValueNodeRx = /^(input|select|textarea)$/i
        formClickableRx = /^(checkbox|radio)/i
        attrToProp =
            class: 'className'
            for: 'htmlFor'

        customAccessors =
            classList:
                get: classList.getClassList
                set: classList.setClassList

            classSet:
                get: classList.getClassSet
                set: classList.setClassSet

        guess =
            isFormValueNode: isFormValueNode
            eventsForNode: guessEventsFor
            propForNode: guessPropFor
            getNodePropOrAttr: initSetGet
            setNodePropOrAttr: initSetGet

        return guess
        return

    return
) (if typeof define is 'function' then define else (factory) ->
    module.exports = factory(require)
    return
)