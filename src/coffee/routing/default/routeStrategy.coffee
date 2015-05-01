define [
    "underscore"
], (_) ->

    memoGroupedByLength = null

    getRouteFragments = (route) ->
        return route.split("/")

    withoutTheLast = (array) ->
        return _.initial(array)

    # start find base route recursive
    # @param {String} route
    # @fragments {Array} route fragments
    # @param {Number} level - length of route fragments
    getBaseRouteRecursive = (route, fragments, level) ->
        if level == 1
            # it's the base itself
            return route
        else
            base = _.where(memoGroupedByLength[level], {route: route, base: true})[0]
            if base?
                return base.route
            else
                parentFragments = withoutTheLast(fragments)
                getBaseRouteRecursive(parentFragments.join("/"), parentFragments, parentFragments.length)

    scanZipped = (memo, pair) ->

        first = pair[0]
        last  = pair[1]

        if _.isUndefined(first)
            return memo * 0

        if first.match("\\{(.*)}") and !_.isUndefined last
            return memo * 1

        if first != last 
            return memo * 0
        else
            return memo * 1

    getCurrentRoute = () ->
            return @appRouterController.getCurrentRoute()

    class RouteStrategy

        constructor: (options) ->
            if options?
                @childRoutes  = options.childRoutes
                @groundRoutes = options.groundRoutes

        # not used yet
        groupByLength: ->
            return _.groupBy _.keys(@childRoutes), (route) ->
                return getRouteFragments(route).length

        getComponentRoute: (spec, routeMask) ->
            return _.findKey @childRoutes, (routeObject, routeKey) ->
                if routeMask.length < routeKey.length
                    condition = (routeKey.substring(0, routeMask.length) == routeMask)
                else
                    condition = (routeMask.substring(0, routeKey.length) == routeKey)
                return routeObject.spec == spec && condition

        getBaseRoute: (route) ->
            # memoize childRoutes groups by fragment length
            if !memoGroupedByLength?
                keys    = _.keys @childRoutes
                memoGroupedByLength = _.reduce keys, (result, item, index) =>
                    fragmentsLength = getRouteFragments(item).length
                    if !result[fragmentsLength]?
                        result[fragmentsLength] = []

                    element = {
                        route: item
                    }
                    if @childRoutes[item].base
                        element["base"] = true

                    result[fragmentsLength].push element
                    return result
                , {}
            
            fragments = getRouteFragments(route)
            baseRoute = getBaseRouteRecursive(route, fragments, fragments.length)
            return baseRoute

        getChild: (route) ->
            routeParams = getCurrentRoute.call(@).params

            childRoutesKeys = _.keys @childRoutes

            for routeKey in childRoutesKeys
                fragments = routeKey.split("/")
                zipped = _.zip fragments, routeParams

                # res in result will be 1 or 0
                # 1 - routeKey is matched to currentRoute, 0 - not matched

                res = _.reduce(zipped, scanZipped, 1)

                if res
                    childRouteObject = @childRoutes[routeKey]
                    childRouteObject.route = routeKey
                    childRouteObject.params = routeParams
                    return childRouteObject

            return undefined