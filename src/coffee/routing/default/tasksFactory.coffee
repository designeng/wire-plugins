define [
    "underscore"
    "when"
    "when/pipeline"
], (_, When, pipeline) ->

    class TasksFactory

        allowedReasons: ["CACHED"]

        noop: (object) ->
            return object

        constructor: (target, tasks) ->
            @distributive = @provideFunctions(target, @prepareTasks(tasks))
            return @

        prepareTasks: (tasks) ->
            distributive = {}
            distributive["tasks"] = tasks
            return distributive

        provideFunctions: (target, distributive) ->
            result = {}
            _.each distributive, (methods, key) ->
                result[key] = _.map methods, (method) ->
                    if !target[method]
                        throw new Error "No method with name '#{method}' provided!"
                    else
                        return target[method]
                , target
            , target
            return result

        runTasks: (item, callback, options) ->
            callback = @noop unless _.isFunction callback

            if options?.skip
                tasks = _.filter @distributive["tasks"], (methodToSkip, index) ->
                    if index in options.skip
                        return false
                    else
                        return true
            else
                tasks = @distributive["tasks"]

            pipeline(tasks, item).then (result) ->
                callback(result)
            , (reason) =>
                if reason in @allowedReasons
                    @noop()
                # TODO: navigate to error page?
                else
                    console.error "PIPELINE TASKS ERROR:::", reason