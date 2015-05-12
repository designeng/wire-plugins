define [
    "jquery"
    "underscore"
], ($, _) ->

    class Controller

        contactsRootElement: null

        onReady: ->
            @contactsPreloader = $(".contacts-preloader")

            @contacts.onKeyRepeat @displayWarning

            # ajax data loading imitation
            @loadContacts()

        loadContacts: ->
            setTimeout () =>
                @contactsPreloader.hide()

                @contacts.addItem {
                    firstName: "JOHN"
                    lastName: "STARKY"
                    email: "john@el.com"
                }

                @contacts.addItem {
                    firstName: "RICHARD"
                    lastName: "TEDDY"
                    email: "rich@el.com"
                }
            , 1000

        onSubmit: ->
            return false

        onListItemClick: (event) ->
            console.debug "onListItemClick", $(event.target).closest("li")

        addContact: (item) =>
            @clearAllWarnings()
            @contacts.addItem item

        clearAllWarnings: ->
            _.forEach @contactsList.getElementsByTagName("li"), (element) ->
                $(element).removeClass "list-group-item-warning"

        displayWarning: (item) =>
            key = @transformer item._id
            $("#" + key).addClass "list-group-item-warning"
            
