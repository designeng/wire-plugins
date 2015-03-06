# from cola: https://github.com/cujojs/cola/blob/dev/dom/form.js

define ->
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

        filter = alwaysInclude  if typeof filter isnt "function"

        obj = {}

        els = form.elements
        seen = {} # finds checkbox groups
        i = 0

        while (el = els[i++])
            name = el.name
    
            # skip over non-named elements and fieldsets (that have no value)
            continue if not name or ("value" not of el) or not filter(el)

            value = el.value
            
            if el.type is "radio"
      
                # only grab one radio value (to ensure that the property
                # is always set, we set false if none are checked)
                if el.checked
                    obj[name] = value
                else obj[name] = false  unless name of seen
            
            else if el.type is "checkbox"
                unless name of seen
        

                    obj[name] = (if el.attributes["value"] then !!el.checked and value else !!el.checked)
      
                else if el.checked
                    obj[name] = (if (name of obj and obj[name] isnt false) then [].concat(obj[name], value) else [value])

            else if el.type is "file"
                obj[name] = getFileInputValue(el)  unless name of seen
            
            else if el.multiple and el.options
      
                # grab all selected options
                obj[name] = getMultiSelectValue(el)
            else
                obj[name] = value
            seen[name] = name

        return obj