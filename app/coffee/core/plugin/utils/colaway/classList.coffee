((define) ->
    define (require, exports) ->
        
        # TODO: use has() to select code to use node.classList / DOMSettableTokenList
        
        ###*
        Returns the list of class names on a node as an array.
        @param node {HTMLElement}
        @returns {Array}
        ###
        getClassList = (node) ->
            node.className.split splitClassNameRx
        
        ###*
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
        ###
        setClassList = (node, list) ->
            adds = undefined
            removes = undefined
            if list
                
                # figure out what to add and remove
                adds = list.add or list or []
                removes = list.remove or []
                node.className = spliceClassNames(node.className, removes, adds)
            getClassList node
        getClassSet = (node) ->
            set = undefined
            classNames = undefined
            className = undefined
            set = {}
            classNames = node.className.split(splitClassNameRx)
            set[className] = true    while (className = classNames.pop())
            set
        
        ###*
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
        ###
        setClassSet = (node, classSet) ->
            removes = undefined
            adds = undefined
            p = undefined
            newList = undefined
            removes = []
            adds = []
            for p of classSet
                if p
                    if classSet[p]
                        adds.push p
                    else
                        removes.push p
            node.className = spliceClassNames(node.className, removes, adds)
        
        # class parsing
        
        ###*
        Adds and removes class names to a string.
        @private
        @param className {String} current className
        @param removes {Array} class names to remove
        @param adds {Array} class names to add
        @returns {String} modified className
        ###
        spliceClassNames = (className, removes, adds) ->
            rx = undefined
            leftovers = undefined
            
            # create regex to find all removes *and adds* since we're going to
            # remove them all to prevent duplicates.
            removes = trim(removes.concat(adds).join(' '))
            adds = trim(adds.join(' '))
            rx = new RegExp(openRx + removes.replace(innerSpacesRx, innerRx) + closeRx, 'g')
            
            # remove and add
            trim className.replace(rx, (m) ->
                
                # if nothing matched, we're at the end
                (if not m and adds then ' ' + adds else '')
            )
        trim = (str) ->
            
            # don't worry about high-unicode spaces. they should never be here.
            str.replace outerSpacesRx, ''
        addClass = (className, str) ->
            newClass = removeClass(className, str)
            newClass += ' '    if newClass and className
            newClass + className
        removeClass = (removes, tokens) ->
            rx = undefined
            return tokens    unless removes
            
            # convert space-delimited tokens with bar-delimited (regexp `or`)
            removes = removes.replace(splitClassNamesRx, (m, inner, edge) ->
                
                # only replace inner spaces with |
                (if edge then '' else '|')
            )
            
            # create one-pass regexp
            rx = new RegExp(classRx.replace('classNames', removes), 'g')
            
            # remove all tokens in one pass (wish we could trim leading
            # spaces in the same pass! at least the trim is not a full
            # scan of the string)
            tokens.replace(rx, '').replace trimLeadingRx, ''
        splitClassNameRx = /\s+/
        classRx = '(\\s+|^)(classNames)(\\b(?![\\-_])|$)'
        trimLeadingRx = /^\s+/
        splitClassNamesRx = /(\b\s+\b)|(\s+)/g
        openRx = undefined
        closeRx = undefined
        innerRx = undefined
        innerSpacesRx = undefined
        outerSpacesRx = undefined
        openRx = '(?:\\b\\s+|^\\s*)('
        closeRx = ')(?:\\b(?!-))|(?:\\s*)$'
        innerRx = '|'
        innerSpacesRx = /\b\s+\b/
        outerSpacesRx = /^\s+|\s+$/
        addClass: addClass
        removeClass: removeClass
        getClassList: getClassList
        setClassList: setClassList
        getClassSet: getClassSet
        setClassSet: setClassSet

    return
) (if typeof define is 'function' then define else (factory) ->
    module.exports = factory(require)
    return
)