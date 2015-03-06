define [
    "underscore"
    "jquery"
    "when"
], (_, $, When) ->

    pluginObject = null

    targetRegistrator = {}

    registerTarget = (target) ->
        $target = $(target)
        targetName = $target.attr("name")

        if !targetName
            throw new Error "Attribute 'name' must be defined for the form!"

        if !targetRegistrator[targetName]
            targetRegistrator[targetName] = {}
            targetRegistrator[targetName]["$target"] = $target

        return {
            $target: $target
            targetName: targetName
        }

    registerTargetHandler = (targetName, event, handler) ->
        targetRegistrator[targetName]["targetHandler"] = handler
        targetRegistrator[targetName]["$target"].bind event, handler

    registerInput = (targetName, inputName, input, inputHandler) ->
        # ensure it exists
        if !targetRegistrator[targetName]["inputs"]
            targetRegistrator[targetName]["inputs"] = {}
        if !targetRegistrator[targetName]["inputs"][inputName]
            targetRegistrator[targetName]["inputs"][inputName] = {}

        targetRegistrator[targetName]["inputs"][inputName]["input"] = input
        targetRegistrator[targetName]["inputs"][inputName]["inputHandler"] = inputHandler

    registerInputHandler = (targetName, inputName, event, handler) ->
        targetRegistrator[targetName]["inputs"][inputName]["input"].bind event, handler
        
    normalizePoints = (points) ->
        points = _.map points, (item) ->
            item.rule = normalizeRule(item.rule)
            return item
        return points

    # we want deal with the function
    normalizeRule = (rule) ->
        if _.isFunction rule
            return rule
        else if _.isRegExp rule
            return (value) ->
                return value.match rule

    registerInputStrategy = (targetName, inputStrategy) ->
        # ensure it exists
        if !targetRegistrator[targetName]["strategies"]
            targetRegistrator[targetName]["strategies"] = []

        inputStrategy.points = normalizePoints(inputStrategy.points)

        targetRegistrator[targetName]["strategies"].push inputStrategy

    getInputStrategy = (targetName, fieldName) ->
        return _.where(targetRegistrator[targetName]["strategies"], {name: fieldName})[0]

    registerInputValidationResult = (targetName, inputName, result) ->
        if result.errors
            targetRegistrator[targetName]["inputs"][inputName]["errors"] = result.errors

    checkTargetErrors = (targetName, callback) ->
        keys = _.keys targetRegistrator[targetName]["inputs"]
        inputs = targetRegistrator[targetName]["inputs"]
        
        result = {}
        formResult = {}
        for key in keys
            input        = inputs[key]["input"]
            inputHandler = inputs[key]["inputHandler"]
            value = input.val()
            result = inputHandler(value)
            formResult[key] = value

            # form should be checked just to first input error 
            if result.errors
                break

        # if form validation success
        if !result.errors
            callback(targetRegistrator[targetName]['$target'], formResult)
            
    unbindAll = () ->
        for targetName, targetObject of targetRegistrator
            # unbind elements

            for inputName, inputObj of targetObject["inputs"]
                inputObj["input"].unbind()

            # unbind form
            targetObject["$target"].unbind()

    pointsToArray = (points) ->
        return _.values points

    normalizeValue = (e) ->
        # lazy check for event type in args[0]
        if e.target and e.originalEvent
            value = e.target.value
        else
            value = e
        return value

    refresh = (val) ->
        console.log "refresh", val, targetRegistrator

    return (options) ->

        # validation should be on:
        # "submit"
        # "change" (mark it as valid after change)
        # "keyup" - if field was validated and not valid

        validateFacet = (resolver, facet, wire) ->
            wire(facet.options)
                .then (options) ->

                    target = facet.target

                    registred = registerTarget(target)
                    targetName = registred.targetName

                    # options.afterFieldValidation - will be alled when validation is complete?
                    # or every time?

                    validateFormHandler = do (targetName) ->
                        () ->
                            checkTargetErrors(targetName, options.onValidationComplete)
                            return false

                    registerTargetHandler(targetName, "submit", validateFormHandler)
                    
                    for fieldName, fieldPoints of options.fields
                        # get input 
                        input = registred["$target"].find("input[name='" + fieldName + "']")

                        inputHandler = do (fieldName, targetName) -> 
                            (e) ->
                                value = normalizeValue(e)

                                strategy = getInputStrategy(targetName, fieldName)

                                # Array
                                strategyPoints = _.values(strategy.points)

                                iterator = do (value) ->
                                    (result, item) ->
                                        if result.errors
                                            return result
                                        else
                                            if !item.rule(value)
                                                result["errors"] = []
                                                result["errors"].push item.message
                                            return result

                                result = _.reduce(strategyPoints, iterator, {})
                                registerInputValidationResult(targetName, fieldName, result)

                                # TODO: here must be displayErrors, not afterFieldValidation
                                if options.afterFieldValidation
                                    options.afterFieldValidation(target, fieldName, result)

                                console.log "input processing res:::::", result
                                return result

                        # register it - it will be used on destroy phase
                        registerInput(targetName, fieldName, input, inputHandler)
                        # register strategy for input
                        registerInputStrategy(targetName, {name: fieldName, points: fieldPoints})

                        registerInputHandler(targetName, fieldName, "change", inputHandler)                

                    # experiment with refrefing options from controller
                    if options.pluginInvoker
                        options.pluginInvoker(pluginObject, target, refresh)

                    resolver.resolve()


        # return plugin object
        pluginObject = 
            context:
                destroy: (resolver, wire) ->
                    unbindAll()
                    resolver.resolve()

            facets: 
                validate:
                    ready: validateFacet

        return pluginObject