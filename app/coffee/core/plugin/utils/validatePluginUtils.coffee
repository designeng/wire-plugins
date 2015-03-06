define [
    "when"
    "when/sequence"
    "underscore"
    "jquery"
    "./colaway/bindingHandler"
    "./colaway/guess"
    "./colaway/form"
], (When, sequence, _, $, bindingHandler, guess, FormUtil) ->

    class ValidatePluginUtils
   
        target: null
        $target: null

        defaultInputEvent: "change"

        constructor: ->

        normalizeTarget: (target) ->
            if target instanceof jQuery
                return target
            else
                @target = target
                return $(target)

        registerTarget: (target) ->
            @$target = @normalizeTarget(target)

            return @$target

        unregisterTarget: ->
            @$target.unbind()



        getFormElementValue: (form, name) ->
            return form.elements[name].value

        getAllFormValues: (form) ->
            console.log "@form:::", form
            # return formToObject(form)
            return FormUtil.getValues(form)

        # we want deal with the function
        normalizeRule: (rule) ->
            if _.isFunction rule
                return rule
            else if _.isRegExp rule
                return (value) ->
                    console.log "value >>>>>>>>>>>>>>", value
                    try
                        # value = Array::slice.call(arguments, 1)
                        return value.match rule
                    catch e
                        console.log ">>>>>>>>>>>>>>>", e
                        return false

        # @returns {Array}
        extractStrategies: (options) ->
            _strategies = []
            for name, strategies of options.fields
                _strategies.push _.values(strategies)[0]
            return _strategies

        toPromise: (func, message) ->
            promise = When.promise (resolve, reject) ->
                isValid = func()
                if isValid
                    resolve(true)
                else
                    reject(message)
            return promise

        normalizeStrategyItem: (item) ->
            func = @normalizeRule(item.rule)
            console.log "func::::::::::::",func
            # we should return item without message field - it's incapsulated in promise now
            _item = {}
            # _item.rule = @toPromise(func, item.message)
            _item.rule = item.rule
            return _item

        normalizeStrategyItemsArray: (array) ->
            return _.map array, (item) =>
                console.log "ITEM:::", item
                return @normalizeStrategyItem(item)

        getRulesArray: (array) ->
            return _.map array, (item) =>
                return item.rule


        validate: (extracted, values) ->
            return sequence(extracted, values).then (res) ->
                console.log "RES::", res
            , (err) -> console.log "ERR:::", err


        # ------- deprecated? ---------------
        getAllInputs: () ->
            inputs = @$target.each () ->
                $(@).filter(':input')

        defaultInputHandler: (options) ->
            inputEvent = options.event || @defaultInputEvent

        setInputHandler: (name, handler) ->
            $input = @$target.find("[name='#{name}']")
            handler = handler || @defaultInputHandler()
            $input.bind defaultInputEvent, handler


        # cola-way function 
        # formElementFinder: (rootNode, nodeName) ->
        #     if rootNode.elements and rootNode.elements.length
        #         return rootNode.elements[nodeName]

