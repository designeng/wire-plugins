define [
    "underscore"
    "jquery"
    "when/pipeline"
    "plugins/utils/normalize"
    "kefir"
    "kefirJquery"
], (_, $, pipeline, normalize, Kefir, KefirJquery) ->

    KefirJquery.init Kefir, $

    filterRegExp = /filter:/g
    beforeRegExp = /before:/g
    alternativeRegExp = /alternative:/g

    return (options) ->

        streamsFacet = (resolver, facet, wire) ->
            wire(facet.options)
                .then (options) ->

                    controller = facet.target
                    eventMap = options.eventMap
                    hooks = options.hooks

                    form = controller.form = normalize(controller.form)

                    fieldNames = _.keys controller.fieldNames

                    _.each fieldNames, (name) ->
                        @.inputs[name] = form.find("[name='" + name + "']")
                    , controller

                    # extract events from "streams" option (every stream can be defined with a number of events)
                    events = _.keys eventMap

                    submitEvent = "submit"
                    _.map events, (event) ->
                        methods = _.map eventMap[event].split("|"), (method) ->
                            return $.trim method

                        filters = _.filter methods, (method) ->
                            if method.match filterRegExp then true else false

                        beforeAll = _.filter methods, (method) ->
                            if method.match beforeRegExp then true else false

                        alternativeTasks = _.filter methods, (method) ->
                            if method.match alternativeRegExp then true else false

                        # tasks = methods - filters
                        tasks = _.difference(methods, _.union(filters, beforeAll, alternativeTasks))

                        # hook should be inserted in tasks list
                        if hooks[event]?
                            if hooks[event]["insertBefore"]
                                hookPosition = "insertBefore"
                            else if hooks[event]["insertAfter"]
                                hookPosition = "insertAfter"

                            if !_.isFunction hooks[event]["hook"]
                                throw new Error "Hook should be a function!"
                            else if !hookPosition
                                throw new Error "insertBefore or insertAfter option should be declared in the hook!"
                            else
                                tasks = _[hookPosition] tasks, hooks[event][hookPosition], hooks[event]["hook"]

                        # bind every method to controller
                        filters = _.map filters, (item) -> 
                            filter = item.split(":")[1]
                            _.bindAll @, filter
                            return @[filter]
                        , @

                        beforeAll = _.map beforeAll, (item) -> 
                            method = item.split(":")[1]
                            _.bindAll @, method
                            return @[method]
                        , @

                        alternativeTasks = _.map alternativeTasks, (item) ->
                            task = item.split(":")[1]
                            _.bindAll @, task
                            return @[task]
                        , @

                        tasks = _.map tasks, (task) ->
                            if _.isString task
                                _.bindAll @, task
                                return @[task]
                            else if _.isFunction task
                                # TODO: should be binded external task (hook)?
                                return task
                        , @

                        if event != submitEvent
                            _.each fieldNames, (name) ->
                                getFieldData = do (target = @, name) ->
                                    () ->
                                        obj = 
                                            event: event
                                            name: name
                                            value: target.inputs[name].val()
                                        return obj

                                # should not return anything - returned value will be ignored anyway
                                beforeAllFilterFunc = () ->
                                    args = Array::slice.call(arguments, 0)
                                    _.each beforeAll, (method) ->
                                        method.apply(null, args)

                                # will be invoked if filterFunc result is false
                                alternativeTasksFunc = (data) ->
                                    pipeline(alternativeTasks, data)

                                filterFunc = () ->
                                    args = Array::slice.call(arguments, 0)
                                    res = _.reduce filters, (res, filter) ->
                                        return res && filter.apply(null, args)
                                    , true
                                    if !res
                                        alternativeTasksFunc(args[0])
                                    return res

                                @.streams[event] = @.inputs[name]
                                    .asKefirStream(event, getFieldData)
                                    .tap(beforeAllFilterFunc)
                                    .filter(filterFunc)

                                @.streams[event].onValue (data) ->
                                    pipeline(tasks, data)
                            , @
                        else if event is submitEvent
                            @.streams[submitEvent] = form
                                .asKefirStream(submitEvent)
                                .onValue (value) -> 
                                    pipeline(tasks, value)

                    , controller

                    resolver.resolve()

        pluginObject = 
            context:
                destroy: (resolver, wire) ->
                    resolver.resolve()

            facets: 
                streams:
                    ready: streamsFacet

        return pluginObject