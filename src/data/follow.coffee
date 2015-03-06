define [
    "underscore"
    "underscore.string"
    "meld"
    "wire/lib/object"
], (_, _Str, meld, object) ->

    return (options) ->

        removers = []

        isRef = (it) ->
            return it and object.hasOwn(it, '$ref')

        followFacetReady = (resolver, facet, wire) ->
            _.each facet.options, (providerFieldValue, consumerFieldName) ->
                if isRef(providerFieldValue)
                    # one dot access restriction
                    providerRefArray = providerFieldValue.$ref.split(".").slice(0, 2)
                    provider = 
                        "class"     : providerRefArray[0]
                        "method"    : providerRefArray[1]

                    wire({$ref: provider["class"]}).then (providerClass) ->
                        providerFieldSetterName = "set" + _Str.capitalize(provider["method"])

                        # check for corresponding provider field method
                        if !_.isFunction(providerClass[providerFieldSetterName])
                            throw new Error "Method #{providerFieldSetterName} should be defined in object #{provider["class"]} !"
                        else
                            removers.push meld.after providerClass, providerFieldSetterName, (value) ->
                                facet.target[consumerFieldName] = value
                else
                    resolver.reject("Provide wire reference ($ref) as value for key '#{field}'!")
            resolver.resolve()

        followFacetDestroy = (resolver, facet, wire) ->
            for remover in removers
                remover.remove()
            resolver.resolve()

        facets: 
            follow: 
                "ready"     : followFacetReady
                "destroy"   : followFacetDestroy