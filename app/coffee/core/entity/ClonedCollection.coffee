define [
    "./Collection"
], (Collection) ->

    class ClonedCollection extends Collection

        cloneSource: (array) ->
            source = @addSource(array)
            @_clonedSource = source
            return source

        getClonedSource: ->
            return @_clonedSource

        restoreLastSourceRevision: ->
            @source = @_clonedSource
