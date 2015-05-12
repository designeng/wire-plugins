define [
    "underscore"
    "eventEmitter"
], (_, EventEmitter) ->

    class Model extends EventEmitter

        constructor: (object) ->
            @_attributes = object || {}

        getProperty: (name) ->
            if name is ""
                throw new Error "Property must not be empty!"
            return @_attributes[name]

        # @param {Object | Function} properties. If is function, will be invoked.
        setProperties: (properties) ->
            # normalize it
            if _.isFunction properties
                properties = properties()

            names = _.keys(properties)
            _.each names, (name) =>
                @setProperty(name, properties[name])

            return @_attributes

        setProperty: (name, value) ->
            @_attributes[name] = value

        addSource: (object) ->
            @_attributes = object
            return @

        getAttributes: ->
            return @_attributes

        clearAttributes: ->
            @_attributes = {}