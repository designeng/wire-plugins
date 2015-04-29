# behavior plugin
# it can be used as {$ref: "behavior!shiftRight"}
define [
    'behavior/index'
], (behavior) ->

    return (options) ->
        trim = (str) -> 
            str.replace(/^\s+|\s+$/g,'')

        getBehaviorMethod = (name) ->
            name = trim(name)
            if !behavior[name]?
                throw new Error "No behavior method with name '#{name}' provided!"
            else
                return behavior[name]

        resolveBehavior = (resolver, name, refObj, wire) ->
            funcs = []
            if name.indexOf(",") != -1
                names = name.split ","
                for name in names
                    funcs.push getBehaviorMethod(name)
            else
                funcs.push getBehaviorMethod(name)
            resolver.resolve funcs

        applyFactory = (resolver, componentDef, wire) ->
            args = componentDef.options.args
            wire(componentDef.options).then (resultFunctions) ->
                wire(args).then (args) ->
                    funcs = _.reduce resultFunctions, (result, funcItem, index) ->
                        result.push () ->
                            funcItem.apply(@, args[index])
                        return result
                    , []
                    resolver.resolve funcs

        return pluginInstance = 
            resolvers:
                behavior    : resolveBehavior
            factories:
                apply       : applyFactory