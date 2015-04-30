define [
    "underscore"
    "jquery"
    "when"
    "meld"
    "lib/form"
], (_, $, When, meld, formAdapter) ->

    return (options) ->

        removers = null

        noop = ->

        bindImplementation = (facet, options, wire) ->
            target = $(facet.target)
            removers = []

            wire(facet.options).then (options) ->
                # options:
                # @param {Object} to - object to bind
                # @param {String} by - selector type, it can be in ["name", "id"]. The values of 'by' for every html-element should by the same as 'object-to-bind'[Model] fields.
                essentialObjects = ["to"]
                for opt in essentialObjects
                    if !options[opt]?
                        throw new Error "#{opt} option should be provided for bindModel plugin!"

                model = options["to"]

                isForm = (form) ->
                    return form.elements

                renderValue = (elements, name, value) ->
                    try
                        elements[name].html value
                    catch e
                        # console.debug "No field #{name}"
                        noop()

                renderValues = (elements, attributes) ->
                    _.forEach attributes, (value, name) ->
                        renderValue elements, name, value
                        

                # duck-typing: model should be extended form EventEmitter (use surrogate/Model)
                # TODO: if meld logic will be implemented, remove it
                essentialMethods = [
                    "trigger"
                    "addListener"
                    "removeListener"
                ]
                for method in essentialMethods
                    if !model[method]?
                        throw new Error "Model showld have method '#{method}'!"
                # /duck-typing

                modelAttributesKeys = _.keys model._attributes

                attributes = model._attributes

                if isForm(facet.target)
                    removers.push meld.before model, "setProperty", (name, value) ->
                        attrs = {}
                        attrs[name] = value
                        try
                            formAdapter.setValues(facet.target, attrs)
                        catch e
                            # do nothing: we should not interupt with error if no model field in form view
                else
                    # elements initialization
                    elements = {}
                    _.forEach attributes, (value, key) ->
                        element = target.find("#" + key)
                        elements[key] = element

                    # fill with values
                    renderValues(elements, attributes)

                    removers.push meld.before model, "setProperty", (name, value) ->
                        renderValue(elements, name, value)

        bindFacet = (resolver, facet, wire) ->
            resolver.resolve(bindImplementation(facet, options, wire))

        # TODO: fix it
        bindClassesImplementation = (facet, options, wire) ->
            target = $(facet.target)
            wire(facet.options).then (options) ->
                _.each options, (item) ->
                    id = _.keys(item)[0]
                    className = _.values(item)[0]
                    target.find("##{id}").addClass className

        bindClassesFacet = (resolver, facet, wire) ->
            resolver.resolve(bindClassesImplementation(facet, options, wire))

        bindFacetDestroy = (resolver, facet, wire) ->
            for remover in removers
                remover.remove()
            resolver.resolve()

        return pluginInstance = 
            facets:
                bind:
                    "ready:before"              : bindFacet
                    "destroy"                   : bindFacetDestroy
                bindClasses:
                    "ready:after"               : bindClassesFacet
