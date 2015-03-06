# loaded by wire.loadModule specification target view must have reference to 'slot' to be inserted, i.e.

    # mainSpecView:
    #     render:
    #         template:
    #             module: "text!components/somecomponent/template.html"
    #         css:
    #             module: "css!components/somecomponent/styles.css"
    #     insert:
    #         at: {$ref: 'slot'}

define [
    "crossroads"
    "hasher"
    "when"
], (crossroads, hasher, When) ->

    return (options) ->

        parseHash = (newHash, oldHash) ->
            tempRouter.parse newHash

        currentContext = null
        tempRouter = undefined

        createRouter = (compDef, wire) ->
            When.promise (resolve) ->
                tempRouter = crossroads.create()
                resolve tempRouter

        routeBinding = (tempRouter, compDef, wire) ->
            for route, routeObject of compDef.options.routes

                spec = routeObject.spec

                routeFn = ((spec) ->
                    wire.loadModule(spec).then (specObj) ->
                        currentContext?.destroy()

                        specObj.slot = routeObject.slot

                        wire.createChild(specObj).then (ctx) ->
                            currentContext = ctx
                        , (error) ->
                            console.error error.stack
                ).bind null, spec

                tempRouter.addRoute(route, routeFn)

                # hasher.prependHash = "" must be somewhere in main context
                hasher.initialized.add(parseHash)
                hasher.changed.add(parseHash)
                # hasher init() call must be somewhere in main context

        initializeRouter = (resolver, compDef, wire) ->
            createRouter(compDef, wire).then (tempRouter) ->
                routeBinding tempRouter, compDef, wire
                resolver.resolve(tempRouter)
            , (error) ->
                console.error error.stack

        destroy: (resolver, proxy, wire) ->
            tempRouter.dispose()

        factories: 
            contextRouter: initializeRouter