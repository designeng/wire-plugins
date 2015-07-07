define [
    'jquery'
    'underscore'
], ($, _) ->

    class Controller

        contactsRootElement: null

        onReady: ->
            @contactsPreloader = $('.contacts-preloader')

            @contacts.onKeyRepeat @displayWarning

            @itemFields = _.keys @formStrategy

            $form = $(@form)
            @contactFormInputs = []

            _.each @itemFields, (name) =>
                @contactFormInputs[name] = $form.find("[name='" + name + "']")

            # ajax data loading imitation
            @loadContacts()

        loadContacts: ->
            setTimeout () =>
                @contactsPreloader.hide()

                @contacts.addItem {
                    firstName: 'JOHN'
                    lastName: 'STARKY'
                    email: 'john@el.com'
                }

                @contacts.addItem {
                    firstName: 'RICHARD'
                    lastName: 'TEDDY'
                    email: 'rich@el.com'
                }
            , 1000

        onSubmit: ->
            return false

        onListItemClick: (event) ->
            itemHolder = $(event.target).closest('li')

            _.each @itemFields, (fieldName) =>
                @contactFormInputs[fieldName].val itemHolder.find("[data-field=#{fieldName}]").text()

        onDialogShow: (item) ->
            $('#modal-dialog-title').text("Contact with email #{item.email} exists")

        onDialogConfirmation: =>
            @contacts.update {_id: @currentItem._id}, @currentItem

        onDialogClose: =>
            @clearWarning()

        addContact: (item) =>
            @clearAllWarnings()
            @currentItem = item
            @contacts.addItem item

        clearAllWarnings: ->
            _.forEach @contactsList.getElementsByTagName('li'), (element) ->
                $(element).removeClass 'list-group-item-warning'

        displayWarning: (item) =>
            key = @transformer item._id
            $('#' + key).addClass 'list-group-item-warning'
            return item

        clearWarning: =>
            key = @transformer @currentItem._id
            $('#' + key).removeClass 'list-group-item-warning'
