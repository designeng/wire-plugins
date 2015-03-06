# it works with contextRouter

require [
    "wire"
    "hasher"
    "wire!bootstrapSpec"
    "routerMainSpec"
], (wire, hasher, bootstrapCTX, routerMainSpec) ->

    bootstrapCTX.wire(
        routerMainSpec
    ).then (resultCTX) ->

        hasher.prependHash = ""
        hasher.init()