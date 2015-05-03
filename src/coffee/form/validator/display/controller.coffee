define [
    "underscore"
    "jquery"
    "plugins/utils/normalize"
], (_, $, normalize) ->
    class Controller

        currentErrorClass: undefined

        basePrefixes:
            "text"   :
                prefix  : "formInput__state_show_"
                suffix  : "Input"
            "date"   :
                prefix  : "formInput__state_show_"
                suffix  : "Input"
            "select" :
                prefix  : "formSelect__state_show_"
                suffix  : "Select"

            "number":
                prefix  : "formInput__state_show_"
                suffix  : "Input"
            "tel"   :
                prefix  : "formInput__state_show_"
                suffix  : "Input"
            "email"   :
                prefix  : "formInput__state_show_"
                suffix  : "Input"
            "hidden":
                prefix  : "formInput__state_show_"
                suffix  : "Input"

        onReady: ->
            [@displayView, @displaySlot] = normalize @displayView, @displaySlot

            @listRootNode = @displayView.find("ul")

        # @param {Array} messages - errors or hint
        # @param {String} type - in ["error", "hint"]
        # @param {String} name - input name associated with messages
        displayMessage: (messages, type, name) ->
            if !messages || !messages.length
                @displaySlot.hide()
            else
                # all wrapped to arrays messages should be unwrapped
                messages = _.flatten messages

                messagesHtml = _.reduce messages, (content, text) =>
                    content += @displayListItemPattern({text: text, type: type}) if text
                    return content
                , ""

                console.debug "messagesHtml", messagesHtml

                if messagesHtml
                    @listRootNode.html(messagesHtml)

                    classMessage = @displaySlotClass + "__" + name
                    classMessage += ' ' + @displaySlotClass + "_type_" + type if type

                    @displaySlot
                        .removeClass(@currentErrorClass)
                        .addClass(classMessage)
                    @currentErrorClass = classMessage

                    @displaySlot.show()

        hideError: ->
            @displaySlot.hide()

        # helper for usage in outer highLight method
        switchState: (input, state) ->
            # TODO: add "filter" option to "common" field definition to prevent all operations with not used in strategy inputs?
            return false if input.size() == 0

            # for exclusions
            if input.attr("data-input-exclusion") == "exclusion"
                stateErrorClass         = input.attr("data-state-error-class")
                stateSemaphoreElement   = input.prev()
                if state in ["success", "error"]
                    stateSemaphoreElement.addClass stateErrorClass
                else
                    # state is "initial"
                    stateSemaphoreElement.removeClass stateErrorClass
                    
            # for input types: [text, select]
            else
                inputType = input.attr "type"
                basePrefix = @basePrefixes[inputType].prefix

                classesToRemove = _.reduce ["success", "error"], (result, state) ->
                    return result += basePrefix + state + " "
                , ""

                stateSemaphoreElement = input.closest(".form" + @basePrefixes[inputType].suffix)
                stateSemaphoreElement.removeClass(classesToRemove)

                if state in ["success", "error"]
                    stateSemaphoreElement.addClass(basePrefix + state)
                # if state is "initial" do nothing

            if state == "success"
                @hideError()









