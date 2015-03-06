((define, global, document) ->
    define ->
        has = (feature) ->
            test = has.cache[feature]
            
            # run it now and cache result
            test = (has.cache[feature] = has.cache[feature]())    if typeof test is 'function'
            test
        'use strict'
        has.cache =
            'dom-addeventlistener': ->
                document and 'addEventListener' of document or 'addEventListener' of global

            'dom-createevent': ->
                document and 'createEvent' of document

        has

    return
) (if typeof define is 'function' then define else (factory) ->
    module.exports = factory()
    return
), this, @document