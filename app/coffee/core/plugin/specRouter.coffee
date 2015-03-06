# specRouter use case
# every object interested to add private route handler must define specRouter facet

# controller:
#   create: "controllerModule"
#       specRouter:
#           routes:
#               "one/route": "oneRouteHandler"
#               "two/route/{id}": "secondRouteHandler"
#               ..... etc ...................

define [
    "crossroads"
    "underscore"
    "hasher"
], (crossroads, _, hasher) ->

    return (options) ->
        
        target = null

        parseHash = (newHash, oldHash) ->
            target.router.parse newHash

        routeBinding = (facet, options, wire) ->
            target = facet.target

            if !target["router"]
                target.router = crossroads.create()
            else
                throw Error "target has router yet!"

            for route, handler of facet.options.routes
                if target[handler]
                    # first bind handler to it's owner context
                    _.bindAll target, handler
                    target.router.addRoute(route, target[handler])
        
                else
                    throw Error "target has not handler '#{handler}'"

            if facet.options.routes
                hasher.prependHash = ""
                hasher.initialized.add(parseHash)
                hasher.changed.add(parseHash)

                # hasher init() call must be somewhere in main context!

        specRouterBinding = (resolver, facet, wire) ->
            resolver.resolve(routeBinding(facet, options, wire))

        context:
            destroy: (resolver, wire) ->
                target.router.dispose()

        facets:
            specRouter:
                ready: specRouterBinding