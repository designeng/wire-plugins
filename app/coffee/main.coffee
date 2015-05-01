# it works with contextRouter

require [
    "wire"
    "hasher"
    "wire!specs/bootstrapSpec"
    "specs/appRouterSpec"
], (wire, hasher, bootstrapCTX, appRouterSpec) ->

    bootstrapCTX.wire(
        appRouterSpec
    ).then (resultCTX) ->