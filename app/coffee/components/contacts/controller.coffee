define [
    "jquery"
    "underscore"
    "./hashCode"
], ($, _, hashCode) ->

    class Controller

        contactsRootElement: null

        onReady: ->
            @contactsPreloader = $(".contacts-preloader")

            @contacts.onKeyRepeat @displayWarning

            # ajax data loading imitation
            setTimeout () =>
                @add()
            , 1000

        add: ->
            @contactsPreloader.hide()

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

        onSubmit: ->
            return false

        addContact: (item) =>
            @clearAllWarnings()
            @contacts.addItem item

        clearAllWarnings: ->
            _.forEach @contactsList.getElementsByTagName("li"), (element) ->
                $(element).removeClass "list-group-item-warning"

        displayWarning: (item) =>
            key = @transformer item._id
            $("#" + key).addClass "list-group-item-warning"