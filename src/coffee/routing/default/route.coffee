define [
    "plugins/utils/routing/appRouterController"
], (appRouterController) ->

    class Route

        constructor: (route, rules, handler) ->
            @_route = appRouterController.addRoute(route)
            @applyRules(rules)
            @applyHandler(handler)

        applyRules: (rules) ->
            @_route.rules = rules

        applyHandler: (handler) ->
            @_route.matched.add handler