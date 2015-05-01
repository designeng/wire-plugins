define [
    "underscore"
], (_) ->

    prepareBehavior = (behavior) ->
        if _.isArray behavior
            length = behavior.length
            behaviorRef = _.reduce behavior, (result, item, index) ->
                if index < length - 1 then suffix = "," else suffix = ""
                result += _.pick(item, "method")["method"] + suffix
            , "behavior!"
            argumentsRef = _.reduce behavior, (result, item, index) ->
                if index < length - 1 then suffix = "," else suffix = ""
                args = _.pick(item, "args")["args"]
                result.push args
                return result
            , []
            behavior =
                apply: {$ref: behaviorRef, args: argumentsRef}
            return behavior
        else if _.isObject behavior
            return behavior