define [
    "underscore"
    "jquery"
    "plugins/utils/normalize"
], (_, $, normalize) ->
    
    class Controller

        currentErrorClass: undefined

        onReady: ->
            [@displayView, @displaySlot] = normalize @displayView, @displaySlot

            @listRootNode = @displayView

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

            if state is "error"
                $(input).closest(".form-group").addClass "has-error"
            else
                $(input).closest(".form-group").removeClass "has-error"

            if state == "success"
                @hideError()









