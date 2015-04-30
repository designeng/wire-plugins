define [
    "underscore"
    "when"
    "handlebars"
], (_, When, Handlebars) ->

    sum = (memo, text) ->
        return memo + text

    ensureElement = (rootElement) ->
        if !rootElement?
            rootElement = {
                tagName: "ul"
            }

        fragments = []
        fragments.push rootElement.tagName

        for attr of rootElement.attributes
            val = rootElement.attributes[attr]
            fragments.push "#{attr}=#{val}"

        element = {
            open: "<" + fragments.join(" ") + ">"
            close: "</#{rootElement}>"
        }

        return element

    processCollection = (rootElement, itemPattern, list, zeroPattern) ->

        result = []

        if !list.length and zeroPattern?
            result.push zeroPattern
        else
            for item in list
                result.push itemPattern(item)

        element = ensureElement(rootElement)

        result.unshift element.open
        result.push element.close

        resultHtml = _.reduce result, sum, ""

        return resultHtml

    registerPartials = (partials) ->

        for partial of partials
            Handlebars.registerPartial partial, partials[partial]

    acceptTransformations = (list, itemTransformations) ->
        if _.isEmpty itemTransformations
            return list

        fields = _.keys itemTransformations
        transformations = _.values itemTransformations

        for item in list
            fieldCount = 0
            for fieldName in fields
                item[fieldName] = transformations[fieldCount].call item, fieldName

        return list


    return (options) ->

        factories:
            templateSource: (resolver, componentDef, wire) ->
                wire(componentDef.options)
                    .then (options) ->
                        pattern = options.pattern
                        fillWith = options.fillWith
                        itemPattern = options.itemPattern
                        partials = options.partials
                        rootElement = options.rootElement
                        zeroPattern = options.zeroPattern
                        itemTransformations = options.itemTransformations

                        if typeof fillWith is "undefined"
                            # TODO: or let it be the same with 'if fillWith is null'?
                            # WARNING: fillWith = null can be used for detecting the situation when nothing should be displayed.
                            # or leave it to the template?
                            throw new Error "fillWith should not be undefined!"

                        # if fillWith (no mind, model or collection) is null
                        if fillWith is null
                            if pattern instanceof Function
                                return pattern()
                            else if pattern instanceof String
                                return pattern
                        
                        # fillWith is not null
                        else
                            if partials?
                                registerPartials partials

                            if fillWith instanceof Function
                                if pattern?
                                    pattern(fillWith())
                                else
                                    fillWith = fillWith()

                            if fillWith instanceof Array
                                if !itemPattern?
                                    throw new Error "itemPattern option should be defined!"

                                if itemTransformations?
                                    fillWith = acceptTransformations(fillWith, itemTransformations)

                                return processCollection(rootElement, itemPattern, fillWith, zeroPattern)

                            # TODO: should be test for object (model)?
                            else
                                if !pattern?
                                    throw new Error "pattern option should be defined!"
                                
                                return pattern(fillWith)

                    .then(resolver.resolve, resolver.reject)