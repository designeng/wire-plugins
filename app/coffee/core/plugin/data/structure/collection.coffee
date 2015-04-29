# plugin for collection structure interaction
define [
    "underscore"
    "jquery"
    "when"
    "meld"
    "wire/lib/object"
    "core/entity/ClonedCollection"
    "kefir"
    "kefirJquery"
], (_, $, When, meld, object, ClonedCollection, Kefir, KefirJquery) ->

    KefirJquery.init Kefir, $

    return (options) ->

        targetCollection = null

        removers = []

        isRef = (it) ->
            return it and object.hasOwn(it, '$ref')

        addAspect = (filterReferenceObj, wire) ->
            if !isRef(filterReferenceObj)
                throw new Error "Filter should be described as wire reference!"

            allowedAspects = ["after"]
            aspectKeys = _.filter _.keys(filterReferenceObj), (key) ->
                return key != "$ref" and key in allowedAspects

            _.each aspectKeys, (aspectKey) ->
                # {Array of Strings}
                [providerClass, invoker] = getClassAndMethod(filterReferenceObj[aspectKey])

                spec = 
                    provider: {$ref: providerClass}
                    filter: filterReferenceObj

                wire(spec).then (specObject) ->
                    removers.push meld[aspectKey] specObject.provider, invoker, (result) ->
                        targetCollection["_filterOptions"] = result
                        targetCollection.applyFilter specObject.filter

        getClassAndMethod = (str) ->
            # one dot access restriction
            return str.split(".").slice(0, 2)

        # TODO: remove if not used
        checkMethod = (classObject, method) ->
            if !_.isFunction(classObject[method])
                throw new Error "Method #{method} should be defined in the object class!"
            return true

        normalizeFilters = (filters) ->
            if _.isArray filters
                return filters

            # TODO: structure {$ref:..., after:....} - not wrapped into array?
            else if isRef(filters)
                return [filters]
            else if _.isFunction filters
                return [filters]

        cloneStructureFactory = (resolver, compDef, wire) ->
            wire(compDef.options).then (structure) ->
                targetCollection = new ClonedCollection()

                # listen to structure.addSource invocation
                removers.push meld.after structure, "addSource", (source) ->
                    targetCollection.cloneSource(source)

                # initialize source (structure._source can be not empty at the moment of targetCollection creation)
                targetCollection.cloneSource(structure.getSource())
                    
                resolver.resolve(targetCollection)

        addFilterFacetReady = (resolver, facet, wire) ->
            filters = normalizeFilters facet.options

            # all filterFn'ctions should be applied in when/pipeline? 
            _.each filters, (filterReferenceObj) ->
                addAspect filterReferenceObj, wire

            resolver.resolve()

        onFilteredFacetReady = (resolver, facet, wire) ->
            wire(facet.options).then (callback) ->
                if !_.isFunction callback
                    throw new Error "Provided to onFiltered facet should be function!"
                removers.push meld.after targetCollection, "applyFilter", (source) ->
                    callback(source)

                resolver.resolve()

        bindFiltersToFieldsFacetReady = (resolver, facet, wire) ->
            inputs = []
            streams = []
            target = facet.target
            wire(facet.options).then (options) ->
                form = $(options.form)

                _.each options.fieldNames, (name) ->
                    inputs[name] = form.find("[name='" + name + "']")

                    getFieldData = do (name) ->
                        () ->
                            obj = 
                                event: event
                                name: name
                                value: inputs[name].val()
                            return obj

                    streams["change"] = inputs[name]
                        .asKefirStream(event, getFieldData)
                        .onValue (value) ->
                            console.debug "ON VALUE:::", value

                resolver.resolve()

        cleanRemovers = ->
            _.each removers, (remover) ->
                remover.remove()

        pluginInstance = 
            context:
                destroy: (resolver, wire) ->
                    resolver.resolve(cleanRemovers)

            factories: 
                cloneStructure      : cloneStructureFactory

            facets:
                addFilter: 
                    "ready"         : addFilterFacetReady

                # for complex transformations use wire/connect plugin (usage example in collection plugin tests)
                onFiltered:
                    "ready"         : onFilteredFacetReady

                bindFiltersToFields:
                    "ready"         : bindFiltersToFieldsFacetReady

        return pluginInstance