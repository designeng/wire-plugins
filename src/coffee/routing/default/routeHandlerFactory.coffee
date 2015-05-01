define [
    "underscore"
    "when"
    "plugins/utils/navigateToError"
    "./tasksFactory"
], (_, When, navigateToError, TasksFactory) ->

    class RouteHandlerFactory

        constructor: ->
            _.bindAll @
            tasks = [
                "defineChildObject"
                "getCached"
                "loadNotCached"
                "sequenceBehavior"
            ]
            @tasksFactory = new TasksFactory(@, tasks)

        # public method
        createHandler: (routeObject) ->
            @tasksFactory.runTasks(routeObject)

        # tasks
        defineChildObject: (routeObject) ->
            @child = @routeStrategy.getChild(routeObject.route)

            @contextController.startContextHashRevision(@child)
            return routeObject

        getCached: (routeObject) ->
            deferred = When.defer()
            parentContext = @contextController.getRegistredContext(@child.route, "parent")

            if parentContext?
                @processChildRoute(parentContext, @child)
                deferred.reject("CACHED")
            else
                deferred.resolve(routeObject)
            return deferred.promise

        loadNotCached: (routeObject) ->
            environment = 
                slot: routeObject.slot

            When(@environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, environment)).then (parentContext) =>
                @processChildRoute(parentContext)
                return parentContext
            .otherwise (error) ->
                navigateToError("js", error)

        # "Route" - not "routes" - in method name, because only one child
        # should be choosed from @childRoutes by filterStrategy in routeHandler
        # @param {WireContext} context
        # @param {WireContext} child - object form childRoutes, choosed by filterStrategy
        processChildRoute: (context) ->
            bundle = []
            bundle.push @child

            findDefinitionInRoutes = (childRoutes, attributes, routeMask) =>
                route = @routeStrategy.getComponentRoute(attributes.spec, routeMask)
                if route
                    definition = childRoutes[route]
                    definition["route"] = route
                    return definition
                else
                    throw new Error "Component definition not found in childRoutes!"

            if _.isString @child.relative
                relativeComponentDefinition = findDefinitionInRoutes(@childRoutes, {spec: @child.relative}, @child.route)
                bundle.push relativeComponentDefinition

            else if _.isArray @child.relative
                _.each @child.relative, (relativeItem) =>
                    relativeComponentDefinition = {}
                    if _.isString relativeItem
                        relativeComponentDefinition = findDefinitionInRoutes(@childRoutes, {spec: relativeItem}, @child.route)
                    else if _.isObject relativeItem
                        relativeComponentDefinition = findDefinitionInRoutes(@childRoutes, {spec: relativeItem.spec}, @child.route)
                    bundle.push relativeComponentDefinition

            @childContextProcessor.deliver(context, bundle)

        sequenceBehavior: (context) ->
            if context.behavior?
                return @behaviorProcessor.sequenceBehavior(context)
            else
                return context