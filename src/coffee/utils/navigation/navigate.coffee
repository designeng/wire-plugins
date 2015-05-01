define [
    "hasher"
], (hasher) ->
    navigate = (route, mode, tail) ->
        if !mode
            hasher.setHash route

        else if mode is "add" and tail            
            if route is "current"
                currentHash = hasher.getHash()
                hasher.setHash(currentHash + "/" + tail)
            else
                hasher.setHash(route + "/" + tail)

        else if mode is "relative"
            window.location.hash = route

        else if mode is "absolute"
            window.location.href = route

        else if mode is "replace"
            hasher.replaceHash route

