# @license MIT License (c) copyright D Savenok

# wire/behavior plugin
 
# Licensed under the MIT License at:
# http://www.opensource.org/licenses/mit-license.php

# it can be used as {$ref: "behavior!doSomething"}

define [
    'behavior/index'
], (behavior) ->

    return (options) ->

        trim = (str) -> 
            str.replace(/^\s+|\s+$/g,'')

        resolveBehavior = (resolver, name, refObj, wire) ->
            funcs = []
            if name.indexOf(",") != -1
                names = name.split ","                
                for name in names
                    name = trim name
                    funcs.push behavior[name]
            else
                name = trim name
                funcs.push behavior[name]
            resolver.resolve funcs

        createResolver = (resolverFunc, options) ->
            return (resolver, name, refObj, wire) ->
                return resolverFunc(resolver, name, refObj, wire)

        resolvers = {}

        resolvers.behavior = createResolver(resolveBehavior, options)

        pluginInstance = 
            resolvers: resolvers

        return pluginInstance