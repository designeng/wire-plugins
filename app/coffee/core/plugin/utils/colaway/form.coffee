###*
@license MIT License (c) copyright B Cavalier & J Hann
###
((define) ->
    define ->
        objectToForm = (form, object, filter) ->
            els = undefined
            els = form.elements
            filter = alwaysInclude    if typeof filter isnt 'function'
            Object.keys(object).forEach (name) ->
                el = undefined
                value = undefined
                value = object[name]
                el = els[name]
                return    unless filter(el, name, value)
                if (el.length and el.type isnt 'select-one') or isMultiSelect(el)
                    setGroupValue el, value
                else
                    setElementValue el, value
                return

            form
        setGroupValue = (group, value) ->
            getBooleanValue = undefined
            getBooleanValue = (if Array.isArray(value) then (array, el) ->
                array.indexOf(el.value) >= 0
             else (value, el) ->
                el.value is value
            )
            forEach.call group, (el, i) ->
                if isCheckable(el)
                    el.checked = getBooleanValue(value, el)
                else
                    el.value = textValue(value[i])
                return

            return
        setElementValue = (el, value) ->
            if isCheckable(el)
                el.checked = !!value
            else if isMultiSelect(el)
                unless Array.isArray(value)
                    el.value = textValue(value)
                else
                    setMultiSelectValue el, value
            else
                el.value = textValue(value)
            return
        isMultiSelect = (el) ->
            el.type is 'select-multiple'
        setMultiSelectValue = (select, values) ->
            i = undefined
            option = undefined
            options = undefined
            options = select.options
            i = 0
            option.selected = true    if values.indexOf(option.value) >= 0    while (option = options[i++])
            return
        textValue = (value) ->
            (if not value? then '' else value)
        isCheckable = (el) ->
            el.type is 'radio' or el.type is 'checkbox'
        
        ###*
        Simple routine to pull input values out of a form.
        @param form {HTMLFormElement}
        @return {Object} populated object
        ###
        formToObject = (formOrEvent, filter) ->
            obj = undefined
            form = undefined
            els = undefined
            seen = undefined
            i = undefined
            el = undefined
            name = undefined
            value = undefined
            form = formOrEvent.selectorTarget or formOrEvent.target or formOrEvent
            filter = alwaysInclude    if typeof filter isnt 'function'
            obj = {}
            els = form.elements
            seen = {} # finds checkbox groups
            i = 0
            while (el = els[i++])
                name = el.name
                
                # skip over non-named elements and fieldsets (that have no value)
                continue    if not name or ('value' not of el) or not filter(el)
                value = el.value
                if el.type is 'radio'
                    
                    # only grab one radio value (to ensure that the property
                    # is always set, we set false if none are checked)
                    if el.checked
                        obj[name] = value
                    else obj[name] = false    unless name of seen
                else if el.type is 'checkbox'
                    unless name of seen
                        
                        # we're going against normal form convention by ensuring
                        # the object always has a property of the given name.
                        # forms would normally not submit a checkbox if it isn't
                        # checked.
                        # Note: IE6&7 don't support el.hasAttribute() so we're using el.attributes[]
                        obj[name] = (if el.attributes['value'] then !!el.checked and value else !!el.checked)
                    
                    # collect checkbox groups into an array.
                    # if we found a false value, none have been checked so far
                    else obj[name] = (if (name of obj and obj[name] isnt false) then [].concat(obj[name], value) else [value])    if el.checked
                else if el.type is 'file'
                    obj[name] = getFileInputValue(el)    unless name of seen
                else if el.multiple and el.options
                    
                    # grab all selected options
                    obj[name] = getMultiSelectValue(el)
                else
                    obj[name] = value
                seen[name] = name
            obj
        getFileInputValue = (fileInput) ->
            if 'files' of fileInput
                (if fileInput.multiple then slice.call(fileInput.files) else fileInput.files[0])
            else
                fileInput.value
        getMultiSelectValue = (select) ->
            values = undefined
            options = undefined
            i = undefined
            option = undefined
            values = []
            options = select.options
            i = 0
            values.push option.value    if option.selected    while (option = options[i++])
            values
        alwaysInclude = ->
            true
        forEach = undefined
        slice = undefined
        forEach = Array::forEach
        slice = Array::slice
        return (
            getValues: formToObject
            getMultiSelectValue: getMultiSelectValue
            setValues: objectToForm
            setElementValue: setElementValue
            setGroupValue: setGroupValue
            setMultiSelectValue: setMultiSelectValue
            isCheckable: isCheckable
        )
        return

    return
) (if typeof define is 'function' and define.amd then define else (factory) ->
    module.exports = factory()
    return
)