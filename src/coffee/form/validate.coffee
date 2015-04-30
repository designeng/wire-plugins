define [
    "underscore"
    "when"
    "wire"
], (_, When, wire) ->

    isElement = (node) ->
        return !!(node and (node.nodeName || (node.prop and node.attr and node.find)))

    # @returns {Object}
    getFieldNames = (strategy) ->
        result = {}
        for key in _.keys strategy
            result[key] = true
        return result

    createPluginApi = (facet, context, validatorDeferred, resolver) ->
        # plugin API - for controller as the facet target
        # and "validator" object as a proxy
        validator = {}
        validator["getStrategy"] = (strategy) ->
            context.validator.validator.getStrategy(res)
        validator["extendStrategy"] = (strategy) ->
            context.validator.validator.extendStrategy(res)
        validator["removeStrategyField"] = (fieldName) ->
            context.validator.validator.removeStrategyField(res)
        validator["addStrategyField"] = (fieldName) ->
            context.validator.validator.addStrategyField(fieldName)
        validator["disableField"] = (fieldName) ->
            return context.validator.controller.disableField(fieldName)
        validator["enableField"] = (fieldName) ->
            return context.validator.controller.enableField(fieldName)

        validator["validateField"] = (fieldName, condition) ->
            condition = condition || "not blank"
            return context.validator.controller.invoke(fieldName, condition)
        validator["validateAll"] = (fieldName) ->
            return context.validator.controller.validateAll()
        validator["clearFieldErrors"] = (fieldName) ->
            return context.validator.controller.clearFieldErrors(fieldName)
        validator["reset"] = (fieldName) ->
            return context.validator.controller.reset()

        facet.target["validator"] = validator

        validatorDeferred.resolve(validator)
        resolver.resolve()

    createValidatorPromise = (facet, validatorDeferred) ->
        facet.target["validatorIsReady"] = validatorDeferred.promise

    return (options) ->

        # validation should be on:
        # "submit"
        # "change" (mark it as valid after change)
        # "keyup" - if field was validated and not valid

        validateFacet = (resolver, facet, wire) ->
            wire(facet.options)
                .then (options) ->

                    validatorDeferred = When.defer()

                    # validate facet can be used both with view (html element) and controller (js-module)
                    target = if options.form then options.form else facet.target

                    if !isElement facet.target
                        createValidatorPromise(facet, validatorDeferred)

                    if !options.validator

                        essential = ["strategy", "successHandler", "displaySlot", "displaySlotClass"]
                        for opt in essential
                            if !options[opt]
                                throw new Error "#{opt} should be provided!"

                        wire({
                            formView: target
                            validator:
                                wire:
                                    spec: "core/plugin/form/validator/spec"
                                    provide:
                                        form                : target
                                        target              : facet.target
                                        fieldNames          : getFieldNames(options.strategy)
                                        strategy            : options.strategy
                                        successHandler      : options.successHandler
                                        streamsHooks        : options.streamsHooks || {}
                                        displaySlot         : options.displaySlot
                                        displaySlotClass    : options.displaySlotClass
                        }).then (context) ->
                            # check if facet.target is controller (not html element)
                            if !isElement facet.target
                                createPluginApi(facet, context, validatorDeferred, resolver)
                            else
                                resolver.resolve()
                    else
                        resolver.resolve()

        pluginObject =
            facets: 
                validate:
                    "ready:before" : validateFacet

        return pluginObject