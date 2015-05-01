define [
    "underscore"
    "plugins/utils/entity/Collection"
], (_, Collection) ->

    # TODO: merge with contextHashController?

    class ContextController

        currentParams: []

        # routeObserver is watching for @setRouteData invocations, analizing it's return
        # and desides basicly on provided data to reload context, load it from cache, or other.
        routeObserver: null

        _contextHash: new Collection()

        updateCachedItem: (route, options) ->
            cachedContext = @_contextHash.find {route: route}

            if !cachedContext?
                @_contextHash.addItem _.extend({route: route}, options)
            else
                @_contextHash.update {route: route}, options

        register: (parentContext, childContext, child) ->
            # registration enter point (key): child.route

            # TODO: for "search/{searchId}/offer/{offerId}" now baseRoute="search" - is it wrong? (TODO: set 'base' option)

            # first get base route for the current route
            baseRoute = @routeStrategy.getBaseRoute(child.route)

            hash = child.params?["input"]

            # parent context and child context can be cached in different route keys
            @updateCachedItem baseRoute, {
                "parentContext": parentContext
                "hash": hash
            }

            @updateCachedItem child.route, {
                "childContext": childContext
                "hash": hash
            }

        unregister: (route) ->
            # begin from child
            types = ["child", "parent"]
            _.each types, (type) => 
                context = @getRegistredContext(route, type)
                context?.destroy()
            @_contextHash.reset()

        # @param {Object} parsedHashObject
        #       - @param {Strins} parsedHashObject.newHash
        #       - @param {Strins} parsedHashObject.oldHash
        onHashChanged: (parsedHashObject) ->
            @destroyOnBlur(parsedHashObject.oldHash)

        # @param {Strins} hash
        destroyOnBlur: (hash) ->
            cachedItems = @_contextHash.where({hash: hash})
            item = cachedItemWithChildContext = _.filter(cachedItems, (item) ->
                return item["childContext"]?
            )[0]

            if item? and item["childContext"]?.__environmentVars.destroyOnBlur
                # desyroy context
                item["childContext"].destroy()
                # and remove item from collection
                @_contextHash.remove item["_id"]

        clearCache: ->
            @_contextHash.each (item) ->
                item["childContext"]?.destroy()
                item["parentContext"]?.destroy()
            @_contextHash.reset()

        # route = child.route
        getRegistredContext: (route, type) ->
            if type is "parent"
                baseRoute = @routeStrategy.getBaseRoute(route)
                return @_contextHash.find({route: baseRoute})?.parentContext
            else if type is "child"
                return @_contextHash.find({route: route})?.childContext

        # TODO: remove if not used 
        # context duck-typing
        ensureContext: (context) ->
            if context.destroy and context.resolve and context.wire
                return true
            else
                return false

        startContextHashRevision: (child) ->
            positions = @calculatePositions child

            # it should be always different, checking is not needed in general
            if !@theSame(child.params, @currentParams)
                mutations = @indexesOfMutation(child.params, @currentParams)
                if @changesOccurred(mutations, positions)
                    @unregister(child.route)
                    @currentParams = child.params

        guessContextResetRoutePositions: (route) =>
            fragments = @normalizeRoute route
            res = _.reduce fragments, (result, item, index) ->
                result.push index if item.match("\\{(.*)}")
                return result
            , []
            return res

        normalizeRoute: (route) ->
            if _.isArray route
                return route
            else if _.isString route
                return route.split "/"

        validate: (emphasizedPositions, positions) ->
            return _.reduce emphasizedPositions, (result, positionValue) ->
                if _.indexOf(positions, positionValue) == -1
                    result = result * 0
                return result
            , 1

        # option 'contextResetRoutePositions' described in childRoutes options comment.
        calculatePositions: (child) ->
            positions = @guessContextResetRoutePositions child.route
            emphasizedPositions = child.contextResetRoutePositions
            if emphasizedPositions
                isValid = @validate emphasizedPositions, positions
                if !isValid
                    throw new Error "Provided for child route '#{child.route}' contextResetRoutePositions is not valid!"
                return emphasizedPositions
            else
                return positions

        # @param {Array} a
        # @param {Array} b
        # @returns {Boolean}
        theSame: (a, b) ->
            _.all _.zip(a, b), (x) -> x[0] == x[1]

        # @param {Array} a
        # @param {Array} b
        # @returns {Array}
        indexesOfMutation: (a, b) ->
            _.reduce _.zip(a, b), (result, item, index) -> 
                if item[0] != item[1]
                    result.push index
                return result
            , []

        changesOccurred: (mutations, positions) ->
            return !!_.intersection(mutations, positions).length