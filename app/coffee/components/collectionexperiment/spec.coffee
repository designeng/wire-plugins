define ->

    $plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
    ]

    controller:
        create: "components/collectionexperiment/controller"
        ready:
            onReady: {}