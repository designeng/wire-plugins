define [
    "underscore"
    "when"
    "./route"
], (_, When, Route) ->

    class Controller

        registerGroundRoutes: () ->
            _.forEach @groundRoutes, (routeValue, routeKey) =>
                routeObject = _.extend {}, routeValue, {route: routeKey}

                routeHandler = do (routeObject = routeObject) =>
                    return () =>
                        @routeHandlerFactory.createHandler(routeObject)

                # register route
                new Route(routeKey, routeValue.rules, routeHandler)