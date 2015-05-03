define [
    'underscore'
], (_) ->

    return (options) ->

        hbsResolver = (resolver, name, refObj, wire) ->
            require ["hbs!" + name], (result) ->
                resolver.resolve result

        return pluginInstance = 
            resolvers:
                hbsResolver    : hbsResolver