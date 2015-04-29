define [
    "underscore"
    "when"
], (_, When) ->

    return (options) ->

        extend = (componentDefinition, wire) ->

            When.promise (resolve) ->
                if !componentDefinition.options.with
                    throw "no 'with' option specified"

                if componentDefinition.options.module
                    wire.loadModule(componentDefinition.options.module).then (Module) ->

                        _keys = _.keys componentDefinition.options.with
                        _values = _.values componentDefinition.options.with

                        class Extended extends Module
                            # no new fields yet

                        i = 0
                        for key in _keys
                            Extended::[key] = _values[i]
                            i++

                        resolve Extended
                    , (error) ->
                        reject error
                else
                    throw "no 'module' option specified"

        extendWithFactory = (resolver, componentDefinition, wire) ->
            extend(componentDefinition, wire).then (extended) ->
                resolver.resolve(extended)
            , (error) ->
                console.error error.stack

        context:
            ready: (resolver, wire) ->
                resolver.resolve()

        factories: 
            extend: extendWithFactory