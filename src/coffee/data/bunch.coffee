# valuesBunch plugin
define [
    "underscore"
    "underscore.string"
    "jquery"
    "when"
    "meld"
    "wire/lib/object"
    "kefir"
    "kefirJquery"
    "eventEmitter"
], (_, _Str, $, When, meld, object, Kefir, KefirJquery, EventEmitter) ->

    KefirJquery.init Kefir, $

    return (options) ->

        removers = []

        isRef = (it) ->
            return it and object.hasOwn(it, '$ref')

        getEventName = (providerName, propertyName) ->
            return propertyName + _Str.capitalize(providerName) + "PropertyEvent"

        # one dot access restriction
        getClassAndMethod = (str) ->
            return str.split(".").slice(0, 2)

        # TODO: combineWith can be string (only pairs combined) - but if we need to combine a set of streams?
        mergeWithCombinedStreams = (streams, combinedStreams) ->
            items = _.values combinedStreams
            combined = []

            _.forEach combinedStreams, (obj, key) ->
                if _.indexOf(combined, key) != -1
                    return null

                # TODO: use combinator for normalization? 
                combinator = (res) ->
                    return res

                streams.push Kefir.combine [obj.stream, _.find(items, {original: key}).stream]

                combined.push key
                combined.push obj.original

            return streams

        getbyInvocationStreams = (byInvocation, wire) ->
            streams = []
            combinedStreams = {}
            aspectModes = ["before", "after"]

            grouped = _.groupBy byInvocation, (item) ->
                return item.$ref.split(".")[0]

            spec = _.reduce grouped, (result, item, itemName) ->
                result.providers[itemName] = {$ref: itemName}
                return result
            , {providers: {}}

            return wire(spec).then (context) ->
                _.forEach context.providers, (provider, providerName) ->
                    provider.emitter = new EventEmitter() if !provider.emitter?

                    _.forEach grouped[providerName], (item) ->
                        [providerClass, invoker] = getClassAndMethod(item["$ref"])

                        aspectMode = item["aspectMode"] || "after"
                        if _.indexOf(aspectModes, aspectMode) == -1
                            throw new Error "Aspect mode should be in [after, before] !"

                        eventName = getEventName(providerName, invoker)

                        removers.push meld[aspectMode] provider, invoker, (result) ->
                            provider.emitter.emit eventName, result

                        if item["combineWith"]
                            combinedStreams[item["combineWith"]] = 
                                original: item["$ref"]
                                stream: Kefir.fromEvent(provider.emitter, eventName)
                        else
                            streams.push Kefir.fromEvent(provider.emitter, eventName)

                streams = mergeWithCombinedStreams(streams, combinedStreams)

                return streams

        getByPropertyStreams = (byProperty, wire) ->
            streams = []

            emitProperty = (provider, propertyName) ->
                provider.emit getEventName(propertyName), provider.getProperty(propertyName)

            grouped = _.groupBy byProperty, (item) ->
                return item.at.$ref

            spec = _.reduce grouped, (result, item, itemName) ->
                result.providers[itemName] = {$ref: itemName}
                return result
            , {providers: {}}

            return wire(spec).then (context) ->
                _.forEach context.providers, (provider, providerName) ->
                    removers.push meld.before provider, "setProperty", (propertyName, propertyValue) ->
                        # model by definition should extend EventEmitter
                        provider.emit getEventName(providerName, propertyName), propertyValue

                    _.forEach grouped[providerName], (item) ->
                        streams.push Kefir.fromEvent(provider, getEventName(providerName, item.name))
                return streams

        # if options.byInput not defined, we can use the facet not only with html-forms
        getByInputStreams = (byInput, target) ->
            if byInput?
                form = $(target)
                inputs = []
            else
                return []

            return _.map byInput, (name) ->
                $input = form.find("[name='" + name + "']")
                if !$input.length 
                    throw new Error "Not found input with name '#{name}'!"

                inputs[name] = $input
                getFieldData = do (name) ->
                    () ->
                        obj = 
                            name: name
                            value: inputs[name].val()
                        return obj
                $input.asKefirStream("change", getFieldData)

        valuesBunchFacetReady = (resolver, facet, wire) ->
            inputs = []
            target = facet.target

            promises = []

            promises.push getByPropertyStreams(facet.options.byProperty, wire)
            promises.push getbyInvocationStreams(facet.options.byInvocation, wire)
            promises.push getByInputStreams(facet.options.byInput, target)

            When.all(promises).then (streams) ->
                streams = _.flatten streams

                wire(facet.options).then (options) ->

                    deliverTo = options.deliverTo

                    if _.isPlainObject deliverTo
                        deliverToCallback = (res) ->
                            deliverTo = _.extend deliverTo, res
                    else if _.isFunction deliverTo
                        deliverToCallback = deliverTo
                    else
                        throw new Error "Option 'deliverTo' should be function or plain js object!"

                    # TODO: to think about combine streams
                    # Kefir.combine(_.values streams).onValue deliverToCallback

                    # merge all streams
                    Kefir.merge(streams).onValue deliverToCallback

                    resolver.resolve()

        valuesSeparatelyFacetReady = (resolver, facet, wire) ->
            inputs = []
            streams = []
            target = facet.target
            form = $(target)

            if !_.isArray facet.options
                throw new Error "ValuesSeparately facet value should be Array!"

            itemAttributes = ["field", "consumer"]

            _.each facet.options, (item) ->

                _.each itemAttributes, (attr) ->
                    if !@.hasOwnProperty attr
                        throw new Error "ValuesSeparately facet item should have '#{attr}' attribute!"
                , item

                if !_.isString item.field
                    throw new Error "ValuesSeparately facet item 'field' should be a string!"

                inputs[item.field] = form.find("[name='" + item.field + "']")

                getFieldData = do (name = item.field) ->
                    () ->
                        obj = 
                            name: name
                            value: inputs[name].val()
                        return obj

                deferred = When.defer()

                wire({$ref: item.consumer}).then (consumer) ->
                    deferred.resolve(consumer)

                streams[item.field] = inputs[item.field]
                    .asKefirStream("change", getFieldData)
                    .onValue (value) ->
                        When(deferred.promise).then (consumer) ->
                            consumer(value)

            resolver.resolve()

        pluginInstance = 
            facets:
                valuesBunch:
                    "ready"         : valuesBunchFacetReady
                valuesSeparately:
                    "ready"         : valuesSeparatelyFacetReady

        return pluginInstance