define [
    "jquery"
    "underscore"
], ($, _) ->

    class Controller

        onReady: ->
            _.defer @add

        add: =>
            console.debug "added items"
            @contacts.addItem {
                firstName: "ONE"
                lastName: "TWO"
                email: "test@r.ru"
            }

            @contacts.addItem {
                firstName: "TWO"
                lastName: "THREE"
                email: "test2@r.ru"
            }