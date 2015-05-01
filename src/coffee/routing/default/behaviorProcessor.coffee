define [
    "underscore"
    "when"
    "when/sequence"
], (_, When, sequence) ->

    class BehaviorProcessor

        sequenceBehavior: (childContext) ->

            return When(@pluginWireFn.getProxy(childContext.behavior)
                    , (behaviorObject) ->
                        tasks = behaviorObject.target
                        # normalize tasks
                        if _.isFunction tasks
                            tasks = [tasks]
                        # @param {Array} tasks - array of tasks
                        # @param {Object} childContext - current resulted child context
                        sequence(tasks, childContext)
                    , () ->
                        # nothing to do, no behavior defined
            ).then () ->
                return childContext
            , (error) ->
                console.error "BehaviorProcessor::sequenceBehavior ERROR:", error.stack
            