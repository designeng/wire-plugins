require [
    "wire"
    "wire!specs/bootstrapSpec"
    "specs/appRouterSpec"
], (wire, bootstrapCTX, appRouterSpec) ->

    bootstrapCTX.wire(
        appRouterSpec
    ).then (resultCTX) ->