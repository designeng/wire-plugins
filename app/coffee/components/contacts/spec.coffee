define ->

    $plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
    ]

    controller:
        create: "components/contacts/controller"
        ready:
            onReady: {}