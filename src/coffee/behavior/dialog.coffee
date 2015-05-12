# experimental: "modal dialog" component factory
define [
    "meld"
    "plugins/utils/dialog/modalDialogPattern"
], (meld, modalDialogPattern) ->

    return (options) ->
        removers = []

        # one dot access restriction
        getClassAndMethod = (str) ->
            return str.split(".").slice(0, 2)

        createDialogFactory = (resolver, componentDef, wire) ->
            $modalDialogEl = null

            [providerClass, invoker] = getClassAndMethod(componentDef.options.showOn.$ref)

            wire.resolveRef(providerClass).then (provider) ->

                removers.push meld.after provider, invoker, () ->
                    $modalDialogEl.show()

                wire(componentDef.options)
                    .then (options) ->
                        html = modalDialogPattern({
                            title               : options.title
                            body                : options.body
                            confirmButtonLabel  : options.confirmButtonLabel
                        })

                        $modalDialogEl = $(options.appendTo).append(html).find(".modal")
                        $closeBtn = $modalDialogEl.find("button.close")
                        $confirBtn = $modalDialogEl.find("button.confirmation")

                        $closeBtn.on "click", ->
                            $modalDialogEl.hide()

                        $confirBtn.on "click", ->
                            options.onConfirmation.call()
                            $modalDialogEl.hide()

                        resolver.resolve()

        destroy = (resolver, wire) ->
            for remover in removers
                remover.remove()
            resolver.resolve()

        return pluginInstance = 

            context:
                "destroy": destroy

            factories:
                createDialog    : createDialogFactory