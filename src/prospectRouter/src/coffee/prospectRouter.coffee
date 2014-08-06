# @license MIT License (c) copyright D Savenok

# wire/prospectRouter plugin
 
# Licensed under the MIT License at:
# http://www.opensource.org/licenses/mit-license.php

define [
    "underscore"
    "./util/getCurrentRoute"
    "crossroads"
    "hasher"
    'when'
    'wire/lib/object'
    'when/sequence'
], (_, getCurrentRoute, crossroads, hasher, When, object, sequence) ->

    return (options) ->

        currentContext = null
        currentProspectSpec = undefined
        tempRouter = undefined

        filterStrategy = undefined
        childRoutes = undefined

        errorHandler = (error) ->
            console.error error.stack

        parseHash = (newHash, oldHash) ->
            tempRouter.parse newHash

        createRouter = (compDef, wire) ->
            When.promise (resolve) ->
                tempRouter = crossroads.create()
                resolve tempRouter

        isRef = (it) ->
            return it and object.hasOwn(it, '$ref')

        injectBechavior = (childSpecObj, behavior) ->
                childSpecObj.$plugins = [] unless childSpecObj.$plugins
                childSpecObj.$plugins.push "core/plugin/behavior"
                childSpecObj.behavior = behavior

        sequenceBehavior = (childCTX, route, wire) ->
            When(wire.getProxy(childCTX.behavior)
                        , (behaviorObj) ->
                            tasks = behaviorObj.target
                            # @param {Array} tasks - array of tasks
                            # @param {Object} childCTX - current resulted child context
                            # @param {String} route - current child context route
                            sequence(tasks, childCTX, route)
                        , () ->
                            # nothing to do, no behavior defined
                    )


        startChildRouteWiring = (route, wire) ->
            # filterStrategy must response with only one child spec we are going to load as childSpec
            # getCurrentRoute() call returns something like beginning from slash ("/.../.../..."), so must be sliced
            childRouteObject = filterStrategy(childRoutes, route, getCurrentRoute().slice(1))

            properties = 
                spec        : childRouteObject.spec                                
                slot        : childRouteObject.slot
                behavior    : childRouteObject.behavior
                subSpecs    : childRouteObject.subSpecs
                route       : childRouteObject.route
                options     : childRouteObject.options
                                
            wireChildRoute(properties, wire)

        # params: childRouteObject properties
        wireChildRoute = (properties, wire) ->

            wire.loadModule(properties.spec).then (childSpecObj) ->

                # childRouteObject properties
                # slot
                childSpecObj.slot = properties.slot
                # behavior
                if properties.behavior
                    injectBechavior(childSpecObj, properties.behavior)
                if properties.options
                    childSpecObj.options = properties.options

                wire.createChild(childSpecObj).then (childCTX) ->

                    sequenceBehavior(childCTX, properties.route, wire)

                    # subSpecs as {Array}
                    if properties.subSpecs
                        for subSpec in properties.subSpecs
                            # recursive call
                            subSpec.route = properties.route
                            wireChildRoute(subSpec, wire)

        routeBinding = (tempRouter, compDef, wire) ->
            for route, routeObject of compDef.options.routes

                spec = routeObject.spec
                slot = routeObject.slot
                rules = routeObject.rules
                behavior = routeObject.behavior

                routeFn = ((spec, slot, route, behavior, wire) ->
                    if spec != currentProspectSpec
                        # spec module is not loaded yet
                        wire.loadModule(spec).then (specObj) ->
                            currentContext?.destroy()

                            specObj.slot = slot

                            if behavior
                                injectBechavior(specObj, behavior)

                            # spec from "routes" options section is wired
                            wire.createChild(specObj).then (ctx) ->

                                sequenceBehavior(ctx, route, wire)
                                
                                # renderingController.isReady state means that prospect template is rendered
                                When(ctx.renderingController.isReady()).then () ->
                                    # set current
                                    currentContext = ctx
                                    currentProspectSpec = spec

                                    startChildRouteWiring(route, wire)
                            , errorHandler
                    else
                        # spec module is loaded, child route wiring must be started
                        startChildRouteWiring(route, wire)
                ).bind null, spec, slot, route, behavior, wire

                oneRoute = tempRouter.addRoute(route)
                oneRoute.rules = rules 
                oneRoute.matched.add routeFn

                # hasher.prependHash = "" must be somewhere in main context
                hasher.initialized.add(parseHash)
                hasher.changed.add(parseHash)
                # hasher init() call must be somewhere in main context

        initializeRouter = (resolver, compDef, wire) ->
            if isRef(compDef.options.childRoutes)
                wire(compDef.options.childRoutes).then (routes) ->
                    childRoutes = routes

            if isRef(compDef.options.routeFilterStrategy)
                wire(compDef.options.routeFilterStrategy).then (strategy) ->
                    filterStrategy = strategy
            else
                # TODO: think how to resolve

            createRouter(compDef, wire).then (tempRouter) ->
                routeBinding tempRouter, compDef, wire
                resolver.resolve(tempRouter)
            , (error) ->
                console.error error.stack

        pluginInstance = 
            ready: (resolver, proxy, wire) ->
                resolver.resolve()
            destroy: (resolver, proxy, wire) ->
                tempRouter.dispose()
                resolver.resolve()

            factories: 
                prospectRouter: initializeRouter

        return pluginInstance