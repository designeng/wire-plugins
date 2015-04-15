# model plugin
# FACETS:
#       getProperty
define [
    'underscore'
], (_) ->

    return (options) ->

        getPropertyResolver = (resolver, name, refObj, wire) ->
            resolverOptions = 
                from: refObj.from
                transform: refObj.transform || (value) ->
                    return value

            wire(resolverOptions).then (options) ->
                resolver.resolve options.transform(options.from.getProperty(name))

        return pluginInstance = 
            resolvers:
                getProperty    : getPropertyResolver