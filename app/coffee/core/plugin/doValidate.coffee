define [
    "underscore"
    "when"
    "wire"
    "components/form/validator/spec"
], (_, When, wire, defaultValidator) ->
    
    # TODO
    unbindAll = () ->

    return (options) ->

        # validation should be on:
        # "submit"
        # "change" (mark it as valid after change)
        # "keyup" - if field was validated and not valid

        validateFacet = (resolver, facet, wire) ->
            wire(facet.options)
                .then (options) ->

                    target = facet.target

                    if !options.validator
                        wire({
                            formView: target
                            validator:
                                wire:
                                    spec: defaultValidator
                                    provide:
                                        form: target
                                        strategy: options.strategy                                  
                                        slot: options.displaySlot
                        }).then (context) ->
                            # TODO think what should be provided to unbindAll from context - or no need
                            resolver.resolve()
                    else
                        resolver.resolve()

        pluginObject = 
            context:
                destroy: (resolver, wire) ->
                    unbindAll()
                    resolver.resolve()

            facets: 
                validate:
                    ready: validateFacet

        return pluginObject