define [
    "underscore"
    "when"
    "meld"
    "rest"
    "rest/interceptor/mime"
    "rest/interceptor/entity"
    "core/servicehub/serviceMap"
    "core/servicehub/response/index"
    "core/util/net/isOnline"
    "core/util/navigation/navigate"
    "core/util/navigation/navigateToError"
], (_, When, meld, rest, mime, entity, serviceMap, serviceResponse, isOnline, navigate, navigateToError) ->

    return (options) ->

        removers = []

        # serviceMap[service][path] can be configured with GET params in curved brackets
        # e.g. "fragmentOne/fragmentTwo/{param}"
        patchPathWithData = (path, data) ->
            dataKeys = _.map _.keys(data), (key) ->
                return "{" + key + "}"

            dataValues  = _.values data

            i = 0
            for key in dataKeys
                path = path.replace(key, dataValues[i])
                i++

            return path

        afterSendRequestAspect = (target) ->
            if target["afterSendRequest"]
                removers.push(meld.after target, "sendRequest", (resultEntityPromise) =>
                    When(resultEntityPromise).then (resultEntity) ->
                        target["afterSendRequest"].call(target, resultEntity))

        service = (facet, options, wire) ->
            target = facet.target
            services = facet.options

            if _.isArray services
                deferred = When.defer()
                target.services = {}
                target.client = rest.wrap(mime).wrap(entity)

                target["sendRequestSuccess"] = (response, serviceName) ->
                    # serviceResponse.storeResponse(serviceName, response)        # store response in localstorage via serviceResponse object
                    deferred.resolve(response)

                target["sendRequestErrback"] = (response) ->
                    navigateToError('js', 'Server response error')

                target["sendRequest"] = (serviceName, data, method) ->
                    data = data || {}
                    path = @services[serviceName].path if @services[serviceName]
                    method = method || "GET"

                    normalizePath = (path, data) ->
                        unless path
                            throw new Error("Path is not defined in service '#{serviceName}'!")
                        switch method
                            when "GET" then path = patchPathWithData(path, data)
                        return path

                    # all is fine
                    path = normalizePath(path, data)

                    talkWithClient = ((target, serviceName) ->
                        target
                            .client({ path: path, data: data, method: method})
                            .done (response) ->
                                    target["sendRequestSuccess"](response, serviceName)
                                , (response) ->
                                    target["sendRequestErrback"](response)
                    ).bind(null, target, serviceName)

                    # talkWithLocalStorage = ((serviceName) ->
                    #     # get response from localstorage via serviceResponse object
                    #     response = serviceResponse.getStoredResponse(serviceName)
                    #     if _.isEmpty response
                    #         alert "Response is empty (no stored response value for service '#{serviceName}')"
                    #     deferred.resolve(response)
                    # ).bind null, serviceName

                    # test first id browser online. it may be promise-based (if ping request)
                    # When(isOnline()).then(talkWithClient, talkWithLocalStorage)

                    console.time("sendRequest")
                    console.timeStamp()
                    When(isOnline()).then(talkWithClient, talkWithClient)

                    return deferred.promise

                afterSendRequestAspect(target)

                _.bindAll target, "sendRequest"

                for serv in services
                    if serviceMap[serv]
                        target.services[serv] = serviceMap[serv]

                    # TODO: return this error to promise reject
                    else
                        throw new Error("Service is not defined! - " + serv)

        bindToServiceFacet = (resolver, facet, wire) ->
            resolver.resolve(service(facet, options, wire))

        return facets: 
            bindToService: 
                ready: bindToServiceFacet
                destroy: (resolver, proxy, wire) ->
                    for remover in removers
                        remover.remove()
                    resolver.resolve()
