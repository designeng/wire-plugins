define [
    "underscore"
    "when"
    "when/pipeline"
    "when/sequence"
    "./tasksFactory"
    "core/util/navigation/navigate"
], (_, When, pipeline, sequence, TasksFactory, navigate) ->

    class ChildContextProcessor

        # should be defined in "deliver" method
        parentContext: undefined

        constructor: ->
            _.bindAll @
            tasks = [
                "wireChildContext"
                "checkForAccess"
                "sequenceBehavior"
                "synchronize"
            ]
            @tasksFactory = new TasksFactory(@, tasks)

        deliver: (parentContext, bundle) ->
            @parentContext = parentContext
            
            # if any filter return false, no tasks processing

            # TODO: choose PARALLEL or QUEUE by option?

            # PARALLEL WIRING
            # _.each bundle, (item, index) =>
            #     @mainSpecification = item.spec if index == 0
            #     @tasksFactory.runTasks(item, null)

            # QUEUE WIRING
            # REASON: runTasks invoked tasks in parallel for different items,
            # but sometimes it's usefull to call runTasks with two (or more) different arguments,
            # waiting while tasks for first item will be completed.
            childQueue = _.map bundle, (item, index) =>
                return () =>
                    options = {}
                    item.childContext = @contextController.getRegistredContext(item.route, "child")
                    @mainSpecification = item.spec if index == 0
                    if item.childContext?
                        # should be skipped "wireChildContext", "checkForAccess" tasks - pass the array of indexes:
                        options.skip = [0, 1]
                        # as sequenceBehavior has childContext in argument, item.childContext should be passed
                        @tasksFactory.runTasks(item.childContext, null, options)
                    else
                        @tasksFactory.runTasks(item)

            sequence(childQueue).then (result) =>
                @afterChildrenLoaded() if @afterChildrenLoaded

        wireChildContext: (child) ->
            if child.childContext?
                return child.childContext
            else
                # "reserved words": __environmentVars, slot

                environment = 
                    __environmentVars:
                        spec                : child.spec
                        replaceable         : child.replaceable
                        route               : child.route
                        destroyOnBlur       : child.destroyOnBlur
                    slot            : child.slot

                if typeof child.behavior != "undefined"
                    environment["behavior"] = @prepareBehavior(child.behavior)

                return When(@environment.loadInEnvironment(child.spec, child.mergeWith, environment, @parentContext)).then (childContext) =>
                    # register context only if option noCache is not true:
                    if !child.noCache
                        @contextController.register @parentContext, childContext, child
                    # if option clearCache is true, all contextController._contextHash will be cleared and all cached contexts destroyed:
                    if child.clearCache
                        @contextController.clearCache()
                    return childContext
                , (rejectReason) ->
                    console.debug "ChildContextProcessor::wireChildContext:rejectReason:", rejectReason

        # if no access, checkForAccess promise is rejected, and no tasks after it is passed.
        checkForAccess: (childContext) ->
            access = @accessPolicyProcessor.askForAccess(childContext)
            if access
                return childContext
            else
                return {}

        sequenceBehavior: (childContext) ->
            if childContext.behavior? and childContext.__environmentVars.spec == @mainSpecification
                return @behaviorProcessor.sequenceBehavior(childContext)
            else
                return childContext

        synchronize: (childContext) ->
            # console.debug "CURRENT:::", currentRoute.params.join("/"), currentRoute.route._pattern
            # console.debug "childObj:::now", childObj, childContext

            isActive = (context) =>
                return context.__environmentVars.route == @routeStrategy.getChild(@appRouterController.getCurrentRoute().route._pattern).route

            if isActive(childContext) and typeof childContext.synchronizeWithRoute != "undefined"
                childContext.synchronizeWithRoute.call childContext
            return childContext
