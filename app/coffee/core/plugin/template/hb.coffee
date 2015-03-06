define [
    "underscore"
    "when"
    "handlebars"
], (_, When, Handlebars) ->

    sum = (memo, text) ->
        return memo + text

    processCollection = (rootElement, itemPattern, list, zeroPattern) ->

        result = []

        if !list.length and zeroPattern?
            result.push zeroPattern
        else
            for item in list
                result.push itemPattern(item)

        result.unshift "<#{rootElement}>"
        result.push "</#{rootElement}>"

        resultHtml = _.reduce result, sum, ""

        return resultHtml

    registerPartials = (partials) ->

        for partial of partials
            Handlebars.registerPartial partial, partials[partial]

        return

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
                        
                        if fillWith?
                            if fillWith instanceof Array
                                if !rootElement?
                                    rootElement = "ul"
                                if !itemPattern?
                                    throw new Error "itemPattern option should be defined!"
                                if partials?
                                    registerPartials partials

                                if itemTransformations?
                                    fillWith = acceptTransformations(fillWith, itemTransformations)

                                return processCollection(rootElement, itemPattern, fillWith, zeroPattern)

                            # TODO: should be test for object (model)?
                            else
                                if !pattern?
                                    throw new Error "pattern option should be defined!"
                                return pattern(fillWith)
                        else
                            return pattern
                    .then(resolver.resolve, resolver.reject)