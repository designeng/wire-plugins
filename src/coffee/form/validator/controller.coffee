define [
    "underscore"
    "jquery"
    "when/pipeline"
    "behavior/prospect/scroll"
], (_, $, pipeline, scroll) ->

    class Controller
        form: null

        inputs: {}

        streams: {}

        errors: {}

        successed: {}

        forgotten: []

        isActualField: (obj) ->
            return if @fieldNames.hasOwnProperty(obj.name) then true else false

        checkAndShowRegisteredError: (obj) ->
            result = @checkForRegisteredError(obj)
            @validate(obj) if result
            return result

        checkForRegisteredError: (obj) ->
            return if @errors[obj.name] then true else false

        getRegisteredError: (obj) ->
            obj["errors"] = @errors[obj.name]
            return obj

        # TODO: extract all custom jquery to outer logic
        scrollToFocusInput: (obj) ->
            $input = $('input[name=' + obj.name + ']')
            if $input.length
                unless $input.is('[type=date]')
                    $wrapper = $input.closest('.layoutPage__sliderSlot')
                    scroll.focusToElement($input, $wrapper, 'blur')

        hideError: (obj) ->
            @messageDisplay.controller.hideError()

        displayError: (obj) ->
            @messageDisplay.controller.displayMessage obj.errors, "error", obj.name
            return obj

        displayHint: (obj) ->
            hint = @validator.strategy[obj.name]?["hint"]
            if !@successed[obj.name] and hint?
                @messageDisplay.controller.displayMessage [hint], "hint", obj.name
            return obj

        validate: (obj) ->
            res = @validator.validate(obj.name, obj.value, @inputs, @)
            if res.errors
                obj.errors = res.errors
            return obj

        registerError: (obj) ->
            if obj.errors
                @errors[obj.name] = obj.errors
                delete @successed[obj.name]
            else
                @successed[obj.name] = true
                delete @errors[obj.name]
            return obj

        highLight: (obj) ->
            if obj.errors
                state = "error"
            else
                state = "success"
            @switchState(@inputs[obj.name], state)
            return obj

        validateAll: ->
            firstDefectObjectInForm = undefined

            formData = {}

            for name in _.keys @fieldNames
                value = $.trim @inputs[name].val()
                formData[name] = value
                res = @validate({name: name, value: value})
                if res.errors
                    obj = {name: name, value: value, errors: res.errors}
                    firstDefectObjectInForm = obj if !firstDefectObjectInForm

                    @highLight(obj)
                    @registerError(obj)

            # show error for first defect field in the form
            if firstDefectObjectInForm
                @displayError(firstDefectObjectInForm)
                @focusToField(firstDefectObjectInForm)
            else
                # no errors
                @successHandler(formData)

        switchState: (element, state) ->
            @messageDisplay.controller.switchState(element, state)

        focusToField: (obj) ->
            @inputs[obj.name].focus()

        swithToInitialState: (fieldName) ->
            @switchState(@inputs[fieldName], "initial")
            return fieldName

        forgetField: (fieldName) ->
            delete @fieldNames[fieldName]
            @forgotten.push fieldName
            # we should not delete form's input from our inputs list (it can be involded in validation process later)
            # only the states
            delete @errors[fieldName]
            delete @successed[fieldName]
            return fieldName

        addStrategyField: (fieldName) ->
            @fieldNames[fieldName] = true

        disableField: (fieldName) ->
            @swithToInitialState(fieldName)
            @inputs[fieldName].val("").prop("disabled", true)
            @forgetField(fieldName)

        enableField: (fieldName) ->
            @fieldNames[fieldName] = true
            @inputs[fieldName].prop("disabled", false)
            @addStrategyField fieldName

        # all errors stored in errors object by field name
        clearFieldErrors: (fieldName) ->
            delete @errors[fieldName]

        reset: ->
            @successed = {}
            @errors = {}
            @hideError()
            _.forEach @forgotten, (fieldName) =>
                @fieldNames[fieldName] = true

            for fieldName, isActual of @fieldNames
                if isActual == true
                    @enableField(fieldName)
                    @swithToInitialState(fieldName)

        invoke: (name, condition) ->
            doInvoke = (name) =>
                tasks = [@.validate, @.registerError, @.highLight]
                pipeline(tasks, {name: name, value: @.inputs[name].val()})

            if _.indexOf(["not blank", "blank"], condition) == -1
                throw new Error "Condition is not recognized!"
            if condition == "not blank" and $.trim(@.inputs[name].val())
                doInvoke(name)
            if condition == "blank" and !$.trim(@.inputs[name].val())
                doInvoke(name)