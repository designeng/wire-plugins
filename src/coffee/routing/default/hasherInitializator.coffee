define [
    "hasher"
    "plugins/utils/navigation/navigate"
], (hasher, navigate) ->

    class HasherInitializator

        parseHash: (newHash, oldHash) =>
            if newHash.slice(-1) == "/"
                navigate newHash.slice(0, -1), "replace"
                return undefined

            @appRouterController.parse newHash
            return {
                newHash
                oldHash
            }

        initialize: () =>
            hasher.initialized.add(@parseHash)
            hasher.changed.add(@parseHash)

            hasher.prependHash = ""
            hasher.init()