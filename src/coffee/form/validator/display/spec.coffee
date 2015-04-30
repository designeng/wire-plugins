define
    $plugins:[
        "wire/dom"
        "wire/dom/render"
        "wire/on"
    ]

    # default displayView
    displayView:
        render:
            template:
                module: "text!core/plugin/form/validator/display/display.html"
        insert:
            at: {$ref: 'displaySlot'}

    listItemPattern:
        module: "hbs!core/plugin/form/validator/display/listItem"

    controller:
        create: "core/plugin/form/validator/display/controller"
        properties:
            displayView         : {$ref: 'displayView'}
            listItemPattern     : {$ref: 'listItemPattern'}
            displaySlot         : {$ref: 'displaySlot'}
            displaySlotClass    : {$ref: 'displaySlotClass'}
        ready:
            onReady: {}