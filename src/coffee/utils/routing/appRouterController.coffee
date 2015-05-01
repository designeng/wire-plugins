define [
    "crossroads"
    "plugins/utils/navigation/navigateToError"
], (crossroads, navigateToError) ->

    class AppRouterController

        constructor: ->
            router = crossroads.create()

            router.bypassed.add (route) -> 
                navigateToError "404", "The page with route #{route} you tried to access does not exist"

            router.getCurrentRoute = () ->
                return @._prevRoutes[0]

            router.resetPreviousRoutes = () ->
                @._prevRoutes = []

            return router

    return appRouterController = new AppRouterController() unless appRouterController?