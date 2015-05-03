define ->

    $plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
        'plugins/template/hb'
        'plugins/template/look'
        'plugins/form/validate'
    ]

    view:
        render:
            template:
                module: "text!components/contacts/template.html"
        insert:
            at: {$ref: 'slot'}

    contactsList:
        render:
            template:
                module: "text!components/contacts/list.html"
        insert:
            at: {$ref: 'dom.first!#contactsWrapper', at: 'view'}
        look:
            to:
                collection: {$ref: 'contacts'}
            listPattern: {$ref: 'contactsListPattern'}
            itemPattern: {$ref: 'contactPattern'}

    contacts:
        create:
            module: "plugins/utils/entity/Collection"
            args: [
                {uniqKey: "email"}
            ]

    contactsListPattern:
        module: "hbs!components/contacts/contactsListPattern"

    contactPattern:
        module: "hbs!components/contacts/contactPattern"

    # displayViewTemplate:
    #     module: 'hbs!components/form/display/display'

    # displayListItemPattern:
    #     module: 'hbs!components/form/display/listItem'

    form:
        render:
            template:
                module: "text!components/contacts/form.html"
        insert:
            at: {$ref: 'dom.first!#contactsFormWrapper', at: 'view'}
        validate:
            fieldNames: [
                "firstName"
                "lastName"
                "email"
            ]
            strategy: {$ref: 'formStrategy'}
            displaySlot: {$ref: 'dom.first!.displayErrorsWrapper', at: 'form'}
            displaySlotClass: "displaySlotClass"
            successHandler: {$ref: 'controller.addContact'}

            # displayViewTemplate     : {$ref: 'displayViewTemplate'}
            # displayListItemPattern  : {$ref: 'displayListItemPattern'}


    nameMessage: "Поле может содержать только русские и английские буквы и дефис"

    formStrategy:
        firstName:
            "firstNameValidation":
                rule: /^[a-zA-Zа-яА-ЯёЁ]+[a-zA-Zа-яА-ЯёЁ\-]*$/g
                message: {$ref: 'nameMessage'}
        lastName: 
            "lastNameValidation":
                rule: /^[a-zA-Zа-яА-ЯёЁ]+[a-zA-Zа-яА-ЯёЁ\-]*$/g
                message: {$ref: 'nameMessage'}
        email: 
            "emailValidation":
                rule: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g   #`'"'
                message: "Введите email"

    controller:
        create: "components/contacts/controller"
        properties:
            contacts: {$ref: 'contacts'}
            contactsList: {$ref: 'contactsList'}
            view: {$ref: 'view'}
        on:
            form:
                "submit": {$ref: 'controller.onSubmit'}
        ready:
            onReady: {}