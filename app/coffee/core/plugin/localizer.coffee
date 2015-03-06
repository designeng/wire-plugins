define [
	"underscore"
    "when"
    "i18n!nls/general"
], (_, When, localized) ->

    return (options) ->

        doLocalize = (facet, options, wire) ->
            target = facet.target
            parseTemplateRx = /\$\{([^}]*)\}/g

            return When(wire({options: facet.options}),
                    (options) ->
                        whatToLocalize = _.result target, facet.options
                        res = whatToLocalize.replace(parseTemplateRx, (m, token) ->
                                return localized[token]
                            )

                        target[facet.options] = res
                        return target
                )

        localizeFacet = (resolver, facet, wire) ->
            resolver.resolve(doLocalize(facet, options, wire))

        context:
            "ready:before": (resolver, wire) ->
                resolver.resolve()

        facets: 
            localize: 
                "ready:before": localizeFacet
