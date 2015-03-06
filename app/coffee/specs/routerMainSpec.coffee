# routerMainSpec
define
    $plugins: [
        "wire/debug"
        "wire/dom"
        "core/plugin/contextRouter"
    ]

    appRouter:
        contextRouter: 
            routes:
                "collectionexperiment"    :
                    spec: "components/collectionexperiment/spec"
                    slot: {$ref: "dom.first!#application"}

