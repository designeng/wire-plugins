define ->

    $plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
        'plugins/template/hb'
        'plugins/template/look'
        'plugins/form/validate'
        'plugins/template/hbsResolver'
        "plugins/behavior/dialog"
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
            listPattern: {$ref: 'hbsResolver!components/contacts/contactsListPattern'}
            itemPattern: {$ref: 'hbsResolver!components/contacts/contactPattern'}
            transform: 
                _id : {$ref: 'transformer'}

    contacts:
        create:
            module: "plugins/utils/entity/Collection"
            args: [
                {uniqKey: "email"}
            ]

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

    nameMessage: "The field can contain only english and russian letters and hyphen"

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
                message: "Input email"

    dialog:
        createDialog:
            title: "Contact with this email exists"
            body: "Are you going to override it?"
            confirmButtonLabel: "Yes, override it"
            refuseButtonLabel: "No, by no means"
            onConfirmation: {$ref: "controller.onDialogConfirmation"}
            onClose: {$ref: "controller.onDialogClose"}
            showOn: {$ref: "controller.displayWarning"}
            appendTo: {$ref: "view"}

    controller:
        create: "components/contacts/controller"
        properties:
            contacts: {$ref: 'contacts'}
            transformer: {$ref: 'transformer'}
            contactsList: {$ref: 'contactsList'}
            view: {$ref: 'view'}
        on:
            form:
                "submit": {$ref: 'controller.onSubmit'}
            contactsList:
                "click": {$ref: 'controller.onListItemClick'}
        ready:
            onReady: {}

    transformer:
        module: "components/contacts/hashCode"
        